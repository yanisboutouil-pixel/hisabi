'use client'
import { useState } from 'react'
import { fmt } from '@/lib/utils'
import { upsertMonthlySaving } from '@/lib/supabase'

interface Props {
  year: number
  month: number
  livretA: number
  onUpdate: () => void
}

export default function LivretACard({ year, month, livretA, onUpdate }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await upsertMonthlySaving(year, month, parseFloat(value) || 0)
      setValue('')
      onUpdate()
    } finally { setLoading(false) }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title mb-0.5">Livret A</p>
          <p className="text-xs text-zinc-400">Objectif : alimenter sans repiocher</p>
        </div>
        <span className="text-lg font-semibold text-primary-600 dark:text-primary-200">{fmt(livretA)}</span>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Montant mis de côté ce mois (€)"
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
