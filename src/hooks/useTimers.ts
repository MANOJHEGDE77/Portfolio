import { useEffect, useMemo, useRef } from 'react'

export interface Timers {
  set(fn: () => void, ms: number): number
  clear(): void
}

/** setTimeout that is automatically cleared when the component unmounts. */
export function useTimers(): Timers {
  const ids = useRef(new Set<number>())

  useEffect(() => {
    const pending = ids.current
    return () => {
      for (const id of pending) window.clearTimeout(id)
      pending.clear()
    }
  }, [])

  return useMemo(
    () => ({
      set(fn, ms) {
        const id = window.setTimeout(() => {
          ids.current.delete(id)
          fn()
        }, ms)
        ids.current.add(id)
        return id
      },
      clear() {
        for (const id of ids.current) window.clearTimeout(id)
        ids.current.clear()
      },
    }),
    [],
  )
}
