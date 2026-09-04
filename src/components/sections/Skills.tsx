import { SKILL_COUNT, SKILL_GROUPS, type Skill } from '@/content/profile'
import { Cell } from '@/notebook/Cell'
import { Tok } from '@/notebook/Tok'
import { BrandIcon } from '../ui/BrandIcon'
import { Dot } from '../ui/Dot'
import { OutputFooter } from '../ui/OutputFooter'
import { Tag } from '../ui/Tag'

function SkillTag({ skill }: { skill: Skill }) {
  const icon = skill.icon ? (
    <BrandIcon name={skill.icon} />
  ) : skill.dot ? (
    <Dot color={skill.dot.color} shape={skill.dot.shape} />
  ) : undefined
  const highlighted = skill.tone !== undefined && skill.tone !== 'default'
  return (
    <Tag tone={skill.tone} icon={icon}>
      {skill.label}
      {highlighted && <span className="sr-only"> (daily driver)</span>}
    </Tag>
  )
}

export function Skills() {
  return (
    <Cell
      id="skills"
      code={
        <>
          <Tok tone="magic">%sql</Tok>{'\n'}
          <Tok tone="kw">SELECT</Tok> category, collect_list(skill) <Tok tone="kw">AS</Tok> skills{'\n'}
          <Tok tone="kw">FROM</Tok> gold.skills <Tok tone="kw">GROUP BY</Tok> category
        </>
      }
    >
      <table className="nb-table nb-table-stack">
        <thead>
          <tr>
            <th scope="col" className="w-[34%]">category</th>
            <th scope="col">skills</th>
          </tr>
        </thead>
        <tbody>
          {SKILL_GROUPS.map((group) => (
            <tr key={group.category}>
              <td className="align-top">
                <div className="text-[17px] leading-[1.2] font-semibold tracking-[-0.02em]">{group.category}</div>
              </td>
              <td>
                <div className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <SkillTag key={skill.label} skill={skill} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <OutputFooter>
        {SKILL_GROUPS.length} rows · {SKILL_COUNT} skills · highlighted = daily drivers
      </OutputFooter>
    </Cell>
  )
}
