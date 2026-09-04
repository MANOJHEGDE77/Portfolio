import { useEffect, useRef, useState } from 'react'
import { PROFILE } from '@/content/profile'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { useTimers } from '@/hooks/useTimers'
import { subscribeToLoop } from '@/lib/animationLoop'
import { BOOT_BAR_MS, BOOT_MS } from '@/lib/motion'
import { useNotebookActions } from '@/notebook/NotebookContext'

const BOOT_LINES = [
  `jvm 21 · spring boot ready · ${PROFILE.cluster.workers} worker threads`,
  'database · mysql & mongodb pool initialized',
  'api · restful controller endpoints mapped',
  'security · jwt filter & aes-256 armed',
] as const

/**
 * The "attaching notebook to cluster" intro. Any click, the focused skip
 * button, or Escape dismisses it; the notebook starts executing once it is gone.
 */
export function BootScreen() {
  const reducedMotion = useReducedMotion()
  const { markBooted } = useNotebookActions()
  const [visible, setVisible] = useState(() => !reducedMotion)
  const pctRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const spinnerRef = useRef<HTMLSpanElement>(null)
  const timers = useTimers()

  useEffect(() => {
    if (!visible) markBooted()
  }, [visible, markBooted])

  useEffect(() => {
    if (!visible) return
    document.body.style.overflow = 'hidden'
    const start = performance.now()
    let unsubscribe: (() => void) | null = subscribeToLoop((_dt, now) => {
      const progress = Math.min(1, (now - start) / BOOT_BAR_MS)
      if (pctRef.current) pctRef.current.textContent = `${Math.round(progress * 100)}%`
      if (barRef.current) barRef.current.style.width = `${progress * 100}%`
      if (progress >= 1) {
        spinnerRef.current?.setAttribute('data-done', '')
        unsubscribe?.()
        unsubscribe = null
      }
    })
    timers.set(() => setVisible(false), BOOT_MS)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setVisible(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      unsubscribe?.()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [visible, timers])

  if (!visible) return null

  const skip = () => setVisible(false)

  return (
    <div
      onClick={skip}
      className="fixed inset-0 z-95 flex cursor-pointer items-center justify-center bg-nb-bg"
      style={{ animation: `nb-boot ${BOOT_MS}ms ease forwards` }}
    >
      <div className="w-[min(560px,92vw)] font-mono text-[12.5px] text-nb-mut">
        <div className="flex items-center gap-2.5">
          <span
            ref={spinnerRef}
            aria-hidden="true"
            className="size-3 rounded-full border-[1.5px] border-nb-line-2 border-t-nb-ember animate-[nb-spin_.8s_linear_infinite] data-done:animate-none data-done:border-nb-ok"
          />
          <span>
            attaching <span className="text-nb-txt">{PROFILE.notebook}.ipynb</span> to cluster…
          </span>
          <span ref={pctRef} className="ml-auto text-nb-amber">
            0%
          </span>
        </div>
        <div className="relative mt-[18px] h-px overflow-hidden bg-nb-line">
          <div ref={barRef} className="absolute inset-y-0 left-0 w-0 bg-linear-to-r from-nb-ember via-nb-amber to-nb-teal" />
        </div>
        <div className="mt-4 flex flex-col gap-1 text-[11.5px] text-nb-dim">
          {BOOT_LINES.map((line, i) => (
            <div key={line} style={{ animation: `nb-fade .3s ${0.15 + i * 0.25}s both` }}>
              {line} <span className="text-nb-ok">ok</span>
            </div>
          ))}
          <div className="text-nb-mut" style={{ animation: 'nb-fade .3s 1.15s both' }}>
            kernel ready · <span className="text-nb-teal">running all cells</span>
          </div>
        </div>
        <div className="mt-[34px] font-sans text-[clamp(38px,7.6vw,82px)] leading-[0.95] font-bold tracking-[-0.04em] text-nb-txt animate-[nb-ink_.9s_.5s_both]">
          {PROFILE.firstName} <em className="text-nb-ember">{PROFILE.lastName}</em>
        </div>
        <button
          type="button"
          autoFocus
          onClick={skip}
          className="mt-[22px] cursor-pointer text-[10px] tracking-[0.18em] text-nb-dim hover:text-nb-txt"
        >
          CLICK TO SKIP
        </button>
      </div>
    </div>
  )
}
