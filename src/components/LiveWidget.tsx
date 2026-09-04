import type { ReactNode } from 'react'
import { useCanvasWidget } from '@/hooks/useCanvasWidget'
import { cn } from '@/lib/utils'
import type { LabelTone, Widget } from '@/widgets/types'

const TONE_CLASS: Record<LabelTone, string> = {
  amber: 'text-nb-amber',
  teal: 'text-nb-teal',
  ok: 'text-nb-ok',
  err: 'text-nb-err',
  gold: 'text-nb-gold',
  mut: 'text-nb-mut',
  txt: 'text-nb-txt',
}

interface LiveWidgetProps<S> {
  widget: Widget<S>
  title: string
  icon: ReactNode
  /** Shown until the first frame reports a label. */
  initialLabel: string
  initialTone?: LabelTone
  children: ReactNode
}

/** One card in the "pipelines.live()" grid: header, canvas, caption. */
export function LiveWidget<S>({ widget, title, icon, initialLabel, initialTone = 'mut', children }: LiveWidgetProps<S>) {
  const { canvasRef, labelRef } = useCanvasWidget(widget)
  return (
    <div className="border-r border-b border-nb-line px-[18px] pt-4 pb-[18px]">
      <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em]">
        {icon}
        <span className="text-nb-txt">{title}</span>
        <span ref={labelRef} className={cn('ml-auto', TONE_CLASS[initialTone])}>
          {initialLabel}
        </span>
      </div>
      <canvas ref={canvasRef} role="img" aria-label={`${title.toLowerCase()} simulation`} className="mt-3 block h-[118px] w-full" />
      <div className="mt-2.5 text-[13px] leading-[1.5] text-nb-mut">{children}</div>
    </div>
  )
}
