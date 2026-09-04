import { useEffect, useEffectEvent, useRef } from 'react'
import { STATIC_STATS, subscribeLiveStats, type LiveStats } from '@/lib/liveStats'
import { useReducedMotion } from './useMediaQuery'

/**
 * Binds an element's text to the simulated live stats. Updates happen on the
 * animation loop and bypass React state on purpose; unchanged text is skipped.
 */
export function useLiveStatText(format: (stats: LiveStats) => string) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const formatLatest = useEffectEvent(format)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion) {
      el.textContent = formatLatest(STATIC_STATS)
      return
    }
    return subscribeLiveStats((stats) => {
      const text = formatLatest(stats)
      if (el.textContent !== text) el.textContent = text
    })
  }, [reducedMotion])

  return ref
}
