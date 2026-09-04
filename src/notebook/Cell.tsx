import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { SECTION_IDS, SECTION_TITLES, type SectionId } from '@/content/profile'
import { useTimers } from '@/hooks/useTimers'
import { CELL_RUN_MAX_MS, CELL_RUN_MIN_MS, RUN_ALL_STAGGER_MS } from '@/lib/motion'
import { rnd } from '@/lib/random'
import { cn } from '@/lib/utils'
import { CellStatusContext, type CellStatus } from './CellStatusContext'
import { useNotebookActions, useNotebookState } from './NotebookContext'

interface RunState {
  status: CellStatus
  execNo: number
  elapsed: string
  /** The notebook run this state belongs to. An older run means "not executed yet". */
  runId: number
}

interface CellProps {
  id: SectionId
  /** The fake source shown above the output. Use <Tok> for syntax colors. */
  code: ReactNode
  outputClassName?: string
  children: ReactNode
}

const INITIAL: RunState = { status: 'pending', execNo: 0, elapsed: '', runId: 0 }

/**
 * One notebook cell: a gutter with the execution counter, a code block and an
 * output block. It executes the first time it scrolls into view (after the
 * intro), and again, in notebook order, when the notebook is re-run.
 */
export function Cell({ id, code, outputClassName, children }: CellProps) {
  const { runId, reducedMotion, cellCount, booted } = useNotebookState()
  const { beginExecution, completeExecution } = useNotebookActions()
  const sectionRef = useRef<HTMLElement>(null)
  const [run, setRun] = useState<RunState>(INITIAL)
  const timers = useTimers()
  /** The run this cell has already been scheduled for, so it never executes twice per run. */
  const scheduledFor = useRef(-1)

  const index = SECTION_IDS.indexOf(id)
  const first = index === 0
  const last = index === cellCount - 1

  // A newer "run all" invalidates this cell's state without a state write.
  const status: CellStatus = run.runId === runId ? run.status : 'pending'

  const execute = useEffectEvent((delayMs: number) => {
    const forRunId = runId
    scheduledFor.current = forRunId
    timers.set(() => {
      // Like a real kernel: the counter is taken when execution starts, so
      // numbers follow notebook order even though durations vary.
      const execNo = beginExecution(forRunId)
      if (execNo === null) return
      const finish = (durationMs: number) => {
        const elapsed = (durationMs / 1000 + rnd(0.05, 0.4)).toFixed(2)
        setRun({ status: 'done', execNo, elapsed, runId: forRunId })
        completeExecution(forRunId)
      }
      if (reducedMotion) {
        finish(0)
        return
      }
      setRun({ status: 'running', execNo, elapsed: '', runId: forRunId })
      const durationMs = rnd(CELL_RUN_MIN_MS, CELL_RUN_MAX_MS)
      timers.set(() => finish(durationMs), durationMs)
    }, delayMs)
  })

  /** Whether the cell has scrolled into view at least once. */
  const seen = useRef(false)

  // First execution needs both: the intro gone and the cell seen on screen.
  const tryFirstExecution = useEffectEvent(() => {
    if (!booted || !seen.current) return
    if (scheduledFor.current !== runId) execute(0)
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        seen.current = true
        tryFirstExecution()
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (booted) tryFirstExecution()
  }, [booted])

  // "Run all": cancel anything in flight, then re-execute in notebook order.
  useEffect(() => {
    if (runId === 0) return
    timers.clear()
    execute(index * RUN_ALL_STAGGER_MS)
  }, [runId, index, timers])

  const execLabel = status === 'done' ? `[${run.execNo}]` : status === 'running' ? '[*]' : '[ ]'

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label={SECTION_TITLES[id]}
      data-status={status}
      style={{ '--cell-i': index } as CSSProperties}
      className={cn(
        'grid grid-cols-[36px_minmax(0,1fr)] gap-x-[14px] sm:grid-cols-[52px_minmax(0,1fr)]',
        first ? 'pt-3 pb-[34px]' : 'border-t border-nb-line pt-7',
        !first && (last ? 'pb-2' : 'pb-7'),
      )}
    >
      <div aria-hidden="true" className="flex flex-col items-end gap-1.5 pt-2.5 font-mono text-[11.5px] text-nb-dim">
        <span className={cn(status === 'running' && 'text-nb-amber')}>{execLabel}</span>
        <span
          className={cn(
            'hidden text-[10px] whitespace-nowrap text-nb-ok transition-opacity duration-300 sm:inline',
            status === 'done' ? 'opacity-100' : 'opacity-0',
          )}
        >
          {status === 'done' ? `✓ ${run.elapsed}s` : ''}
        </span>
      </div>
      <div className="min-w-0">
        <div className="cell-code rounded-md border border-nb-line bg-nb-surf px-3.5 py-2.5 font-mono text-[13px] leading-[1.75] wrap-anywhere whitespace-pre-wrap text-nb-txt">
          {code}
        </div>
        <div className={cn('cell-out mt-2.5 overflow-hidden rounded-md border border-nb-line bg-nb-out', outputClassName)}>
          <CellStatusContext value={status}>{children}</CellStatusContext>
        </div>
      </div>
    </section>
  )
}
