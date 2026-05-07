import { fmt } from '@/lib/utils'

interface Props {
  salary: number
  totalFixed: number
  totalVariable: number
  livretA: number
  invest: number
}

export default function MetricCards({ salary, totalFixed, totalVariable, livretA, invest }: Props) {
  const cards = [
    { label: 'Revenus',             value: salary,       color: '' },
    { label: 'Charges fixes',       value: totalFixed,   color: '' },
    { label: 'Dépenses variables',  value: totalVariable,color: '' },
    { label: 'Livret A ce mois',    value: livretA,      color: '' },
  ]
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {cards.map((c) => (
        <div key={c.label} className="metric-card">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{c.label}</p>
          <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{fmt(c.value)}</p>
        </div>
      ))}
    </div>
  )
}
