'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { MonthSummary } from '@/lib/types'
import { fmt } from '@/lib/utils'

export default function MonthComparison({ data }: { data: MonthSummary[] }) {
  const chartData = data.map((m) => ({
    label: m.label,
    'Charges fixes':  Math.round(m.totalFixed),
    'Dépenses var.':  Math.round(m.totalVariable),
    'Livret A':       Math.round(m.livretA),
    'À investir':     Math.round(Math.max(0, m.invest)),
  }))

  return (
    <div className="card">
      <p className="section-title">Comparaison mensuelle</p>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} €`} />
            <Tooltip
              formatter={(value: number) => fmt(value)}
              contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="Charges fixes"  stackId="a" fill="#185FA5" radius={[0,0,0,0]} />
            <Bar dataKey="Livret A"       stackId="a" fill="#0F9B71" />
            <Bar dataKey="Dépenses var."  stackId="a" fill="#E8960F" />
            <Bar dataKey="À investir"     stackId="a" fill="#0A7254" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
