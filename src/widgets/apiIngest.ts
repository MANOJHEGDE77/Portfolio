import { rnd } from '@/lib/random'
import { dot, glow, ink, monoFont, roundedRect, unglow, type Widget } from './types'

interface Request { t: number; ok: boolean; y: number }
interface State { tokens: number; capacity: number; requests: Request[]; spawn: number; ok: number; limited: number; backoff: number; burst: number }

const BACKOFF_SECONDS = 1.4

/** API ingestion through a token bucket: bursts, 429s, backoff, resume. */
export const apiIngestWidget: Widget<State> = {
  create: () => ({ tokens: 6, capacity: 8, requests: [], spawn: 0, ok: 0, limited: 0, backoff: 0, burst: 0 }),

  draw(f, s) {
    const { ctx, w, h, p, dt } = f
    s.tokens = Math.min(s.capacity, s.tokens + dt * 1.7)
    s.backoff = Math.max(0, s.backoff - dt)
    s.spawn -= dt
    if (s.spawn <= 0 && s.backoff <= 0) {
      s.spawn = s.burst > 0 ? 0.12 : rnd(0.25, 0.7)
      s.burst = s.burst > 0 ? s.burst - 1 : Math.random() < 0.25 ? 6 : 0
      if (s.tokens >= 1) {
        s.tokens -= 1
        s.requests.push({ t: 0, ok: true, y: rnd(-14, 14) })
      } else {
        s.requests.push({ t: 0, ok: false, y: rnd(-14, 14) })
        s.backoff = BACKOFF_SECONDS
        s.burst = 0
      }
    }
    const x0 = 58
    const x1 = w - 62
    const cy = h * 0.46
    for (let i = s.requests.length - 1; i >= 0; i--) {
      const q = s.requests[i]
      q.t += dt * 1.6
      if (q.t >= 2) {
        if (q.ok) s.ok += 1
        else s.limited += 1
        s.requests.splice(i, 1)
      }
    }

    ctx.font = monoFont(8.5)
    // token bucket
    const bx = 8
    const by = 14
    const bucketW = 18
    const bucketH = h - 40
    ctx.strokeStyle = ink(p, 0.2)
    ctx.lineWidth = 1
    ctx.strokeRect(bx, by, bucketW, bucketH)
    for (let i = 0; i < s.capacity; i++) {
      const filled = i < Math.floor(s.tokens)
      const partial = i === Math.floor(s.tokens) ? s.tokens % 1 : 0
      const y = by + bucketH - (i + 1) * (bucketH / s.capacity) + 1.5
      ctx.fillStyle = s.backoff > 0 ? p.err : p.teal
      ctx.globalAlpha = filled ? 0.8 : partial * 0.5
      ctx.fillRect(bx + 2, y, bucketW - 4, bucketH / s.capacity - 3)
      ctx.globalAlpha = 1
    }
    ctx.fillStyle = ink(p, 0.34)
    ctx.fillText('tokens', 2, h - 14)
    ctx.fillText('client', x0 - 12, cy + 26)
    ctx.strokeStyle = ink(p, 0.14)
    ctx.beginPath()
    ctx.moveTo(x0, cy)
    ctx.lineTo(x1, cy)
    ctx.stroke()
    ctx.fillStyle = ink(p, 0.5)
    dot(ctx, x0, cy, 4)
    ctx.strokeStyle = ink(p, 0.3)
    roundedRect(ctx, x1, cy - 11, 54, 22, 4)
    ctx.stroke()
    ctx.fillStyle = ink(p, 0.7)
    ctx.fillText('/orders', x1 + 8, cy + 3)

    for (const q of s.requests) {
      const outbound = q.t < 1
      const e = outbound ? q.t : q.t - 1
      const x = outbound ? x0 + (x1 - x0) * e : x1 - (x1 - x0) * e
      const color = outbound ? ink(p, 0.6) : q.ok ? p.teal : p.err
      ctx.fillStyle = color
      if (!outbound) glow(f, color, 8)
      dot(ctx, x, cy + q.y * (outbound ? e : 1 - e), outbound ? 2.2 : 2.8)
      unglow(f)
      if (!outbound && e < 0.3) {
        ctx.fillStyle = color
        ctx.fillText(q.ok ? '200' : '429', x - 8, cy + q.y - 8)
      }
    }
    if (s.backoff > 0) {
      ctx.fillStyle = p.err
      ctx.fillText(`backoff ${s.backoff.toFixed(1)}s`, x0 + 10, 10)
    }
    return { text: `200 × ${s.ok} · 429 × ${s.limited}`, tone: s.backoff > 0 ? 'err' : 'teal' }
  },
}
