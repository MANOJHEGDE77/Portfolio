import { isLowEndDevice } from './device'

export type Tick = (dt: number, now: number) => void

const MAX_DT = 0.05
const MIN_FRAME = isLowEndDevice ? 1 / 30 : 0
// rAF timestamps are coarsened by browsers; without slack two 60Hz frames
// (~33.33ms) land on either side of 1/30s and the cadence alternates 2/3 frames.
const FRAME_SLACK = 0.002

const ticks = new Set<Tick>()
let rafId = 0
let last = 0
let elapsed = 0

function schedule(): void {
  if (rafId || document.hidden || ticks.size === 0) return
  rafId = requestAnimationFrame(frame)
}

function frame(now: number): void {
  rafId = 0
  const raw = last ? (now - last) / 1000 : 1 / 60
  last = now
  elapsed += raw
  if (elapsed >= MIN_FRAME - FRAME_SLACK) {
    const dt = Math.min(elapsed, MAX_DT)
    elapsed = 0
    for (const tick of ticks) tick(dt, now)
  }
  schedule()
}

function stop(): void {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
  last = 0
  elapsed = 0
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else schedule()
  })
}

/**
 * One shared requestAnimationFrame loop for every animation on the page.
 * Subscribers get a real, clamped delta in seconds. The loop stops itself when
 * nobody is subscribed or the tab is hidden; on low-end devices it ticks at 30fps.
 */
export function subscribeToLoop(tick: Tick): () => void {
  ticks.add(tick)
  schedule()
  return () => {
    ticks.delete(tick)
    if (ticks.size === 0) stop()
  }
}
