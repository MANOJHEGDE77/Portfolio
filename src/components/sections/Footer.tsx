import { FOOTER } from '@/content/profile'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'

export function Footer() {
  return (
    <Cell
      id="end"
      outputClassName="px-4 py-3 font-mono text-xs text-nb-mut"
      code={
        <>
          <Tok tone="magic">%sh</Tok>{'\n'}
          echo <Tok tone="str">"{FOOTER.text}run · vacuum"</Tok>
        </>
      }
    >
      {FOOTER.text}
      <span className="text-nb-teal">run</span> · <span className="text-nb-amber">vacuum</span>
      <span
        aria-hidden="true"
        className="ml-1.5 inline-block h-[13px] w-[7px] bg-nb-teal align-[-2px] motion-safe:animate-[nb-caret_1s_steps(1)_infinite]"
      />
    </Cell>
  )
}
