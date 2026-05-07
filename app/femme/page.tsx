'use client'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import MonthNav from '@/components/MonthNav'
import InvestBanner from '@/components/InvestBanner'
import WifeMetricCards from '@/components/wife/WifeMetricCards'
import WifeProgressBars from '@/components/wife/WifeProgressBars'
import WifeUrssafBanner from '@/components/wife/WifeUrssafBanner'
import WifeInvoicesCard from '@/components/wife/WifeInvoicesCard'
import WifeVariableExpensesCard from '@/components/wife/WifeVariableExpensesCard'
import WifeSavingsCard from '@/components/wife/WifeSavingsCard'
import {
  getWifeInvoices,
  getWifeEncaisseForMonth,
  getWifeAnnualCA,
  getWifeVariableExpenses,
  getWifeMonthlySaving,
  getWifeSettings,
} from '@/lib/supabase'
import type { WifeInvoice, WifeVariableExpense, WifeSettings } from '@/lib/types'
import { URSSAF_RATE } from '@/lib/constants'

export default function FemmePage() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [invoices, setInvoices]               = useState<WifeInvoice[]>([])
  const [encaisseInvoices, setEncaisseInvoices] = useState<WifeInvoice[]>([])
  const [annualCA, setAnnualCA]               = useState(0)
  const [expenses, setExpenses]               = useState<WifeVariableExpense[]>([])
  const [saving, setSaving]                   = useState(0)
  const [settings, setSettings]               = useState<WifeSettings>({ id: 1, monthly_goal: 0 })

  const load = useCallback(async () => {
    const [inv, enc, aCA, exp, sav, sets] = await Promise.all([
      getWifeInvoices(year, month),
      getWifeEncaisseForMonth(year, month),
      getWifeAnnualCA(year),
      getWifeVariableExpenses(year, month),
      getWifeMonthlySaving(year, month),
      getWifeSettings(),
    ])
    setInvoices(inv)
    setEncaisseInvoices(enc)
    setAnnualCA(aCA)
    setExpenses(exp)
    setSaving(sav?.amount ?? 0)
    setSettings(sets)
  }, [year, month])

  useEffect(() => { load() }, [load])

  const caEmis        = invoices.reduce((s, inv) => s + inv.amount, 0)
  const caEncaisse    = encaisseInvoices.reduce((s, inv) => s + inv.amount, 0)
  const urssaf        = caEncaisse * URSSAF_RATE
  const revenuNet     = caEncaisse - urssaf
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const disponible    = revenuNet - totalExpenses - saving

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <MonthNav year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} />
        <WifeMetricCards caEmis={caEmis} caEncaisse={caEncaisse} urssaf={urssaf} revenuNet={revenuNet} />
        <WifeProgressBars caEmis={caEmis} annualCA={annualCA} settings={settings} onUpdate={load} />
        <WifeUrssafBanner caEncaisse={caEncaisse} urssaf={urssaf} year={year} month={month} />
        <WifeInvoicesCard year={year} month={month} invoices={invoices} onUpdate={load} />
        <WifeVariableExpensesCard year={year} month={month} expenses={expenses} onUpdate={load} />
        <WifeSavingsCard year={year} month={month} saving={saving} onUpdate={load} />
        <InvestBanner invest={disponible} label="Revenu disponible" />
      </main>
    </div>
  )
}
