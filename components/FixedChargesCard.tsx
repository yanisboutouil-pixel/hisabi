'use client'
import { useState } from 'react'
import type { FixedCharge } from '@/lib/types'
import { DEFAULT_FIXED_CHARGES, ACCOUNTS } from '@/lib/constants'
import { fmt, badgeClass, effectiveAmount } from '@/lib/utils'
import { addFixedCharge, deleteFixedCharge } from '@/lib/supabase'

interface Props {
  charges: FixedCharge[]
  onUpdate: () => void
}

export default function FixedChargesCard({ charges, onUpdate }: Props) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('Revolut')
  const [split, setSplit] = useState(false)
  const [loading, setLoading] = useState(false)

  const preview = amount
    ? split
      ? `Montant total : ${fmt(parseFloat(amount))} → ta part : ${fmt(parseFloat(amount) / 2)}`
      : `Montant à déduire : ${fmt(parseFloat(amount))}`
    : ''

  const handleAdd = async () => {
    if (!label.trim() || !parseFloat(amount)) return
    setLoading(true)
    try {
      await addFixedCharge({ label: label.trim(), amount: parseFloat(amount), split_with_wife: split, account })
      setLabel(''); setAmount(''); setSplit(false); setOpen(false)
      onUpdate()
    } finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    await deleteFixedCharge(id)
    onUpdate()
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="section-title mb-0">Charges fixes</p>
        <button onClick={() => setOpen(!open)} className="btn-ghost flex items-center gap-1.5 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </button>
      </div>

      {/* Default charges */}
      <div className="opacity-60">
        {DEFAULT_FIXED_CHARGES.map((c) => (
          <div key={c.id} className="row-item">
            <span className="text-zinc-700 dark:text-zinc-300">{c.label}</span>
            <div className="flex items-center gap-2">
              {c.split_with_wife && <span className="badge badge-split">÷ 2</span>}
              <span className={`badge ${badgeClass(c.account)}`}>{c.account}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{fmt(c.amount)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Custom charges */}
      {charges.map((c) => {
        const eff = effectiveAmount(c.amount, c.split_with_wife)
        return (
          <div key={c.id} className="row-item">
            <span className="text-zinc-700 dark:text-zinc-300">{c.label}</span>
            <div className="flex items-center gap-2">
              {c.split_with_wife && <span className="badge badge-split">÷ 2</span>}
              <span className={`badge ${badgeClass(c.account)}`}>{c.account}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {fmt(eff)}
                {c.split_with_wife && <span className="text-xs text-zinc-400 ml-1">({fmt(c.amount)} ÷ 2)</span>}
              </span>
              <button onClick={() => handleDelete(c.id)} className="btn-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        )
      })}

      {/* Add form */}
      {open && (
        <div className="border-t border-border-light dark:border-border-dark pt-4 mt-2">
          <div className="grid grid-cols-4 gap-2 mb-2">
            <input className="col-span-2" placeholder="Libellé (ex : Assurance auto)" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input type="number" placeholder="Montant total €" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} />
            <select value={account} onChange={(e) => setAccount(e.target.value)}>
              {ACCOUNTS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
              <input type="checkbox" checked={split} onChange={(e) => setSplit(e.target.checked)} className="w-4 h-4 rounded accent-primary-600" />
              ÷ 2 avec Juliette
            </label>
            {preview && <span className="text-xs text-zinc-400">{preview}</span>}
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? '...' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
