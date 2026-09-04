import { RAIL_LABELS, SECTION_IDS } from '@/content/profile'
import { cn } from '@/lib/utils'
import { useNotebookState } from '@/notebook/NotebookContext'

const PACKETS = [
  { delay: 0, color: 'bg-nb-teal shadow-[0_0_8px_var(--nb-teal)]' },
  { delay: 1.4, color: 'bg-nb-amber shadow-[0_0_8px_var(--nb-amber)]' },
  { delay: 2.8, color: 'bg-nb-ember shadow-[0_0_8px_var(--nb-ember)]' },
]

/** Left-hand job DAG: one node per cell, lights up as you scroll. Desktop only. */
export function DagRail() {
  const { activeSection, executedCount, cellCount } = useNotebookState()
  const activeIndex = Math.max(0, SECTION_IDS.indexOf(activeSection))
  const fillPercent = (activeIndex / Math.max(1, SECTION_IDS.length - 1)) * 100

  return (
    <aside
      aria-label="Notebook outline"
      className="fixed top-[calc(var(--chrome-top)+44px)] bottom-[calc(var(--chrome-bottom)+40px)] left-[clamp(16px,2.4vw,32px)] z-40 hidden w-(--rail-w) flex-col font-mono text-[11px] rail:flex"
    >
      <div className="text-[10px] tracking-[0.16em] text-nb-dim">
        JOB DAG · {executedCount}/{cellCount} cells
      </div>

      <div className="relative mt-4 flex flex-1 flex-col justify-between py-1">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-nb-line">
          <div
            className="absolute inset-x-0 top-0 bg-linear-to-b from-nb-ember via-nb-amber to-nb-teal transition-[height] duration-300"
            style={{ height: `${fillPercent}%` }}
          />
          {/* Each packet rides a full-height wrapper translated by its own
              height, so the movement stays on the compositor. */}
          {PACKETS.map(({ delay, color }) => (
            <span
              key={delay}
              className="absolute inset-0 opacity-0 motion-safe:animate-[nb-packet_4.2s_linear_infinite]"
              style={{ animationDelay: `${delay}s` }}
            >
              <span className={cn('absolute top-0 -left-0.5 size-[5px] rounded-full', color)} />
            </span>
          ))}
        </div>

        {SECTION_IDS.map((id, i) => {
          const active = id === activeSection
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'flex items-center gap-3 transition-colors duration-250',
                active ? 'text-nb-txt' : 'text-nb-dim hover:text-nb-mut',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'size-[11px] shrink-0 rounded-full border',
                  active ? 'border-nb-ember bg-nb-ember shadow-[0_0_10px_var(--nb-ember)]' : 'border-current bg-nb-bg',
                )}
              />
              <span>
                [{i}] {RAIL_LABELS[id]}
              </span>
            </a>
          )
        })}
      </div>

      <div className="mt-[18px] border-t border-nb-line pt-3.5 text-[10px] leading-[1.7] text-nb-dim">
        <div>system pipeline</div>
        <div className="mt-1 flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-nb-bronze" />
          request <span className="text-nb-line-2">→</span>
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-nb-silver" />
          service <span className="text-nb-line-2">→</span>
          <span aria-hidden="true" className="size-2 rounded-[2px] bg-nb-gold" />
          database
        </div>
      </div>
    </aside>
  )
}
