'use client'
import { useState } from 'react'
import { fmt } from '@/lib/utils'
import { upsertMonthlySalary } from '@/lib/supabase'

interface Props {
  year: number
  month: number
  salary: number
  onUpdate: () => void
}

export default function SalaryCard({ year, month, salary, onUpdate }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await upsertMonthlySalary(year, month, parseFloat(value) || 0)
      setValue('')
      onUpdate()
    } finally { setLoading(false) }
  }

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="section-title mb-0">Salaire net ce mois</p>
        <span className="text-lg font-semibold text-primary-600 dark:text-primary-200">
          {salary > 0 ? fmt(salary) : '—'}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Salaire net du mois (€)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={0}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button className="btn-ghost" onClick={handleSave} disabled={loading}>
          {loading ? '...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
