'use client'
import { useState } from 'react'
import { fmt } from '@/lib/utils'
import { upsertSharedContribution } from '@/lib/supabase'

interface Props {
  year: number
  month: number
  yanisContrib: number
  wifeContrib: number
  onUpdate: () => void
}

export default function SharedContributionsCard({ year, month, yanisContrib, wifeContrib, onUpdate }: Props) {
  const [yanisVal, setYanisVal] = useState('')
  const [wifeVal, setWifeVal] = useState('')
  const [loadingYanis, setLoadingYanis] = useState(false)
  const [loadingWife, setLoadingWife] = useState(false)

  const handleSaveYanis = async () => {
    setLoadingYanis(true)
    try {
      await upsertSharedContribution(year, month, 'yanis', parseFloat(yanisVal) || 0)
      setYanisVal('')
      onUpdate()
    } finally { setLoadingYanis(false) }
  }

  const handleSaveWife = async () => {
    setLoadingWife(true)
    try {
      await upsertSharedContribution(year, month, 'wife', parseFloat(wifeVal) || 0)
      setWifeVal('')
      onUpdate()
    } finally { setLoadingWife(false) }
  }

  return (
    <div className="card mb-4">
      <p className="section-title mb-3">Versements ce mois</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Yanis — actuel : {fmt(yanisContrib)}</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Montant €"
              value={yanisVal}
              onChange={(e) => setYanisVal(e.target.value)}
              min={0}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveYanis()}
            />
            <button className="btn-ghost" onClick={handleSaveYanis} disabled={loadingYanis}>
              {loadingYanis ? '...' : 'OK'}
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Juliette — actuel : {fmt(wifeContrib)}</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Montant €"
              value={wifeVal}
              onChange={(e) => setWifeVal(e.target.value)}
              min={0}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveWife()}
            />
            <button className="btn-ghost" onClick={handleSaveWife} disabled={loadingWife}>
              {loadingWife ? '...' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
