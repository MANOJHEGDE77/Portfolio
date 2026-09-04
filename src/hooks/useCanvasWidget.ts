import { useEffect, useRef } from 'react'
import { subscribeToLoop } from '@/lib/animationLoop'
import { isLowEndDevice } from '@/lib/device'
import { useTheme } from '@/notebook/ThemeContext'
import type { Widget, WidgetLabel } from '@/widgets/types'
import { useLatest } from './useLatest'
import { useReducedMotion } from './useMediaQuery'

interface Options {
  /** Cap on devicePixelRatio. Full-screen canvases should use a lower cap. */
  maxDpr?: number
  /** When false the widget paints one still frame and never animates. */
  active?: boolean
}

const WARMUP_TICKS = 45
const WARMUP_DT = 1 / 30

function applyLabel(el: HTMLElement | null, label: WidgetLabel | undefined): void {
  if (!el || !label) return
  if (el.textContent !== label.text) el.textContent = label.text
  const color = label.tone ? `var(--nb-${label.tone})` : ''
  if (el.style.color !== color) el.style.color = color
}

/**
 * Runs a canvas widget: sizes the canvas for the device pixel ratio, ticks it
 * on the shared animation loop only while it is on screen, and writes the
 * widget's status label straight into `labelRef` (no React re-render per frame).
 * With reduced motion (or `active: false`) it paints a single warmed-up frame,
 * repainted whenever the theme changes.
 */
export function useCanvasWidget<S>(widget: Widget<S>, { maxDpr = 2, active = true }: Options = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const { palette } = useTheme()
  const reducedMotion = useReducedMotion()
  const live = active && !reducedMotion
  const paletteRef = useLatest(palette)
  // Live widgets read the palette through the ref every frame; a still frame
  // has to be repainted when the theme changes, so it depends on the value.
  const stillPalette = live ? null : palette

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const state = widget.create()
    let width = 0
    let height = 0

    const fit = (): void => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(maxDpr, window.devicePixelRatio || 1)
      const pw = Math.round(width * dpr)
      const ph = Math.round(height * dpr)
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = (dt: number, now: number): void => {
      if (width === 0 || height === 0) return
      ctx.clearRect(0, 0, width, height)
      const label = widget.draw(
        { ctx, w: width, h: height, dt, now, p: paletteRef.current, lite: isLowEndDevice },
        state,
      )
      applyLabel(labelRef.current, label)
    }

    const drawStill = (): void => {
      const now = performance.now()
      for (let i = 0; i < WARMUP_TICKS; i++) render(WARMUP_DT, now + i * WARMUP_DT * 1000)
      render(0, now)
    }

    const resizeObserver = new ResizeObserver(() => {
      fit()
      if (!live) drawStill()
    })
    resizeObserver.observe(canvas)
    fit()

    if (!live) {
      drawStill()
      return () => resizeObserver.disconnect()
    }

    let unsubscribe: (() => void) | null = null
    const start = () => {
      unsubscribe ??= subscribeToLoop(render)
    }
    const stop = () => {
      unsubscribe?.()
      unsubscribe = null
    }
    const intersection = new IntersectionObserver(
      ([entry]) => (entry?.isIntersecting ? start() : stop()),
      { rootMargin: '60px' },
    )
    intersection.observe(canvas)

    return () => {
      stop()
      intersection.disconnect()
      resizeObserver.disconnect()
    }
  }, [widget, live, maxDpr, paletteRef, stillPalette])

  return { canvasRef, labelRef }
}
