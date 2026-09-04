import type { CSSProperties } from 'react'
import { useNotebookState } from '@/notebook/NotebookContext'

/**
 * Bottom-centre notification. The live region is always in the DOM so screen
 * readers announce content changes; the inner node is re-keyed per toast so
 * the entrance animation restarts.
 */
export function Toast() {
  const { toast } = useNotebookState()
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[calc(var(--chrome-bottom)+22px)] left-1/2 z-93 max-w-[calc(100vw-24px)] -translate-x-1/2"
    >
      {toast && (
        <div
          key={toast.id}
          className="toast rounded-md border border-nb-line-2 bg-nb-surf px-4 py-2.5 text-center font-mono text-xs text-nb-txt shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] sm:whitespace-nowrap"
          style={{ '--toast-ms': `${toast.durationMs}ms` } as CSSProperties}
        >
          {toast.node}
        </div>
      )}
    </div>
  )
}
