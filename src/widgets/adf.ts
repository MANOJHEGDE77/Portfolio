import { rnd } from '@/lib/random'
import { TAU, ink, monoFont, roundedRect, type Widget } from './types'

type Status = 'wait' | 'run' | 'fail' | 'ok'
interface State {
  status: Status
  step: number
  timer: number
  t: number
  stepDuration: number
  total: number
  failedOnce: boolean
  backoff: number
  runs: number
  lastDuration: number
}

const NODES = ['copy', 'notebook', 'validate', 'notify'] as const
const BACKOFF_SECONDS = 1.6
const WAIT_MAX = 5

/** An ADF pipeline: trigger clock, four activities, a flaky validate step with retry. */
export const adfWidget: Widget<State> = {
  create: () => ({
    status: 'wait', step: -1, timer: 2.5, t: 0, stepDuration: 1, total: 0,
    failedOnce: false, backoff: 0, runs: 0, lastDuration: 0,
  }),

  draw(f, s) {
    const { ctx, w, h, p, dt, now } = f

    if (s.status === 'wait') {
      s.timer -= dt
      if (s.timer <= 0) {
        s.status = 'run'
        s.step = 0
        s.t = 0
        s.stepDuration = rnd(0.7, 1.3)
        s.total = 0
      }
    } else if (s.status === 'run') {
      s.t += dt
      s.total += dt
      if (s.t > s.stepDuration) {
        if (s.step === 2 && !s.failedOnce && Math.random() < 0.4) {
          s.status = 'fail'
          s.failedOnce = true
          s.backoff = BACKOFF_SECONDS
          s.t = 0
        } else {
          s.step += 1
          s.t = 0
          s.stepDuration = rnd(0.7, 1.3)
          if (s.step >= NODES.length) {
            s.status = 'ok'
            s.t = 0
            s.lastDuration = s.total
            s.runs += 1
          }
        }
      }
    } else if (s.status === 'fail') {
      s.backoff -= dt
      s.total += dt
      if (s.backoff <= 0) {
        s.status = 'run'
        s.t = 0
      }
    } else {
      s.t += dt
      if (s.t > 1.5) {
        s.status = 'wait'
        s.timer = rnd(3, 5)
        s.failedOnce = false
        s.step = -1
      }
    }

    ctx.font = monoFont(8.5)
    const cy = h * 0.42
    const tx = 22

    // trigger clock
    ctx.strokeStyle = ink(p, 0.2)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(tx, cy, 10, 0, TAU)
    ctx.stroke()
    const progress = s.status === 'wait' ? 1 - s.timer / WAIT_MAX : 1
    ctx.strokeStyle = p.amber
    ctx.beginPath()
    ctx.arc(tx, cy, 10, -Math.PI / 2, -Math.PI / 2 + Math.max(0, Math.min(1, progress)) * TAU)
    ctx.stroke()
    ctx.fillStyle = ink(p, 0.34)
    ctx.fillText('trigger', tx - 16, cy + 24)

    const x0 = 52
    const gap = (w - x0 - 30) / (NODES.length - 1)
    const boxW = 56
    const boxH = 20
    for (let i = 0; i < NODES.length; i++) {
      const x = x0 + i * gap
      if (i > 0) {
        ctx.strokeStyle = ink(p, s.step > i - 1 && s.status !== 'wait' ? 0.45 : 0.14)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x - gap + boxW / 2, cy)
        ctx.lineTo(x - boxW / 2, cy)
        ctx.stroke()
      }
      const done = s.status === 'ok' || (s.status !== 'wait' && i < s.step)
      const active = s.status === 'run' && i === s.step
      const failed = s.status === 'fail' && i === s.step
      const color = failed ? p.err : done ? p.teal : active ? p.amber : ink(p, 0.16)
      ctx.strokeStyle = color
      ctx.lineWidth = active || failed ? 1.5 : 1
      roundedRect(ctx, x - boxW / 2, cy - boxH / 2, boxW, boxH, 4)
      ctx.stroke()
      if (done || active || failed) {
        ctx.fillStyle = color
        ctx.globalAlpha = active ? 0.35 + Math.sin(now / 120) * 0.15 : 0.16
        ctx.fill()
        ctx.globalAlpha = 1
      }
      if (active) {
        ctx.fillStyle = p.amber
        ctx.fillRect(x - boxW / 2, cy + boxH / 2 - 2, boxW * Math.min(1, s.t / s.stepDuration), 2)
      }
      ctx.fillStyle = failed ? p.err : done || active ? ink(p, 0.9) : ink(p, 0.4)
      ctx.fillText(NODES[i], x - ctx.measureText(NODES[i]).width / 2, cy + 3)
      if (failed) {
        ctx.strokeStyle = p.err
        ctx.setLineDash([2, 3])
        ctx.beginPath()
        ctx.arc(x, cy, 18, 0, TAU * (1 - s.backoff / BACKOFF_SECONDS))
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = p.err
        ctx.fillText(`retry ${s.backoff.toFixed(1)}s`, x - 20, cy - 22)
      }
    }
    ctx.fillStyle = ink(p, 0.3)
    ctx.fillText(`runs ${s.runs}${s.lastDuration ? ` · last ${s.lastDuration.toFixed(1)}s` : ''}`, x0 - boxW / 2, h - 4)

    switch (s.status) {
      case 'wait':
        return { text: `next run in ${Math.max(0, s.timer).toFixed(0)}s`, tone: 'mut' }
      case 'fail':
        return { text: 'validate failed · retrying', tone: 'err' }
      case 'ok':
        return { text: 'succeeded', tone: 'ok' }
      default:
        return { text: `running · ${NODES[Math.min(s.step, NODES.length - 1)]}`, tone: 'mut' }
    }
  },
}
