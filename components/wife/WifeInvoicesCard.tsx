'use client'
import { useState } from 'react'
import type { WifeInvoice } from '@/lib/types'
import { fmt } from '@/lib/utils'
import { addWifeInvoice, updateWifeInvoiceStatus, deleteWifeInvoice } from '@/lib/supabase'

const STATUS_STYLES: Record<WifeInvoice['status'], string> = {
  'émise':     'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'payée':     'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'en retard': 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

interface Props {
  year: number
  month: number
  invoices: WifeInvoice[]
  onUpdate: () => void
}

export default function WifeInvoicesCard({ invoices, onUpdate }: Props) {
  const [open, setOpen] = useState(false)
  const [number, setNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [amount, setAmount] = useState('')
  const [dateIssued, setDateIssued] = useState(() => new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!number.trim() || !clientName.trim() || !parseFloat(amount)) return
    setLoading(true)
    try {
      await addWifeInvoice({
        number: number.trim(),
        client_name: clientName.trim(),
        amount: parseFloat(amount),
        date_issued: dateIssued,
        date_paid: null,
        status: 'émise',
        notes: notes.trim() || null,
      })
      setNumber(''); setClientName(''); setAmount(''); setNotes('')
      setDateIssued(new Date().toISOString().slice(0, 10))
      setOpen(false)
      onUpdate()
    } finally { setLoading(false) }
  }

  const handleMarkPaid = async (id: string) => {
    await updateWifeInvoiceStatus(id, 'payée', new Date().toISOString().slice(0, 10))
    onUpdate()
  }

  const handleMarkLate = async (id: string) => {
    await updateWifeInvoiceStatus(id, 'en retard')
    onUpdate()
  }

  const handleReset = async (id: string) => {
    await updateWifeInvoiceStatus(id, 'émise', null)
    onUpdate()
  }

  const handleDelete = async (id: string) => {
    await deleteWifeInvoice(id)
    onUpdate()
  }

  const total = invoices.reduce((s, inv) => s + inv.amount, 0)

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-title mb-0">Factures</p>
          {invoices.length > 0 && (
            <p className="text-xs text-zinc-400">{invoices.length} facture{invoices.length > 1 ? 's' : ''} · {fmt(total)}</p>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="btn-ghost flex items-center gap-1.5 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter
        </button>
      </div>

      {open && (
        <div className="border-t border-border-light dark:border-border-dark pt-4 mb-3">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <input placeholder="N° facture" value={number} onChange={(e) => setNumber(e.target.value)} />
            <input placeholder="Client" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <input type="number" placeholder="Montant €" value={amount} onChange={(e) => setAmount(e.target.value)} min={0} />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input type="date" value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} />
            <input placeholder="Notes (optionnel)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
            <button className="btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? '...' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">Aucune facture ce mois-ci</p>
      ) : (
        invoices.map((inv) => {
          const ds = new Date(inv.date_issued + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
          return (
            <div key={inv.id} className="row-item">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-zinc-800 dark:text-zinc-200 font-medium">{inv.client_name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${STATUS_STYLES[inv.status]}`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  N°{inv.number} · {ds}{inv.notes ? ` · ${inv.notes}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{fmt(inv.amount)}</span>
                {inv.status === 'émise' && (
                  <>
                    <button onClick={() => handleMarkPaid(inv.id)} className="btn-ghost py-0.5 px-2 text-xs text-green-700 dark:text-green-400">Payée</button>
                    <button onClick={() => handleMarkLate(inv.id)} className="btn-ghost py-0.5 px-2 text-xs text-red-600 dark:text-red-400">En retard</button>
                  </>
                )}
                {inv.status === 'en retard' && (
                  <>
                    <button onClick={() => handleMarkPaid(inv.id)} className="btn-ghost py-0.5 px-2 text-xs text-green-700 dark:text-green-400">Payée</button>
                    <button onClick={() => handleReset(inv.id)} className="btn-ghost py-0.5 px-2 text-xs">Réinitialiser</button>
                  </>
                )}
                {inv.status === 'payée' && (
                  <button onClick={() => handleReset(inv.id)} className="btn-ghost py-0.5 px-2 text-xs">Réinitialiser</button>
                )}
                <button onClick={() => handleDelete(inv.id)} className="btn-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
