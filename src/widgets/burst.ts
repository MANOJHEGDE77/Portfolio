import { pick, rnd } from '@/lib/random'
import type { CanvasPalette } from '@/lib/theme'
import { TAU, dot, type Frame } from './types'

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  square: boolean
  life: number
  maxLife: number
}

const MAX_LIFE = 92

/** Confetti in medallion colors, spawned at a click point. */
export function spawnBurst(into: Particle[], x: number, y: number, count: number, spread: number, p: CanvasPalette): void {
  const colors = [p.bronze, p.silver, p.gold, p.teal, p.ember]
  for (let i = 0; i < count; i++) {
    const angle = rnd(0, TAU)
    const speed = rnd(1.4, spread)
    into.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - rnd(1, 4),
      r: rnd(1.5, 3.4),
      color: pick(colors),
      square: Math.random() < 0.5,
      life: rnd(46, MAX_LIFE),
      maxLife: MAX_LIFE,
    })
  }
}

/** Advances and paints particles. Returns true while any are still alive. */
export function drawBurst(f: Frame, parts: Particle[]): boolean {
  const { ctx, h, dt } = f
  const k = dt * 60
  for (let i = parts.length - 1; i >= 0; i--) {
    const q = parts[i]
    q.vy += 0.16 * k
    q.x += q.vx * k
    q.y += q.vy * k
    q.life -= k
    if (q.life <= 0 || q.y > h + 40) {
      parts.splice(i, 1)
      continue
    }
    ctx.globalAlpha = Math.max(0, Math.min(1, q.life / q.maxLife))
    ctx.fillStyle = q.color
    if (q.square) {
      ctx.save()
      ctx.translate(q.x, q.y)
      ctx.rotate(q.life * 0.12)
      ctx.fillRect(-q.r, -q.r, q.r * 2, q.r * 2)
      ctx.restore()
    } else {
      dot(ctx, q.x, q.y, q.r)
    }
    ctx.globalAlpha = 1
  }
  return parts.length > 0
}
