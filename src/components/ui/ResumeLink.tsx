import type { ReactNode } from 'react'
import { PROFILE } from '@/content/profile'
import { useNotebookActions } from '@/notebook/NotebookContext'
import { BoomLink } from './BoomLink'

interface ResumeLinkProps {
  className?: string
  /** Confetti on click, like the other primary links. */
  boom?: boolean
  children: ReactNode
}

/** Opens the resume PDF and logs a fake "200 GET" toast. */
export function ResumeLink({ className, boom = false, children }: ResumeLinkProps) {
  const { showToast } = useNotebookActions()
  const { fileName, url, sizeLabel } = PROFILE.resume
  const props = {
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    className,
    onClick: () =>
      showToast(
        <>
          <span className="text-nb-ok">200</span> GET /{fileName} · application/pdf · {sizeLabel}
        </>,
        2400,
      ),
  }
  return boom ? <BoomLink {...props}>{children}</BoomLink> : <a {...props}>{children}</a>
}
