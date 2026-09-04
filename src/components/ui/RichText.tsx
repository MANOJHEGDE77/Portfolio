import type { RichText as RichTextParts } from '@/content/profile'

/** Renders content strings that mix plain text with emphasised segments. */
export function RichText({ parts }: { parts: RichTextParts }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          part
        ) : (
          <span key={i} className="text-nb-txt">
            {part.strong}
          </span>
        ),
      )}
    </>
  )
}
