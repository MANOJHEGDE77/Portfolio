import { CERTIFICATIONS, type Certification } from '@/content/profile'
import { cn } from '@/lib/utils'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { BrandIcon } from '../ui/BrandIcon'
import { Dot } from '../ui/Dot'
import { OutputFooter } from '../ui/OutputFooter'

function VerifyLink({ cert, className }: { cert: Certification; className?: string }) {
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open certificate: ${cert.title}`}
      className={cn(
        'rounded-[3px] border border-[color-mix(in_srgb,var(--nb-teal)_40%,transparent)] px-[9px] py-1 font-mono text-[11.5px] whitespace-nowrap text-nb-teal hover:bg-[color-mix(in_srgb,var(--nb-teal)_10%,transparent)]',
        className,
      )}
    >
      open ↗
    </a>
  )
}

export function Credentials() {
  return (
    <Cell
      id="credentials"
      code={
        <>
          <Tok tone="magic">%sql</Tok>{'\n'}
          <Tok tone="kw">SELECT</Tok> issuer, certification, year, verify_url <Tok tone="kw">FROM</Tok> gold.certifications{'\n'}
          <Tok tone="kw">ORDER BY</Tok> year <Tok tone="kw">DESC</Tok>
        </>
      }
    >
      <table className="nb-table">
        <thead>
          <tr>
            <th scope="col">issuer</th>
            <th scope="col">certification</th>
            <th scope="col" className="hidden sm:table-cell">year</th>
            <th scope="col" className="hidden text-right sm:table-cell">verify</th>
          </tr>
        </thead>
        <tbody>
          {CERTIFICATIONS.map((cert) => (
            <tr key={cert.url}>
              <td className="whitespace-nowrap">
                <span className="inline-flex items-center gap-2 font-mono text-xs text-nb-mut">
                  {cert.issuerIcon ? <BrandIcon name={cert.issuerIcon} /> : <Dot color={cert.issuerDot ?? 'currentColor'} size={9} />}
                  {cert.issuer}
                </span>
                <div className="mt-1 font-mono text-[11px] text-nb-dim sm:hidden">{cert.year}</div>
              </td>
              <td className="text-[15px] leading-[1.2] font-medium tracking-[-0.015em] sm:text-[16.5px]">
                {cert.title}
                <div className="mt-2.5 sm:hidden">
                  <VerifyLink cert={cert} />
                </div>
              </td>
              <td className="hidden font-mono text-xs text-nb-mut sm:table-cell">{cert.year}</td>
              <td className="hidden text-right sm:table-cell">
                <VerifyLink cert={cert} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <OutputFooter>{CERTIFICATIONS.length} rows</OutputFooter>
    </Cell>
  )
}
