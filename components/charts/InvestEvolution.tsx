'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { MonthSummary } from '@/lib/types'
import { fmt } from '@/lib/utils'

export default function InvestEvolution({ data }: { data: MonthSummary[] }) {
  return (
    <div className="card">
      <p className="section-title">Évolution du disponible à investir</p>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} €`} />
            <Tooltip
              formatter={(value: number) => [fmt(value), 'Disponible']}
              contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 13 }}
            />
            <ReferenceLine y={0} stroke="#e11d48" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="invest"
              stroke="#0F9B71"
              strokeWidth={2.5}
              dot={{ fill: '#0F9B71', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
