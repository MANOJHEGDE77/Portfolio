import { PROFILE, PROJECTS, type Project } from '@/content/profile'
import { cn } from '@/lib/utils'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { BoomLink } from '../ui/BoomLink'
import { BrandIcon } from '../ui/BrandIcon'
import { MedallionMark } from './Pipelines'

const KICKER_TONE: Record<Project['kickerTone'], string> = {
  amber: 'text-nb-amber',
  teal: 'text-nb-teal',
  ember: 'text-nb-ember',
  mut: 'text-nb-mut',
}

function KickerIcon({ kind }: { kind: Project['kickerIcon'] }) {
  return kind === 'medallion' ? <MedallionMark height={10} /> : <BrandIcon name={kind} />
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <BoomLink
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-r border-b border-nb-line px-5 pt-5 pb-[22px] text-nb-txt transition-colors duration-250 hover:bg-[color-mix(in_srgb,var(--nb-txt)_3%,transparent)]"
    >
      <div className={cn('flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em]', KICKER_TONE[project.kickerTone])}>
        <KickerIcon kind={project.kickerIcon} />
        {project.kicker}
        <span className="ml-auto tracking-normal text-nb-dim">source ↗</span>
      </div>
      <h3 className="mt-3.5 text-[clamp(20px,2.2vw,26px)] leading-[1.1] font-semibold tracking-[-0.03em]">{project.title}</h3>
      <p className="mt-2.5 text-[13.5px] leading-[1.55] text-nb-mut">{project.body}</p>
      <div className="mt-3.5 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-nb-dim">
        {project.tags.map((tag, i) => (
          <span key={tag} className="contents">
            {i > 0 && <span aria-hidden="true">·</span>}
            <span>{tag}</span>
          </span>
        ))}
      </div>
    </BoomLink>
  )
}

export function Projects() {
  return (
    <Cell
      id="projects"
      outputClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]"
      code={
        <>
          <Tok tone="magic">%python</Tok>{'\n'}
          <Tok tone="kw">for</Tok> repo <Tok tone="kw">in</Tok> github.repos(owner=<Tok tone="str">"{PROFILE.github.handle}"</Tok>, topic=<Tok tone="str">"backend-engineering"</Tok>):{'\n'}
          {'    '}display(repo)
        </>
      }
    >
      {PROJECTS.map((project) => (
        <ProjectCard key={project.url} project={project} />
      ))}
    </Cell>
  )
}
