import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeTone = 'ok' | 'amber'

const TONE_CLASS: Record<BadgeTone, string> = {
  ok: 'border-[color-mix(in_srgb,var(--nb-ok)_40%,transparent)] text-nb-ok',
  amber: 'border-[color-mix(in_srgb,var(--nb-amber)_40%,transparent)] text-nb-amber',
}

/** Small status pill (RUNNING, EDUCATION). */
export function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span className={cn('mt-1.5 inline-block rounded-[3px] border px-[7px] py-0.5 font-mono text-[10px]', TONE_CLASS[tone])}>
      {children}
    </span>
  )
}
