import type { ReactNode } from 'react'
import type { SkillTone } from '@/content/profile'
import { cn } from '@/lib/utils'

interface TagProps {
  tone?: SkillTone
  size?: 'sm' | 'md'
  icon?: ReactNode
  children: ReactNode
}

const TONE_CLASS: Record<SkillTone, string> = {
  default: 'border-nb-line text-nb-mut',
  ember: 'border-[color-mix(in_srgb,var(--nb-ember)_45%,transparent)] bg-[color-mix(in_srgb,var(--nb-ember)_8%,transparent)] text-nb-txt',
  teal: 'border-[color-mix(in_srgb,var(--nb-teal)_45%,transparent)] bg-[color-mix(in_srgb,var(--nb-teal)_8%,transparent)] text-nb-txt',
}

const SIZE_CLASS = {
  sm: 'px-2 py-[3px] text-[11px]',
  md: 'px-[9px] py-1 text-[11.5px]',
} as const

/** A skill / stack chip. */
export function Tag({ tone = 'default', size = 'md', icon, children }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[3px] border font-mono',
        TONE_CLASS[tone],
        SIZE_CLASS[size],
      )}
    >
      {icon}
      {children}
    </span>
  )
}
