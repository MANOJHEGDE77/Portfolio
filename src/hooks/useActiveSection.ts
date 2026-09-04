import { useEffect, useState } from 'react'

/**
 * Scroll-spy without a scroll listener: the active section is the one that
 * contains the horizontal line 42% down the viewport.
 */
export function useActiveSection<T extends string>(ids: ReadonlyArray<T>): T {
  const [active, setActive] = useState<T>(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as T)
        }
      },
      { rootMargin: '-42% 0px -58% 0px', threshold: 0 },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
