import { subscribeToLoop } from './animationLoop'
import { createEmitter } from './emitter'
import { rnd } from './random'

export interface LiveStats {
  /** Simulated rows per second. */
  ingest: number
  /** Simulated data-quality pass rate in percent. */
  dqPass: number
}

/** The figures are decorative; 8 updates a second reads as "live" at a fraction of the DOM work. */
const EMIT_INTERVAL = 1 / 8

const emitter = createEmitter<LiveStats>()
let unsubscribeLoop: (() => void) | null = null
let t = 0
let sinceEmit = 0
let ingest = 0

function tick(dt: number): void {
  t += dt
  sinceEmit += dt
  const target = 9000 + Math.sin(t * 0.7) * 2600 + Math.sin(t * 2.3) * 900 + rnd(-300, 300)
  // Exponential approach, frame-rate independent (~5% per 60Hz frame).
  ingest += (target - ingest) * (1 - Math.pow(0.95, dt * 60))
  if (sinceEmit < EMIT_INTERVAL) return
  sinceEmit = 0
  emitter.emit({ ingest, dqPass: 98.4 + Math.sin(t * 0.4) * 0.9 })
}

/** A single value for reduced-motion visitors so the UI is never blank. */
export const STATIC_STATS: LiveStats = { ingest: 9000, dqPass: 98.4 }

/**
 * Subscribe to the simulated ingest figures. The simulation only runs while at
 * least one subscriber exists.
 */
export function subscribeLiveStats(listener: (stats: LiveStats) => void): () => void {
  const unsubscribe = emitter.subscribe(listener)
  if (!unsubscribeLoop) unsubscribeLoop = subscribeToLoop(tick)
  return () => {
    unsubscribe()
    if (emitter.size === 0 && unsubscribeLoop) {
      unsubscribeLoop()
      unsubscribeLoop = null
    }
  }
}
