import { fmt } from '@/lib/utils'
import { BAR_COLORS } from '@/lib/constants'

interface Props {
  salary: number
  totalFixed: number
  livretA: number
  totalVariable: number
  invest: number
}

export default function AllocationBar({ salary, totalFixed, livretA, totalVariable, invest }: Props) {
  const segments = [
    { label: 'Charges fixes',   amt: totalFixed,   color: BAR_COLORS.fixed },
    { label: 'Livret A',        amt: livretA,       color: BAR_COLORS.livretA },
    { label: 'Dépenses var.',   amt: totalVariable, color: BAR_COLORS.variable },
    { label: invest >= 0 ? 'À investir' : 'Dépassement', amt: Math.max(0, invest), color: invest >= 0 ? BAR_COLORS.invest : BAR_COLORS.over },
  ]

  return (
    <div className="mb-5">
      <div className="h-4 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${salary > 0 ? Math.max(0, (s.amt / salary) * 100).toFixed(1) : 0}%`, background: s.color, transition: 'width 0.4s ease' }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            {s.label} — {fmt(s.amt)}
          </span>
        ))}
      </div>
    </div>
  )
}
