import { useEffect, useRef } from 'react'
import { useLatest } from '@/hooks/useLatest'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { subscribeToLoop } from '@/lib/animationLoop'
import { isLowEndDevice } from '@/lib/device'
import { useNotebookActions } from '@/notebook/NotebookContext'
import { useTheme } from '@/notebook/ThemeContext'
import { drawBurst, spawnBurst, type Particle } from '@/widgets/burst'

/** Full-screen overlay for click confetti. Only ticks while particles are alive. */
export function BurstCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { bursts } = useNotebookActions()
  const { palette } = useTheme()
  const reducedMotion = useReducedMotion()
  const paletteRef = useLatest(palette)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || reducedMotion) return

    const parts: Particle[] = []
    let unsubscribeLoop: (() => void) | null = null
    let width = 0
    let height = 0

    const fit = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(isLowEndDevice ? 1 : 1.5, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = (dt: number, now: number) => {
      ctx.clearRect(0, 0, width, height)
      const alive = drawBurst({ ctx, w: width, h: height, dt, now, p: paletteRef.current, lite: isLowEndDevice }, parts)
      if (!alive) {
        unsubscribeLoop?.()
        unsubscribeLoop = null
        ctx.clearRect(0, 0, width, height)
      }
    }

    const unsubscribeBursts = bursts.subscribe(({ x, y, count, spread }) => {
      if (!unsubscribeLoop) {
        fit()
        unsubscribeLoop = subscribeToLoop(tick)
      }
      spawnBurst(parts, x, y, count, spread, paletteRef.current)
    })

    return () => {
      unsubscribeBursts()
      unsubscribeLoop?.()
      ctx.clearRect(0, 0, width, height)
    }
  }, [bursts, reducedMotion, paletteRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-92 size-full" />
}
