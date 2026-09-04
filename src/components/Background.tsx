import { useCanvasWidget } from '@/hooks/useCanvasWidget'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isLowEndDevice } from '@/lib/device'
import { BACKGROUND_MIN_WIDTH, backgroundWidget } from '@/widgets/background'

/**
 * Full-page canvas backdrop. Off on phones, rendered at a low DPR because it
 * covers the whole viewport, and sized to the large viewport height so the
 * mobile URL bar showing or hiding never reallocates the canvas.
 */
export function Background() {
  const wide = useMediaQuery(`(min-width: ${BACKGROUND_MIN_WIDTH}px)`)
  const { canvasRef } = useCanvasWidget(backgroundWidget, {
    maxDpr: isLowEndDevice ? 1 : 1.5,
    active: wide,
  })
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="bg-fade absolute inset-0" />
    </div>
  )
}
