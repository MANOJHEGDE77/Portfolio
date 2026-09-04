import type { CanvasPalette } from '@/lib/theme'

export interface Frame {
  ctx: CanvasRenderingContext2D
  /** CSS pixel size of the canvas. The context is already DPR-scaled. */
  w: number
  h: number
  /** Seconds since the previous frame, clamped. 0 for a still frame. */
  dt: number
  /** performance.now() timestamp for pulses that should not depend on dt. */
  now: number
  p: CanvasPalette
  /** Low-end device: skip expensive effects such as shadow blur. */
  lite: boolean
}

export type LabelTone = 'amber' | 'teal' | 'ok' | 'err' | 'gold' | 'mut' | 'txt'

export interface WidgetLabel {
  text: string
  tone?: LabelTone
}

/**
 * A canvas widget is a pure simulation: `create` builds its state, `draw`
 * advances it by `dt` and paints one frame. No DOM access, no React.
 */
export interface Widget<S> {
  create(): S
  draw(frame: Frame, state: S): WidgetLabel | undefined
}

export const TAU = Math.PI * 2

export function monoFont(px: number): string {
  return `500 ${px}px "DM Mono", ui-monospace, monospace`
}

/** Text color at an alpha, for the current theme. */
export function ink(p: CanvasPalette, alpha: number): string {
  return `rgba(${p.txt},${alpha})`
}

export function glow(f: Frame, color: string, blur: number): void {
  if (f.lite) return
  f.ctx.shadowColor = color
  f.ctx.shadowBlur = blur
}

export function unglow(f: Frame): void {
  f.ctx.shadowBlur = 0
}

export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
}

export function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r)
  else ctx.rect(x, y, w, h)
}
