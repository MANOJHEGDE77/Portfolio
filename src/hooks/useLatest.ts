import { useEffect, useRef, type RefObject } from 'react'

/**
 * A ref that always holds the latest value, for callbacks that run outside
 * React's render cycle (animation loops, subscriptions).
 */
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
