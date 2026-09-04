import { useRef, useState, type MouseEvent } from 'react'
import { NAV_LINKS, PROFILE } from '@/content/profile'
import { useTimers } from '@/hooks/useTimers'
import { cn } from '@/lib/utils'
import { useNotebookActions, useNotebookState } from '@/notebook/NotebookContext'
import { useTheme } from '@/notebook/ThemeContext'
import { ResumeLink } from './ui/ResumeLink'

const TRIPLE_CLICK_WINDOW_MS = 900
const MAX_WORKERS = 32

export function TopBar() {
  const { activeSection } = useNotebookState()
  const { runAll, showToast, burst, runAllAnchorRef } = useNotebookActions()
  const { theme, toggleTheme } = useTheme()
  const [workers, setWorkers] = useState<number>(PROFILE.cluster.workers)
  const clusterClicks = useRef(0)
  const timers = useTimers()

  // Easter egg: click the cluster pill three times to "autoscale".
  const onClusterClick = (event: MouseEvent<HTMLButtonElement>) => {
    clusterClicks.current += 1
    timers.clear()
    timers.set(() => {
      clusterClicks.current = 0
    }, TRIPLE_CLICK_WINDOW_MS)
    if (clusterClicks.current < 3) return
    clusterClicks.current = 0
    const next = workers >= MAX_WORKERS ? PROFILE.cluster.workers : workers * 2
    setWorkers(next)
    showToast(
      <>
        <span className="text-nb-teal">●</span> cluster autoscaled {workers} → {next} workers · spot instances ·{' '}
        {next > workers ? 'lag draining' : 'scaled to floor'}
      </>,
    )
    burst(event.currentTarget, 26)
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <header className="chrome-bar fixed inset-x-0 top-0 z-60 flex h-(--chrome-top) items-center gap-2.5 border-b border-nb-line px-[clamp(14px,2.4vw,28px)] sm:gap-3.5">
      <a href="#top" className="flex items-center gap-2.5 font-mono text-[12.5px] whitespace-nowrap text-nb-txt">
        <span
          aria-hidden="true"
          className="grid size-4 place-items-center rounded-[3px] bg-linear-to-br from-nb-ember to-nb-amber text-[9px] font-semibold text-nb-ink"
        >
          ▶
        </span>
        <span>
          {PROFILE.notebook}
          <span className="hidden text-nb-dim sm:inline">.ipynb</span>
        </span>
      </a>

      <button
        type="button"
        onClick={onClusterClick}
        title="…click me a few times"
        aria-label={`Cluster ${PROFILE.cluster.name}, ${workers} workers`}
        className="hidden items-center gap-2 rounded-full border border-nb-line px-[11px] py-[5px] font-mono text-[11px] whitespace-nowrap text-nb-mut hover:border-nb-line-2 hover:text-nb-txt sm:flex"
      >
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-nb-ok shadow-[0_0_8px_var(--nb-ok)] motion-safe:animate-[nb-blink_2.2s_ease-in-out_infinite]"
        />
        <span className="hidden cluster:inline">
          {PROFILE.cluster.name} · {workers} workers
        </span>
      </button>

      <div className="flex-1" />

      <nav aria-label="Sections" className="hidden items-center gap-[clamp(10px,1.4vw,20px)] font-mono text-[11.5px] nav:flex">
        {NAV_LINKS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={activeSection === id ? 'true' : undefined}
            className={cn('transition-colors', activeSection === id ? 'text-nb-ember' : 'text-nb-mut hover:text-nb-txt')}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        ref={runAllAnchorRef}
        type="button"
        onClick={runAll}
        aria-label="Run all cells"
        className="flex shrink-0 items-center gap-[7px] rounded-sm bg-nb-teal px-3 py-[7px] font-mono text-[11.5px] whitespace-nowrap text-nb-ink hover:brightness-110"
      >
        ▶<span className="hidden sm:inline">Run all</span>
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${nextTheme} theme`}
        className="grid size-[30px] shrink-0 place-items-center rounded-sm border border-nb-line font-mono text-xs text-nb-txt hover:border-nb-line-2"
      >
        {theme === 'dark' ? '◐' : '◑'}
      </button>

      <ResumeLink className="shrink-0 rounded-sm border border-nb-line-2 px-[11px] py-1.5 font-mono text-[11.5px] whitespace-nowrap text-nb-txt hover:border-nb-ember hover:bg-nb-surf hover:text-nb-ember">
        résumé<span className="hidden sm:inline">.pdf</span> ↓
      </ResumeLink>
    </header>
  )
}
