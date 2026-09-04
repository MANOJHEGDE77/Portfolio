import { CONTACT, PROFILE } from '@/content/profile'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { BoomLink } from '../ui/BoomLink'
import { ResumeLink } from '../ui/ResumeLink'

const DETAIL_LINK = 'mt-[5px] inline-block text-nb-txt hover:text-nb-teal'

export function Contact() {
  return (
    <Cell
      id="contact"
      outputClassName="relative px-[clamp(18px,3vw,36px)] py-[clamp(26px,4vw,44px)]"
      code={
        <>
          <Tok tone="magic">%md</Tok>{'\n'}
          <Tok tone="kw">##</Tok> Let's connect{'\n'}
          <Tok tone="mut">{CONTACT.codeLine}</Tok>
        </>
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[40%] -right-[10%] h-[180%] w-1/2 bg-[radial-gradient(circle,color-mix(in_srgb,var(--nb-ember)_14%,transparent),transparent_65%)]"
      />
      <h2 className="text-[clamp(40px,6.5vw,84px)] leading-[0.95] tracking-[-0.045em]">
        {CONTACT.heading} <em className="text-nb-ember">{CONTACT.accent}</em>
      </h2>
      <p className="mt-4 max-w-[46ch] text-[clamp(15px,1.4vw,17px)] leading-[1.6] text-nb-mut">{CONTACT.body}</p>
      <div className="mt-[26px] flex flex-wrap gap-2.5">
        <BoomLink
          href={`mailto:${PROFILE.email}`}
          className="rounded-sm bg-nb-teal px-[18px] py-3 font-mono text-[12.5px] text-nb-ink hover:brightness-[1.08]"
        >
          {PROFILE.email}
        </BoomLink>
        <ResumeLink
          boom
          className="rounded-sm border border-nb-line-2 px-[18px] py-[11px] font-mono text-[12.5px] text-nb-txt hover:border-nb-ember hover:text-nb-ember"
        >
          résumé.pdf ↓
        </ResumeLink>
      </div>
      <dl className="relative mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-4 border-t border-nb-line pt-[22px]">
        <div>
          <dt className="font-mono text-[10px] tracking-[0.14em] text-nb-dim">PHONE</dt>
          <dd>
            <a href={PROFILE.phone.href} className={DETAIL_LINK}>{PROFILE.phone.display}</a>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] tracking-[0.14em] text-nb-dim">LINKEDIN</dt>
          <dd>
            <a href={PROFILE.linkedin.url} target="_blank" rel="noopener noreferrer" className={DETAIL_LINK}>
              {PROFILE.linkedin.handle} ↗
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] tracking-[0.14em] text-nb-dim">GITHUB</dt>
          <dd>
            <a href={PROFILE.github.url} target="_blank" rel="noopener noreferrer" className={DETAIL_LINK}>
              {PROFILE.github.handle} ↗
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] tracking-[0.14em] text-nb-dim">BASE</dt>
          <dd className="mt-[5px]">{PROFILE.location}</dd>
        </div>
      </dl>
    </Cell>
  )
}
