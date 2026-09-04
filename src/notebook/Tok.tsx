import type { ReactNode } from 'react'

type Tone = 'magic' | 'kw' | 'str' | 'mut' | 'dim'

const TONE_CLASS: Record<Tone, string> = {
  magic: 'text-nb-ember',
  kw: 'text-nb-amber',
  str: 'text-nb-teal',
  mut: 'text-nb-mut',
  dim: 'text-nb-dim',
}

/** A syntax-colored token inside a cell's code block. */
export function Tok({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={TONE_CLASS[tone]}>{children}</span>
}
