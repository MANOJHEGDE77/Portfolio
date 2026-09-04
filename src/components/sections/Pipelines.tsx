import { PIPELINE_CARDS } from '@/content/profile'
import { BRAND_COLOR, DELTA_GRADIENT } from '@/lib/brand'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { adfWidget } from '@/widgets/adf'
import { apiIngestWidget } from '@/widgets/apiIngest'
import { deltaLogWidget } from '@/widgets/deltaLog'
import { medallionWidget } from '@/widgets/medallion'
import { powerBiWidget } from '@/widgets/powerBi'
import { sparkJobWidget } from '@/widgets/sparkJob'
import { LiveWidget } from '../LiveWidget'
import { BrandIcon } from '../ui/BrandIcon'
import { Dot } from '../ui/Dot'
import { RichText } from '../ui/RichText'

/** Three thin bars: bronze, silver, gold. */
export function MedallionMark({ height = 11 }: { height?: number }) {
  return (
    <span aria-hidden="true" className="inline-flex gap-0.5">
      <span className="w-[3px] bg-nb-bronze" style={{ height }} />
      <span className="w-[3px] bg-nb-silver" style={{ height }} />
      <span className="w-[3px] bg-nb-gold" style={{ height }} />
    </span>
  )
}

export function Pipelines() {
  return (
    <Cell
      id="pipelines"
      outputClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,290px),1fr))]"
      code={
        <>
          <Tok tone="magic">%python</Tok>{'\n'}
          <Tok tone="kw">from</Tok> backend <Tok tone="kw">import</Tok> architecture{'\n'}
          display(architecture.live(refresh=<Tok tone="str">"1s"</Tok>))  <Tok tone="dim"># simulated · illustrative only</Tok>
        </>
      }
    >
      <LiveWidget widget={medallionWidget} title="LAYERED PIPELINE" icon={<MedallionMark />} initialLabel="events 0" initialTone="amber">
        {PIPELINE_CARDS.medallion}
      </LiveWidget>
      <LiveWidget widget={sparkJobWidget} title="TASK WORKERS" icon={<BrandIcon name="openjdk" size={13} />} initialLabel="stage 0/4">
        {PIPELINE_CARDS.spark}
      </LiveWidget>
      <LiveWidget widget={adfWidget} title="SCHEDULED JOBS" icon={<Dot color={BRAND_COLOR.spring} size={11} />} initialLabel="armed">
        {PIPELINE_CARDS.adf}
      </LiveWidget>
      <LiveWidget widget={deltaLogWidget} title="_transaction_log" icon={<Dot color={DELTA_GRADIENT} shape="diamond" size={10} />} initialLabel="v 124">
        <RichText parts={PIPELINE_CARDS.delta} />
      </LiveWidget>
      <LiveWidget widget={powerBiWidget} title="METRICS STREAM" icon={<Dot color={BRAND_COLOR.powerBi} shape="square" size={10} />} initialLabel="idle">
        {PIPELINE_CARDS.powerbi}
      </LiveWidget>
      <LiveWidget widget={apiIngestWidget} title="API GATEWAY" icon={<BrandIcon name="springboot" size={13} />} initialLabel="200 × 0" initialTone="teal">
        {PIPELINE_CARDS.api}
      </LiveWidget>
    </Cell>
  )
}
