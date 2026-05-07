'use client'
import { useState } from 'react'
import { fmt } from '@/lib/utils'
import { upsertWifeMonthlySaving } from '@/lib/supabase'

interface Props {
  year: number
  month: number
  saving: number
  onUpdate: () => void
}

export default function WifeSavingsCard({ year, month, saving, onUpdate }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await upsertWifeMonthlySaving(year, month, parseFloat(value) || 0)
      setValue('')
      onUpdate()
    } finally { setLoading(false) }
  }

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title mb-0.5">Épargne</p>
          <p className="text-xs text-zinc-400">Montant mis de côté ce mois</p>
        </div>
        <span className="text-lg font-semibold text-primary-600 dark:text-primary-200">{fmt(saving)}</span>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Montant épargné ce mois (€)"
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
