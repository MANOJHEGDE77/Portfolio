import { rnd } from '@/lib/random'
import { ink, monoFont, type Widget } from './types'

interface State { phase: number; t: number; bars: number[]; targets: number[]; idle: number }

const PHASES = ['import', 'transform', 'model', 'render'] as const
const PHASE_SECONDS = 0.8
const IDLE_SECONDS = 4.5
const INITIAL_BARS = [0.4, 0.6, 0.5, 0.7, 0.45, 0.8, 0.55]

/** A Power BI dataset refresh: four-phase ring, then the report bars settle to new values. */
export const powerBiWidget: Widget<State> = {
  create: () => ({ phase: 0, t: 0, bars: [...INITIAL_BARS], targets: [...INITIAL_BARS], idle: 0 }),

  draw(f, s) {
    const { ctx, w, h, p, dt } = f
    const refreshing = s.phase < PHASES.length
    if (refreshing) {
      s.t += dt
      if (s.t > PHASE_SECONDS) {
        s.t = 0
        s.phase += 1
        if (s.phase === PHASES.length) {
          s.targets = s.targets.map(() => rnd(0.25, 0.95))
          s.idle = 0
        }
      }
    } else {
      s.idle += dt
      if (s.idle > IDLE_SECONDS) {
        s.phase = 0
        s.t = 0
      }
    }
    s.bars = s.bars.map((b, i) => b + (s.targets[i] - b) * Math.min(1, dt * 4))

    const cx = 40
    const cy = h / 2
    const r = 26
    ctx.font = monoFont(8.5)
    ctx.lineCap = 'butt'
    PHASES.forEach((_, i) => {
      const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.08
      const a1 = a0 + Math.PI / 2 - 0.16
      const done = i < s.phase
      const active = i === s.phase
      const partial = a0 + (a1 - a0) * Math.min(1, s.t / PHASE_SECONDS)
      ctx.strokeStyle = done ? p.teal : active ? p.amber : ink(p, 0.14)
      ctx.lineWidth = active ? 5 : 3.5
      if (active) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, a0, partial)
        ctx.stroke()
        ctx.strokeStyle = ink(p, 0.14)
        ctx.lineWidth = 3.5
      }
      ctx.beginPath()
      ctx.arc(cx, cy, r, active ? partial : a0, a1)
      ctx.stroke()
    })
    ctx.fillStyle = ink(p, 0.5)
    const label = refreshing ? PHASES[s.phase] : 'fresh'
    ctx.fillText(label, cx - ctx.measureText(label).width / 2, cy + 3)

    const bx = 86
    const barW = (w - bx - 6) / s.bars.length
    s.bars.forEach((v, i) => {
      const barH = v * (h - 24)
      ctx.fillStyle = i === 5 ? p.ember : p.amber
      ctx.globalAlpha = refreshing ? 0.35 : 0.85
      ctx.fillRect(bx + i * barW, h - 10 - barH, barW - 4, barH)
      ctx.globalAlpha = 1
    })
    ctx.strokeStyle = ink(p, 0.2)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(bx, h - 10)
    ctx.lineTo(w - 6, h - 10)
    ctx.stroke()
    ctx.fillStyle = ink(p, 0.3)
    ctx.fillText('gold.sales_by_region', bx, h - 1)

    return refreshing
      ? { text: `refreshing · ${PHASES[s.phase]}`, tone: 'amber' }
      : { text: `refreshed ${Math.floor(s.idle)}s ago · 12 visuals`, tone: 'mut' }
  },
}
