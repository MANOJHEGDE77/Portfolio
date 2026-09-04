import { dot, ink, monoFont, type Widget } from './types'

type Tone = 'teal' | 'ember' | 'amber' | 'dim' | 'tt'
interface Row { text: string; tone: Tone; y: number; opacity: number }
interface State { rows: Row[]; scriptIndex: number; t: number; version: number; timeTravel: number; timeTravelVersion: number }

/** [text, tone, bumpsVersion] */
const SCRIPT: ReadonlyArray<readonly [string, Tone, boolean]> = [
  ['WRITE     +3 files · 12,401 rows', 'teal', true],
  ['MERGE     scd2 · closed 27 · opened 27', 'ember', true],
  ['dq gate   nulls 0 · dupes 14 → dropped', 'amber', false],
  ['OPTIMIZE  −14 +2 files · ZORDER (customer_id)', 'dim', true],
  ['SELECT * FROM gold.sales VERSION AS OF ', 'tt', false],
  ['WRITE     +1 file · 3,077 rows', 'teal', true],
  ['_last_checkpoint → ', 'dim', false],
  ['VACUUM    RETAIN 168 HOURS · 41 files removed', 'amber', false],
]
const ROW_H = 15.5
const MAX_ROWS = 7
const ROW_INTERVAL = 0.9

const pad8 = (n: number) => String(n).padStart(8, '0')

/** The Delta transaction log: commits scrolling in, with an occasional time-travel query. */
export const deltaLogWidget: Widget<State> = {
  create: () => ({ rows: [], scriptIndex: 0, t: 0.7, version: 124, timeTravel: 0, timeTravelVersion: 0 }),

  draw(f, s) {
    const { ctx, h, p, dt } = f
    s.t += dt
    if (s.t > ROW_INTERVAL) {
      s.t = 0
      const [base, tone, bumps] = SCRIPT[s.scriptIndex % SCRIPT.length]
      let text = base
      if (bumps) {
        s.version += 1
        text = `${pad8(s.version)}.json  ${text}`
      } else if (tone === 'tt') {
        s.timeTravelVersion = s.version - 3
        text += s.timeTravelVersion
        s.timeTravel = 1
      } else if (text.includes('checkpoint')) {
        text += pad8(s.version)
      }
      s.rows.push({ text, tone, y: h, opacity: 0 })
      s.scriptIndex += 1
      if (s.rows.length > MAX_ROWS) s.rows.shift()
    }
    s.timeTravel = Math.max(0, s.timeTravel - dt * 0.7)
    s.rows.forEach((r, k) => {
      const target = 14 + k * ROW_H
      r.y += (target - r.y) * Math.min(1, dt * 7)
      r.opacity += (1 - r.opacity) * Math.min(1, dt * 5)
    })

    ctx.strokeStyle = ink(p, 0.13)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(8, 6)
    ctx.lineTo(8, h - 6)
    ctx.stroke()
    ctx.font = monoFont(8.5)
    const toneColor = (tone: Tone) =>
      tone === 'teal' ? p.teal : tone === 'ember' ? p.ember : tone === 'amber' ? p.amber : tone === 'tt' ? p.gold : ink(p, 0.4)
    s.rows.forEach((r, k) => {
      const last = k === s.rows.length - 1
      ctx.globalAlpha = r.opacity * (k === 0 && s.rows.length > 6 ? 0.35 : 1)
      ctx.fillStyle = toneColor(r.tone)
      dot(ctx, 8, r.y - 3, last ? 3.2 : 2.2)
      ctx.fillStyle = r.tone === 'tt' ? p.gold : last ? ink(p, 0.88) : ink(p, 0.5)
      ctx.fillText(r.text, 18, r.y)
      ctx.globalAlpha = 1
    })
    if (s.timeTravel > 0 && s.rows.length > 3) {
      // time-travel arrow: from the latest row back up 3 commits
      const a = s.rows[s.rows.length - 1].y - 3
      const b = s.rows[Math.max(0, s.rows.length - 4)].y - 3
      ctx.strokeStyle = p.gold
      ctx.globalAlpha = s.timeTravel
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(8, a)
      ctx.quadraticCurveTo(-6, (a + b) / 2, 8, b)
      ctx.stroke()
      ctx.fillStyle = p.gold
      ctx.beginPath()
      ctx.moveTo(8, b)
      ctx.lineTo(4, b + 5)
      ctx.lineTo(12, b + 5)
      ctx.fill()
      ctx.globalAlpha = 1
    }
    return s.timeTravel > 0
      ? { text: `time travel → v${s.timeTravelVersion}`, tone: 'gold' }
      : { text: `v ${s.version}`, tone: 'mut' }
  },
}
