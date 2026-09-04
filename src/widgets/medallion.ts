import { formatInt } from '@/lib/format'
import { rnd } from '@/lib/random'
import { TAU, dot, ink, monoFont, type Widget } from './types'

interface Part { x: number; y: number; v: number; seed: number; bad: boolean; rejected: boolean; vy: number; alpha: number }
interface State { parts: Part[]; spawn: number; t: number; rows: number; rejected: number; bars: number[] }

const ZONES = ['bronze', 'silver', 'gold'] as const
const MAX_PARTS = 40

/** Bronze → silver → gold flow with a DQ gate and gold aggregate bars. */
export const medallionWidget: Widget<State> = {
  create: () => ({ parts: [], spawn: 0, t: 0, rows: 0, rejected: 0, bars: [0.2, 0.35, 0.15, 0.5] }),

  draw(f, s) {
    const { ctx, w, h, p, dt } = f
    s.t += dt
    const z = [4, w * 0.34, w * 0.64, w - 4]
    const zoneColor = [p.bronze, p.silver, p.gold]

    ctx.font = monoFont(8.5)
    ZONES.forEach((name, i) => {
      ctx.fillStyle = zoneColor[i]
      ctx.globalAlpha = 0.06
      ctx.fillRect(z[i], 14, z[i + 1] - z[i] - 2, h - 26)
      ctx.globalAlpha = 1
      ctx.fillStyle = ink(p, 0.38)
      ctx.fillText(name, z[i] + 4, 9)
    })

    // dq gate
    ctx.strokeStyle = p.teal
    ctx.lineWidth = 1
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(z[1], 14)
    ctx.lineTo(z[1], h - 12)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = ink(p, 0.3)
    ctx.fillText('dq gate', z[1] - 20, h - 2)

    // gold aggregate bars
    const barW = (z[3] - z[2] - 16) / 4
    s.bars.forEach((b, i) => {
      const barH = b * (h - 40)
      ctx.fillStyle = p.gold
      ctx.globalAlpha = 0.55
      ctx.fillRect(z[2] + 8 + i * barW, h - 14 - barH, barW - 4, barH)
      ctx.globalAlpha = 1
    })

    s.spawn -= dt
    if (s.spawn <= 0 && s.parts.length < MAX_PARTS) {
      s.spawn = rnd(0.07, 0.2)
      s.parts.push({
        x: -4, y: rnd(20, h - 20), v: rnd(60, 110), seed: Math.random() * TAU,
        bad: Math.random() < 0.18, rejected: false, vy: 0, alpha: 1,
      })
    }
    for (let i = s.parts.length - 1; i >= 0; i--) {
      const q = s.parts[i]
      q.x += q.v * dt
      const zone = q.x < z[1] ? 0 : q.x < z[2] ? 1 : 2
      if (q.bad && zone >= 1 && !q.rejected) {
        q.rejected = true
        s.rejected += 1
      }
      if (q.rejected) {
        q.vy += 260 * dt
        q.y += q.vy * dt
        q.alpha -= dt * 2
        if (q.alpha <= 0 || q.y > h) { s.parts.splice(i, 1); continue }
      } else if (zone === 2 && q.x > z[2] + 10) {
        const k = Math.floor(Math.random() * 4)
        s.bars[k] = s.bars[k] >= 1 ? 0.12 : s.bars[k] + 0.06
        s.rows += Math.round(rnd(180, 640))
        s.parts.splice(i, 1)
        continue
      }
      const jitter = [3.5, 1.1, 0][zone] * Math.sin(s.t * 10 + q.seed)
      ctx.globalAlpha = Math.max(0, q.alpha)
      ctx.fillStyle = q.rejected ? p.err : zoneColor[zone]
      if (zone === 0 && !q.rejected) {
        ctx.save()
        ctx.translate(q.x, q.y + jitter)
        ctx.rotate(s.t * 3 + q.seed)
        ctx.fillRect(-2.4, -2.4, 4.8, 4.8)
        ctx.restore()
      } else {
        dot(ctx, q.x, q.y + jitter, 2.3)
      }
      ctx.globalAlpha = 1
    }
    return { text: `rows ${formatInt(s.rows)} · rejected ${s.rejected}`, tone: 'amber' }
  },
}
