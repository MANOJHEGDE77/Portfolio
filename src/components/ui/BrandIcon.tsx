import { BRAND_ICONS, MONO_BRANDS, type BrandName } from '@/lib/brandIcons'
import { cn } from '@/lib/utils'

interface BrandIconProps {
  name: BrandName
  /** Rendered square, in CSS pixels. */
  size?: number
}

/** Inline brand logo from simple-icons. Bundled, so no network request. */
export function BrandIcon({ name, size = 12 }: BrandIconProps) {
  const icon = BRAND_ICONS[name]
  const mono = MONO_BRANDS.has(name)
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width={size}
      height={size}
      className={cn('shrink-0', mono && 'text-nb-txt')}
      fill={mono ? 'currentColor' : `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  )
}
