import { useEffect, useRef } from 'react'
import { subscribeToLoop } from '@/lib/animationLoop'
import { useReducedMotion } from './useMediaQuery'

interface Options {
  suffix?: string
  delayMs?: number
  durationMs?: number
  /** Hold the animation until the surrounding output is actually visible. */
  enabled?: boolean
}

/**
 * Counts a number up from 0 once `enabled` and the element is in view.
 * Writes to the DOM directly on the shared animation loop; the returned ref
 * goes on a <span>.
 */
export function useCountUp(
  target: number,
  { suffix = '', delayMs = 500, durationMs = 1100, enabled = true }: Options = {},
) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    if (reducedMotion) {
      el.textContent = `${target}${suffix}`
      return
    }
    let unsubscribe: (() => void) | null = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        const start = performance.now() + delayMs
        const decimals = target.toString().split('.')[1]?.length ?? 0
        unsubscribe = subscribeToLoop((_dt, now) => {
          const q = Math.max(0, Math.min(1, (now - start) / durationMs))
          const eased = 1 - Math.pow(1 - q, 3)
          const val = decimals > 0 ? (target * eased).toFixed(decimals) : Math.round(target * eased)
          el.textContent = `${val}${suffix}`
          if (q >= 1) {
            unsubscribe?.()
            unsubscribe = null
          }
        })
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      unsubscribe?.()
    }
  }, [target, suffix, delayMs, durationMs, enabled, reducedMotion])

  return ref
}
