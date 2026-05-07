'use client'
import { useState } from 'react'
import { fmt } from '@/lib/utils'
import { updateWifeMonthlyGoal } from '@/lib/supabase'
import { WIFE_ANNUAL_CAP } from '@/lib/constants'
import type { WifeSettings } from '@/lib/types'

interface Props {
  caEmis: number
  annualCA: number
  settings: WifeSettings
  onUpdate: () => void
}

export default function WifeProgressBars({ caEmis, annualCA, settings, onUpdate }: Props) {
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [loading, setLoading] = useState(false)

  const { monthly_goal } = settings
  const monthlyPct = monthly_goal > 0 ? Math.min((caEmis / monthly_goal) * 100, 100) : 0
  const annualPct = Math.min((annualCA / WIFE_ANNUAL_CAP) * 100, 100)

  const handleSaveGoal = async () => {
    const val = parseFloat(goalInput)
    if (!val || val <= 0) return
    setLoading(true)
    try {
      await updateWifeMonthlyGoal(val)
      setGoalInput('')
      setEditingGoal(false)
      onUpdate()
    } finally { setLoading(false) }
  }

  return (
    <div className="card mb-4">
      {/* Monthly goal */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Objectif mensuel</p>
            {!editingGoal && (
              <button
                onClick={() => { setEditingGoal(true); setGoalInput(String(monthly_goal || '')) }}
                className="btn-icon"
                aria-label="Modifier l'objectif"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {fmt(caEmis)} / {monthly_goal > 0 ? fmt(monthly_goal) : '—'}
          </p>
        </div>
        {editingGoal ? (
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Objectif mensuel (€)"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              min={0}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal()}
              autoFocus
            />
            <button className="btn-ghost" onClick={() => setEditingGoal(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleSaveGoal} disabled={loading}>
              {loading ? '...' : 'OK'}
            </button>
          </div>
        ) : (
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all"
              style={{ width: `${monthlyPct}%` }}
            />
          </div>
        )}
        {monthly_goal > 0 && !editingGoal && (
          <p className="text-xs text-zinc-400 mt-1">{monthlyPct.toFixed(0)}% de l'objectif</p>
        )}
        {monthly_goal === 0 && !editingGoal && (
          <p className="text-xs text-zinc-400 mt-1">Clique sur le crayon pour définir un objectif</p>
        )}
      </div>

      {/* Annual cap */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Plafond auto-entrepreneur</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{fmt(annualCA)} / {fmt(WIFE_ANNUAL_CAP)}</p>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              annualPct >= 90 ? 'bg-red-500' : annualPct >= 70 ? 'bg-amber-500' : 'bg-primary-600'
            }`}
            style={{ width: `${annualPct}%` }}
          />
        </div>
        <p className="text-xs text-zinc-400 mt-1">{annualPct.toFixed(1)}% du plafond annuel</p>
      </div>
    </div>
  )
}
