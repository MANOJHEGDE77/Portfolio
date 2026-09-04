import { rnd } from '@/lib/random'
import { TAU, dot, glow, ink, monoFont, unglow, type Widget } from './types'

const MESH_LABELS = [
  'databricks', 'spark', 'delta', 'adf', 's3', 'adls', 'snowflake', 'postgres',
  'mssql', 'python', 'sql', 'power bi', 'entra id', 'rest api', 'git',
]
/** Below this width the backdrop draws nothing. Background.tsx uses the same value. */
export const BACKGROUND_MIN_WIDTH = 560
const MAX_PARTS = 60
const ZONE_LABELS = ['bronze · raw', 'silver · validated', 'gold · aggregated'] as const
const ZONE_JITTER = [4.5, 1.4, 0] as const

interface Node { x: number; y: number; vx: number; vy: number; label: string; r: number }
interface Packet { a: number; b: number; t: number; speed: number }
interface Part { x: number; y: number; v: number; seed: number; bad: boolean; rejected: boolean; vy: number; alpha: number }

interface State {
  w: number
  h: number
  nodes: Node[]
  packets: Packet[]
  parts: Part[]
  spawn: number
  t: number
}

function nodeCountFor(w: number): number {
  return w < 640 ? 7 : w < 1100 ? 10 : MESH_LABELS.length
}

function seed(s: State, w: number, h: number): void {
  const n = nodeCountFor(w)
  s.nodes = Array.from({ length: n }, (_, i) => ({
    x: Math.random() * w,
    y: Math.random() * h * 0.7,
    vx: rnd(-0.07, 0.07),
    vy: rnd(-0.07, 0.07),
    label: MESH_LABELS[i % MESH_LABELS.length],
    r: rnd(1.8, 3.2),
  }))
  s.packets = Array.from({ length: Math.min(7, n) }, (_, i) => ({
    a: i % n,
    b: (i + 3) % n,
    t: Math.random(),
    speed: rnd(0.0016, 0.0042),
  }))
}

/**
 * Keep the mesh continuous across resizes (mobile URL bar, window drags):
 * scale existing positions into the new bounds and only re-seed when the
 * node count bucket changes.
 */
function resize(s: State, w: number, h: number): void {
  if (s.nodes.length === 0 || nodeCountFor(w) !== s.nodes.length) {
    seed(s, w, h)
  } else {
    const sx = w / s.w
    const sy = h / s.h
    for (const q of s.nodes) {
      q.x *= sx
      q.y *= sy
    }
    for (const q of s.parts) {
      q.x *= sx
      q.y *= sy
    }
  }
  s.w = w
  s.h = h
}

