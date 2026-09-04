import { HERO, PROFILE } from '@/content/profile'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { BoomLink } from '../ui/BoomLink'

export function Hero() {
  return (
    <Cell
      id="top"
      outputClassName="relative px-[clamp(18px,3vw,36px)] py-[clamp(24px,4vw,44px)]"
      code={
        <>
          <Tok tone="magic">%md</Tok>{'\n'}
          <Tok tone="kw">#</Tok> {PROFILE.name}{'\n'}
          <Tok tone="mut">{PROFILE.tagline}</Tok>
        </>
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--nb-ember)_5%,transparent),transparent)] motion-safe:animate-[nb-scan_7s_linear_infinite]"
      />
      <div className="inline-flex items-center gap-[9px] font-mono text-[11px] tracking-[0.06em] text-nb-mut">
        <span
          aria-hidden="true"
          className="size-[7px] rounded-full bg-nb-ok shadow-[0_0_10px_var(--nb-ok)] motion-safe:animate-[nb-blink_1.8s_ease-in-out_infinite]"
        />
        {PROFILE.availability}
      </div>
      <h1 className="mt-[22px] text-[clamp(40px,7.2vw,94px)] leading-[0.96] font-bold tracking-[-0.045em] text-balance">
        {HERO.lead} <em className="text-nb-ember">{HERO.accent}</em>
      </h1>
      <div className="mt-[clamp(26px,4vw,40px)] flex flex-wrap items-end justify-between gap-x-10 gap-y-[22px]">
        <p className="max-w-[52ch] text-[clamp(15px,1.4vw,17.5px)] leading-[1.65] text-pretty text-nb-mut">{HERO.body}</p>
        <div className="flex flex-wrap gap-2.5">
          <BoomLink
            href="#experience"
            className="rounded-sm bg-nb-ember px-4 py-[11px] font-mono text-xs text-nb-ink hover:brightness-110"
          >
            ▶ run education
          </BoomLink>
          <BoomLink
            href={`mailto:${PROFILE.email}`}
            className="rounded-sm border border-nb-line-2 px-4 py-2.5 font-mono text-xs text-nb-txt hover:border-nb-teal hover:text-nb-teal"
          >
            email me
          </BoomLink>
        </div>
      </div>
    </Cell>
  )
}
