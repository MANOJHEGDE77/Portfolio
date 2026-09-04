import { STATS, type Stat } from '@/content/profile'
import { useCountUp } from '@/hooks/useCountUp'
import { useLiveStatText } from '@/hooks/useLiveStatText'
import { formatInt } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Cell } from '@/notebook/Cell'
import { useCellStatus } from '@/notebook/CellStatusContext'
import { Tok } from '@/notebook/Tok'
import { OutputFooter } from '../ui/OutputFooter'

function StatValue({ stat }: { stat: Stat }) {
  // Count only once the cell has "executed" and the output is actually visible.
  const ref = useCountUp(stat.value, { suffix: stat.suffix, enabled: useCellStatus() === 'done' })
  return (
    <>
      {stat.prefix}
      <span ref={ref}>0{stat.suffix}</span>
    </>
  )
}

export function About() {
  const ingestRef = useLiveStatText((s) => formatInt(s.ingest))
  return (
    <Cell
      id="about"
      code={
        <>
          <Tok tone="magic">%python</Tok>{'\n'}
          me = spark.read.table(<Tok tone="str">"system.profile.manoj_hegde"</Tok>){'\n'}
          display(me.describe())
        </>
      }
    >
      <table className="nb-table">
        <thead>
          <tr>
            <th scope="col">metric</th>
            <th scope="col">value</th>
            <th scope="col" className="hidden sm:table-cell">source</th>
          </tr>
        </thead>
        <tbody>
          {STATS.map((stat) => (
            <tr key={stat.metric}>
              <td className="font-mono text-[12.5px] text-nb-mut">
                {stat.metric}
                <div className="mt-1 font-sans text-xs text-nb-dim sm:hidden">{stat.source}</div>
              </td>
              <td
                className={cn(
                  'text-[30px] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap',
                  stat.tone === 'teal' ? 'text-nb-teal' : 'text-nb-txt',
                )}
              >
                <StatValue stat={stat} />
              </td>
              <td className="hidden text-nb-mut sm:table-cell">{stat.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <OutputFooter>
        {STATS.length} rows · <span ref={ingestRef}>0</span> rows/s ingest right now
      </OutputFooter>
    </Cell>
  )
}
