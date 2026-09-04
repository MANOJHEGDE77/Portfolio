import { rnd } from '@/lib/random'
import { dot, glow, ink, monoFont, unglow, type Widget } from './types'

type Phase = 'run' | 'shuffle' | 'done'
interface State { job: number; stage: number; fill: number[]; phase: Phase; st: number }

const STAGES = 4
const EXECUTORS = 3
const SLOTS = 8

/** A Spark job: stages on a DAG, tasks filling executor slots, shuffles between stages. */
export const sparkJobWidget: Widget<State> = {
  create: () => ({ job: 41, stage: 0, fill: new Array<number>(EXECUTORS * SLOTS).fill(0), phase: 'run', st: 0 }),

  draw(f, s) {
    const { ctx, w, h, p, dt } = f
    const sx = (i: number) => 18 + (i * (w - 36)) / (STAGES - 1)
    const sy = 14

    if (s.phase === 'run') {
      for (let k = 0; k < 5; k++) {
        const i = Math.floor(Math.random() * s.fill.length)
        s.fill[i] = Math.min(1, s.fill[i] + dt * rnd(1.2, 3.2))
      }
      if (s.fill.every((v) => v >= 1)) {
        s.phase = s.stage >= STAGES - 1 ? 'done' : 'shuffle'
        s.st = 0
      }
    } else if (s.phase === 'shuffle') {
      s.st += dt * 2.2
      if (s.st >= 1) {
        s.stage += 1
        s.fill.fill(0)
        s.phase = 'run'
      }
    } else {
      s.st += dt
      if (s.st > 1.2) {
        s.job += 1
        s.stage = 0
        s.fill.fill(0)
        s.phase = 'run'
      }
    }

    ctx.font = monoFont(8.5)
    for (let i = 0; i < STAGES - 1; i++) {
      ctx.strokeStyle = ink(p, i < s.stage ? 0.4 : 0.14)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(sx(i) + 7, sy)
      ctx.lineTo(sx(i + 1) - 7, sy)
      ctx.stroke()
    }
    for (let i = 0; i < STAGES; i++) {
      const done = i < s.stage || s.phase === 'done'
      const active = i === s.stage && s.phase !== 'done'
      ctx.fillStyle = done ? p.teal : active ? p.amber : ink(p, 0.18)
      if (active) glow(f, p.amber, 10)
      dot(ctx, sx(i), sy, 5.5)
      unglow(f)
      ctx.fillStyle = ink(p, 0.34)
      ctx.fillText(`s${i}`, sx(i) - 5, sy + 17)
    }
    if (s.phase === 'shuffle') {
      const x = sx(s.stage) + (sx(s.stage + 1) - sx(s.stage)) * s.st
      ctx.fillStyle = p.ember
      glow(f, p.ember, 10)
      dot(ctx, x, sy, 3)
      unglow(f)
      ctx.fillText('shuffle', x - 16, sy - 9)
    }

    const laneY = 44
    const laneH = (h - laneY - 4) / EXECUTORS
    const slotW = (w - 44) / SLOTS
    for (let l = 0; l < EXECUTORS; l++) {
      const y = laneY + l * laneH
      ctx.fillStyle = ink(p, 0.32)
      ctx.fillText(`ex${l}`, 2, y + laneH / 2 + 3)
      for (let k = 0; k < SLOTS; k++) {
        const v = s.fill[l * SLOTS + k]
        const x = 30 + k * slotW
        ctx.fillStyle = ink(p, 0.07)
        ctx.fillRect(x, y + 3, slotW - 3, laneH - 6)
        if (v > 0) {
          ctx.fillStyle = v >= 1 ? p.teal : p.amber
          ctx.globalAlpha = v >= 1 ? 0.75 : 0.9
          ctx.fillRect(x, y + 3, (slotW - 3) * v, laneH - 6)
          ctx.globalAlpha = 1
        }
      }
    }
    return {
      text: s.phase === 'done' ? `job #${s.job} succeeded` : `job #${s.job} · stage ${s.stage + 1}/${STAGES}`,
      tone: 'mut',
    }
  },
}
