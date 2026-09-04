import { createContext, useContext, type ReactNode, type RefObject } from 'react'
import type { SectionId } from '@/content/profile'
import type { Emitter } from '@/lib/emitter'
import type { Point } from '@/lib/geometry'

export interface ToastMessage {
  id: number
  node: ReactNode
  durationMs: number
}

export interface BurstRequest extends Point {
  count: number
  spread: number
}

export interface NotebookState {
  cellCount: number
  executedCount: number
  /** Increments on every "run all"; cells re-execute when it changes. */
  runId: number
  /** True once the intro overlay is gone; cells wait for it. */
  booted: boolean
  activeSection: SectionId
  toast: ToastMessage | null
  reducedMotion: boolean
}

export interface NotebookActions {
  /** Claims the next execution number, or null when `forRunId` is no longer current. */
  beginExecution(forRunId: number): number | null
  completeExecution(forRunId: number): void
  markBooted(): void
  runAll(): void
  vacuum(): void
  showToast(node: ReactNode, durationMs?: number): void
  /** Confetti from a point or from the centre of an element. */
  burst(origin: Element | Point, count?: number): void
  /** BurstCanvas listens here so particles never go through React state. */
  bursts: Emitter<BurstRequest>
  /** The "Run all" button; bursts originate from it. */
  runAllAnchorRef: RefObject<HTMLButtonElement | null>
}

export const NotebookStateContext = createContext<NotebookState | null>(null)
export const NotebookActionsContext = createContext<NotebookActions | null>(null)

export function useNotebookState(): NotebookState {
  const ctx = useContext(NotebookStateContext)
  if (!ctx) throw new Error('useNotebookState must be used inside <NotebookProvider>')
  return ctx
}

export function useNotebookActions(): NotebookActions {
  const ctx = useContext(NotebookActionsContext)
  if (!ctx) throw new Error('useNotebookActions must be used inside <NotebookProvider>')
  return ctx
}
