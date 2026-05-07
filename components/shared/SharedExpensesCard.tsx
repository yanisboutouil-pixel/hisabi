'use client'
import { useState } from 'react'
import type { SharedExpense } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { fmt, defaultDateForMonth } from '@/lib/utils'
import { addSharedExpense, deleteSharedExpense } from '@/lib/supabase'

const CAT_ICONS: Record<string, React.ReactNode> = {
  'Transport':          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-5 10h7a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-7m-2 7-2-2m2 2 2-2M3 11h4"/>,
  'Alimentation':       <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
  'Restaurants & Cafés':<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>,
  'Loisirs & Sorties':  <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  'Abonnements':        <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.18-4.49"/></>,
  'Shopping':           <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
  'Santé':              <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
  'Maison':             <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  'Autre':              <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>,
}

function CategoryIcon({ cat }: { cat: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 flex-shrink-0">
      {CAT_ICONS[cat] ?? CAT_ICONS['Autre']}
    </svg>
  )
}

interface Props {
  year: number
  month: number
  expenses: SharedExpense[]
  onUpdate: () => void
}

export default function SharedExpensesCard({ year, month, expenses, onUpdate }: Props) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(defaultDateForMonth(year, month))
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!label.trim() || !parseFloat(amount)) return
    setLoading(true)
    try {
      await addSharedExpense({
        year, month,
        label: label.trim(),
        amount: parseFloat(amount),
        category: category || 'Autre',
        expense_date: date,
      })
      setLabel(''); setAmount(''); setCategory('')
      setDate(defaultDateForMonth(year, month))
      setOpen(false)
      onUpdate()
    } finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    await deleteSharedExpense(id)
    onUpdate()
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title mb-0">Dépenses communes</p>
          {expenses.length > 0 && (
            <p className="text-xs text-zinc-400">{fmt(total)} ce mois</p>
          )}
        </div>
        <button onClick={() => { setOpen(!open); setDate(defaultDateForMonth(year, month)) }} className="btn-ghost flex items-center gap-1.5 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </button>
      </div>

      {open && (
        <div className="border-t border-border-light dark:border-border-dark pt-4 mb-3">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input placeholder="Libellé" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input type="number" placeholder="Montant €" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Catégorie</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? '...' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">Aucune dépense ce mois-ci</p>
      ) : (
        expenses.map((e) => {
          const ds = new Date(e.expense_date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
          return (
            <div key={e.id} className="row-item">
              <div className="flex items-center gap-2.5">
                <CategoryIcon cat={e.category} />
                <div>
                  <p className="text-zinc-800 dark:text-zinc-200">{e.label}</p>
                  <p className="text-xs text-zinc-400">{e.category} · {ds}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">−{fmt(e.amount)}</span>
                <button onClick={() => handleDelete(e.id)} className="btn-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
