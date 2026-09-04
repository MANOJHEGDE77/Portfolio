import { useEffect, useRef } from 'react'
import { useLiveStatText } from '@/hooks/useLiveStatText'
import { formatInt, formatIstClock } from '@/lib/format'
import { useNotebookState } from '@/notebook/NotebookContext'

/** Bottom status strip: cell progress, simulated ingest, scroll depth, IST clock. */
export function StatusBar() {
  const { executedCount, cellCount } = useNotebookState()
  const ingestRef = useLiveStatText((s) => `ingest ${formatInt(s.ingest)} rows/s`)
  const dqRef = useLiveStatText((s) => `dq pass ${s.dqPass.toFixed(1)}%`)
  const scrollRef = useRef<HTMLSpanElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)

  // Scroll depth, throttled to one write per frame, straight to the DOM.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const percent = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (scrollRef.current) scrollRef.current.textContent = `${Math.round(percent * 100)}%`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const tick = () => {
      if (clockRef.current) clockRef.current.textContent = formatIstClock(new Date())
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const complete = executedCount === cellCount

  return (
    <footer className="chrome-bar fixed inset-x-0 bottom-0 z-60 flex h-(--chrome-bottom) items-center gap-[18px] overflow-hidden border-t border-nb-line px-[clamp(14px,2.4vw,28px)] font-mono text-[10.5px] whitespace-nowrap text-nb-dim">
      <span className="flex items-center gap-[7px]">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-nb-ok motion-safe:animate-[nb-blink_2s_ease-in-out_infinite]" />
        <span>
          {executedCount}/{cellCount} cells{complete ? ' · run complete' : ''}
        </span>
      </span>
      <span ref={ingestRef} className="text-nb-mut">
        ingest 0 rows/s
      </span>
      <span ref={dqRef} className="hidden sm:inline">
        dq pass
      </span>
      <span className="hidden md:inline">java 21 · spring boot 3.x</span>
      <span className="flex-1" />
      <span ref={scrollRef}>0%</span>
      <span ref={clockRef} />
      <span className="hidden sm:inline">IST</span>
    </footer>
  )
}