/** Full-page backdrop: a drifting lakehouse mesh plus a bronze/silver/gold flow band. */
export const backgroundWidget: Widget<State> = {
  create: () => ({ w: 0, h: 0, nodes: [], packets: [], parts: [], spawn: 0, t: 0 }),

  draw(f, s) {
    const { ctx, w, h, p, dt } = f
    if (w < BACKGROUND_MIN_WIDTH) return
    if (s.w !== w || s.h !== h) resize(s, w, h)
    const k = dt * 60 // per-frame constants from the design, made frame-rate independent

    // mesh
    const maxDist = w < 900 ? 180 : 250
    for (const q of s.nodes) {
      q.x += q.vx * k
      q.y += q.vy * k
      if (q.x < 0 || q.x > w) q.vx *= -1
      if (q.y < 0 || q.y > h * 0.72) q.vy *= -1
    }
    ctx.lineWidth = 1
    for (let i = 0; i < s.nodes.length; i++) {
      for (let j = i + 1; j < s.nodes.length; j++) {
        const a = s.nodes[i]
        const b = s.nodes[j]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d >= maxDist) continue
        ctx.strokeStyle = ink(p, +(0.11 * (1 - d / maxDist)).toFixed(3))
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
    ctx.font = monoFont(9.5)
    const nodeInk = ink(p, 0.42)
    const labelInk = ink(p, 0.22)
    for (const q of s.nodes) {
      ctx.fillStyle = nodeInk
      dot(ctx, q.x, q.y, q.r)
      ctx.fillStyle = labelInk
      ctx.fillText(q.label, q.x + 8, q.y + 3.5)
    }
    for (const q of s.packets) {
      const a = s.nodes[q.a % s.nodes.length]
      const b = s.nodes[q.b % s.nodes.length]
      if (!a || !b) continue
      q.t += q.speed * k
      if (q.t > 1) {
        q.t = 0
        q.a = Math.floor(Math.random() * s.nodes.length)
        q.b = Math.floor(Math.random() * s.nodes.length)
      }
      ctx.fillStyle = p.teal
      glow(f, p.teal, 9)
      dot(ctx, a.x + (b.x - a.x) * q.t, a.y + (b.y - a.y) * q.t, 1.9)
      unglow(f)
    }

    // medallion flow band along the bottom
    s.t += dt
    const y0 = h * 0.74
    const bandH = h * 0.16
    const z0 = w * 0.04
    const z1 = w * 0.36
    const z2 = w * 0.66
    const z3 = w * 0.97
    const zoneColor = [p.bronze, p.silver, p.gold]
    const zoneX = [z0, z1, z2, z3]
    ctx.font = monoFont(9.5)
    const bandInk = ink(p, 0.26)
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = zoneColor[i]
      ctx.globalAlpha = 0.04
      ctx.fillRect(zoneX[i], y0, zoneX[i + 1] - zoneX[i], bandH)
      ctx.globalAlpha = 1
      ctx.fillStyle = bandInk
      ctx.fillText(ZONE_LABELS[i], zoneX[i] + 8, y0 - 8)
      if (i > 0) {
        ctx.strokeStyle = ink(p, 0.14)
        ctx.setLineDash([3, 5])
        ctx.beginPath()
        ctx.moveTo(zoneX[i], y0 - 4)
        ctx.lineTo(zoneX[i], y0 + bandH + 4)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
    s.spawn -= dt
    if (s.spawn <= 0 && s.parts.length < MAX_PARTS) {
      s.spawn = rnd(0.08, 0.22)
      s.parts.push({
        x: z0 - 10, y: y0 + rnd(8, bandH - 8), v: rnd(46, 82), seed: Math.random() * TAU,
        bad: Math.random() < 0.16, rejected: false, vy: 0, alpha: 1,
      })
    }
    for (let i = s.parts.length - 1; i >= 0; i--) {
      const q = s.parts[i]
      q.x += q.v * dt
      const zone = q.x < z1 ? 0 : q.x < z2 ? 1 : 2
      if (q.bad && zone >= 1 && !q.rejected) q.rejected = true
      if (q.rejected) {
        q.vy += 160 * dt
        q.y += q.vy * dt
        q.alpha -= dt * 1.4
        if (q.alpha <= 0) { s.parts.splice(i, 1); continue }
      }
      if (q.x > z3) { s.parts.splice(i, 1); continue }
      const jitter = ZONE_JITTER[zone] * Math.sin(s.t * 9 + q.seed)
      ctx.globalAlpha = Math.max(0, q.alpha) * (zone === 2 ? 0.9 : 0.7)
      ctx.fillStyle = q.rejected ? p.err : zoneColor[zone]
      if (zone === 0 && !q.rejected) {
        ctx.save()
        ctx.translate(q.x, q.y + jitter)
        ctx.rotate(s.t * 2 + q.seed)
        ctx.fillRect(-2.2, -2.2, 4.4, 4.4)
        ctx.restore()
      } else {
        if (zone === 2) glow(f, p.gold, 8)
        dot(ctx, q.x, q.y + jitter, zone === 2 ? 2.6 : 2.1)
        unglow(f)
      }
      ctx.globalAlpha = 1
    }
    return undefined
  },
}
