'use client'
import { MONTHS_FR } from '@/lib/constants'

interface Props {
  year: number
  month: number
  onChange: (year: number, month: number) => void
  salary?: number
}

export default function MonthNav({ year, month, onChange, salary }: Props) {
  const prev = () => {
    if (month === 1) onChange(year - 1, 12)
    else onChange(year, month - 1)
  }
  const next = () => {
    if (month === 12) onChange(year + 1, 1)
    else onChange(year, month + 1)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <button onClick={prev} className="btn-ghost px-3 py-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div className="text-center">
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {MONTHS_FR[month - 1]} {year}
        </p>
        {salary != null && salary > 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">Salaire net · <strong className="text-zinc-600 dark:text-zinc-300">{salary.toLocaleString('fr-FR')} €</strong></p>
        )}
      </div>
      <button onClick={next} className="btn-ghost px-3 py-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  )
}
