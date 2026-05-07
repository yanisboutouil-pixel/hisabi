'use client'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import InvestEvolution from '@/components/charts/InvestEvolution'
import CategoryBreakdown from '@/components/charts/CategoryBreakdown'
import MonthComparison from '@/components/charts/MonthComparison'
import { getMonthSummaries } from '@/lib/supabase'
import type { MonthSummary } from '@/lib/types'
import { MONTHS_FR } from '@/lib/constants'
import { fmt } from '@/lib/utils'

export default function Historique() {
  const [summaries, setSummaries] = useState<MonthSummary[]>([])
  const [selectedMonth, setSelectedMonth] = useState(11)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMonthSummaries(12).then((data) => {
      setSummaries(data)
      setSelectedMonth(data.length - 1)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-400 text-sm">Chargement de l'historique…</p>
        </div>
      </div>
    )
  }

  const best   = summaries.reduce((a, b) => (a.invest > b.invest ? a : b), summaries[0])
  const avgInvest = summaries.filter(m => m.invest > 0).reduce((s, m) => s + m.invest, 0) / (summaries.filter(m => m.invest > 0).length || 1)

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Historique</h1>
          <p className="text-sm text-zinc-400">12 derniers mois</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="metric-card">
            <p className="text-xs text-zinc-500 mb-1">Moyenne disponible</p>
            <p className="text-xl font-semibold text-primary-600 dark:text-primary-300">{fmt(avgInvest)}</p>
            <p className="text-xs text-zinc-400 mt-0.5">par mois (mois positifs)</p>
          </div>
          <div className="metric-card">
            <p className="text-xs text-zinc-500 mb-1">Meilleur mois</p>
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{best ? fmt(best.invest) : '—'}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{best ? `${MONTHS_FR[best.month - 1]} ${best.year}` : ''}</p>
          </div>
          <div className="metric-card">
            <p className="text-xs text-zinc-500 mb-1">Total investi (PEA)</p>
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{fmt(200 * summaries.length)}</p>
            <p className="text-xs text-zinc-400 mt-0.5">sur {summaries.length} mois</p>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <InvestEvolution data={summaries} />

          <div className="grid grid-cols-2 gap-4">
            {/* Month selector for category breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Mois analysé</p>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="text-sm py-1"
                >
                  {summaries.map((s, i) => (
                    <option key={i} value={i}>{MONTHS_FR[s.month - 1]} {s.year}</option>
                  ))}
                </select>
              </div>
              <CategoryBreakdown data={summaries} selectedMonth={selectedMonth} />
            </div>
            <MonthComparison data={summaries.slice(-6)} />
          </div>
        </div>
      </main>
    </div>
  )
}
