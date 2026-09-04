import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react'
import { PROFILE, SECTION_IDS } from '@/content/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { useTimers } from '@/hooks/useTimers'
import { createEmitter } from '@/lib/emitter'
import { centerOf, type Point } from '@/lib/geometry'
import { TOAST_DEFAULT_MS, VACUUM_HOLD_MS } from '@/lib/motion'
import { clearRootFx, setRootFx } from '@/lib/theme'
import {
  NotebookActionsContext,
  NotebookStateContext,
  type BurstRequest,
  type NotebookActions,
  type NotebookState,
  type ToastMessage,
} from './NotebookContext'

const KEY_BUFFER_LENGTH = 8
const BURST_SPREAD = 6
const RUN_ALL_BURST = 30

export function NotebookProvider({ children }: { children: ReactNode }) {
  const cellCount = SECTION_IDS.length
  const reducedMotion = useReducedMotion()
  const activeSection = useActiveSection(SECTION_IDS)
  const timers = useTimers()

  const [executedCount, setExecutedCount] = useState(0)
  const [runId, setRunId] = useState(0)
  const [booted, setBooted] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Mirrors `runId` synchronously so late timers from an older run are ignored.
  const currentRunId = useRef(0)
  const execCounter = useRef(0)
  const toastCounter = useRef(0)
  const toastTimer = useRef(0)
  const keyBuffer = useRef('')
  const runAllAnchorRef = useRef<HTMLButtonElement>(null)
  const [bursts] = useState(() => createEmitter<BurstRequest>())

  const showToast = (node: ReactNode, durationMs = TOAST_DEFAULT_MS) => {
    toastCounter.current += 1
    setToast({ id: toastCounter.current, node, durationMs })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = timers.set(() => setToast(null), durationMs)
  }

  const burst = (origin: Element | Point, count = 28) => {
    const point = origin instanceof Element ? centerOf(origin) : origin
    bursts.emit({ ...point, count, spread: BURST_SPREAD })
  }

  const runAll = () => {
    currentRunId.current += 1
    execCounter.current = 0
    setExecutedCount(0)
    setRunId(currentRunId.current)
    if (runAllAnchorRef.current) burst(runAllAnchorRef.current, RUN_ALL_BURST)
    showToast(
      <>
        <span className="text-nb-teal">▶</span> running all cells · {cellCount} scheduled on {PROFILE.cluster.name}
      </>,
    )
  }

  const vacuum = () => {
    if (reducedMotion) {
      runAll()
      return
    }
    showToast(
      <>
        <span className="text-nb-amber">VACUUM</span> gold.* RETAIN 168 HOURS · removing stale outputs…
      </>,
      2400,
    )
    setRootFx('vacuum')
    timers.set(() => {
      clearRootFx('vacuum')
      runAll()
    }, VACUUM_HOLD_MS)
  }

  // Easter eggs: type "run" or "vacuum" anywhere on the page.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const tag = (event.target as HTMLElement | null)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
    keyBuffer.current = (keyBuffer.current + event.key).slice(-KEY_BUFFER_LENGTH).toLowerCase()
    if (keyBuffer.current.endsWith('run')) {
      keyBuffer.current = ''
      runAll()
    } else if (keyBuffer.current.endsWith('vacuum')) {
      keyBuffer.current = ''
      vacuum()
    }
  })
  useEffect(() => {
    const handler = (event: KeyboardEvent) => onKeyDown(event)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const state: NotebookState = { cellCount, executedCount, runId, booted, activeSection, toast, reducedMotion }
  const actions: NotebookActions = {
    beginExecution: (forRunId) => {
      if (forRunId !== currentRunId.current) return null
      execCounter.current += 1
      return execCounter.current
    },
    completeExecution: (forRunId) => {
      if (forRunId === currentRunId.current) setExecutedCount((count) => count + 1)
    },
    markBooted: () => setBooted(true),
    runAll,
    vacuum,
    showToast,
    burst,
    bursts,
    runAllAnchorRef,
  }

  return (
    <NotebookStateContext value={state}>
      <NotebookActionsContext value={actions}>{children}</NotebookActionsContext>
    </NotebookStateContext>
  )
}
