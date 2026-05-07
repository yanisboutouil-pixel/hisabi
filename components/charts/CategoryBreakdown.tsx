'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { MonthSummary } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/constants'
import { fmt } from '@/lib/utils'
import { MONTHS_FR } from '@/lib/constants'

interface Props {
  data: MonthSummary[]
  selectedMonth: number
}

export default function CategoryBreakdown({ data, selectedMonth }: Props) {
  const summary = data[selectedMonth] ?? data[data.length - 1]
  if (!summary) return null

  const entries = Object.entries(summary.expensesByCategory)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)

  const chartData = entries.map(([name, value]) => ({ name, value }))

  if (chartData.length === 0) {
    return (
      <div className="card flex items-center justify-center" style={{ minHeight: 280 }}>
        <p className="text-sm text-zinc-400">Aucune dépense pour {MONTHS_FR[summary.month - 1]} {summary.year}</p>
      </div>
    )
  }

  return (
    <div className="card">
      <p className="section-title">Dépenses par catégorie — {MONTHS_FR[summary.month - 1]} {summary.year}</p>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#888'} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => fmt(value)} contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
        {chartData.map((entry) => (
          <span key={entry.name} className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[entry.name] ?? '#888' }} />
            {entry.name} — {fmt(entry.value)}
          </span>
        ))}
      </div>
    </div>
  )
}
