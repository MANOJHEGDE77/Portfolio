import type { DotShape } from '@/lib/brand'
import { cn } from '@/lib/utils'

interface DotProps {
  /** Any CSS background: a color or a gradient. */
  color: string
  shape?: DotShape
  size?: number
  className?: string
}

const SHAPE_CLASS: Record<DotShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-[2px]',
  diamond: 'rotate-45',
}

/** A tiny colored marker used where a brand has no logo (Azure, AWS, Power BI...). */
export function Dot({ color, shape = 'circle', size = 8, className }: DotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0', SHAPE_CLASS[shape], className)}
      style={{ width: size, height: size, background: color }}
    />
  )
}
