import { EDUCATION, EXPERIENCE } from '@/content/profile'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { Badge } from '../ui/Badge'
import { BrandIcon } from '../ui/BrandIcon'
import { OutputFooter } from '../ui/OutputFooter'
import { RichText } from '../ui/RichText'
import { Tag } from '../ui/Tag'

export function Experience() {
  return (
    <Cell
      id="experience"
      code={
        <>
          <Tok tone="magic">%sql</Tok>{'\n'}
          <Tok tone="kw">SELECT</Tok> period, institution, program, highlights <Tok tone="kw">FROM</Tok> gold.education{'\n'}
          <Tok tone="kw">ORDER BY</Tok> start_date <Tok tone="kw">DESC</Tok>
        </>
      }
    >
      <div className="grid sm:grid-cols-[minmax(120px,0.6fr)_1fr]">
        <div className="border-b border-nb-line px-[18px] py-[22px] sm:border-r">
          <div className="font-mono text-[11px] tracking-[0.06em] text-nb-teal">{EXPERIENCE.period}</div>
          <Badge tone="ok">{EXPERIENCE.status}</Badge>
          <div className="mt-3 font-mono text-[10.5px] tracking-[0.1em] text-nb-dim">STACK</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EXPERIENCE.stack.map((item) => (
              <Tag key={item.label} size="sm" icon={item.icon ? <BrandIcon name={item.icon} size={11} /> : undefined}>
                {item.label}
              </Tag>
            ))}
          </div>
        </div>

        <div className="border-b border-nb-line px-[22px] pt-[22px] pb-6">
          <h2 className="text-[clamp(28px,3.4vw,40px)] leading-none tracking-[-0.035em]">{EXPERIENCE.org}</h2>
          <div className="mt-1.5 font-mono text-xs text-nb-mut">{EXPERIENCE.role}</div>
          <ul className="mt-[18px] flex flex-col gap-[11px]">
            {EXPERIENCE.highlights.map((highlight, i) => (
              <li key={i} className="grid grid-cols-[22px_1fr] gap-2 leading-[1.55] text-nb-mut">
                <span aria-hidden="true" className="pt-[3px] font-mono text-[11px] text-nb-ember">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <RichText parts={highlight} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-b border-nb-line p-[18px] sm:border-r sm:border-b-0">
          <div className="font-mono text-[11px] tracking-[0.06em] text-nb-mut">{EDUCATION.period}</div>
          <Badge tone="amber">{EDUCATION.status}</Badge>
        </div>

        <div className="px-[22px] py-[18px]">
          <h3 className="text-[clamp(20px,2.2vw,26px)] leading-[1.05] font-semibold">{EDUCATION.school}</h3>
          <div className="mt-[5px] font-mono text-xs text-nb-mut">{EDUCATION.detail}</div>
          <p className="mt-3 leading-[1.55] text-nb-mut">
            <span aria-hidden="true" className="text-nb-amber">★</span> <RichText parts={EDUCATION.award} />
          </p>
        </div>
      </div>
      <OutputFooter>2 rows · 1 in progress · 1 completed</OutputFooter>
    </Cell>
  )
}
