import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useNotebookActions } from '@/notebook/NotebookContext'

type BoomLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

/** An anchor that fires a confetti burst where it was clicked. */
export function BoomLink({ onClick, children, ...props }: BoomLinkProps) {
  const { burst } = useNotebookActions()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Keyboard activation reports (0, 0); burst from the link itself instead.
    burst(event.detail === 0 ? event.currentTarget : { x: event.clientX, y: event.clientY })
    onClick?.(event)
  }
  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  )
}
