import type { ReactNode } from 'react'

/** The "4 rows · ..." line under a cell output. */
export function OutputFooter({ children }: { children: ReactNode }) {
  return <div className="border-t border-nb-line px-4 py-[9px] font-mono text-[10.5px] text-nb-dim">{children}</div>
}
