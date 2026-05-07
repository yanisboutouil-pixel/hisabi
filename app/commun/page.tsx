'use client'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import MonthNav from '@/components/MonthNav'
import SharedBalanceCard from '@/components/shared/SharedBalanceCard'
import SharedContributionsCard from '@/components/shared/SharedContributionsCard'
import SharedExpensesCard from '@/components/shared/SharedExpensesCard'
import { getSharedContributions, getSharedExpenses } from '@/lib/supabase'
import type { SharedContribution, SharedExpense } from '@/lib/types'

export default function CommunPage() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [contributions, setContributions] = useState<SharedContribution[]>([])
  const [expenses, setExpenses]           = useState<SharedExpense[]>([])

  const load = useCallback(async () => {
    const [contribs, exps] = await Promise.all([
      getSharedContributions(year, month),
      getSharedExpenses(year, month),
    ])
    setContributions(contribs)
    setExpenses(exps)
  }, [year, month])

  useEffect(() => { load() }, [load])

  const yanisContrib     = contributions.find((c) => c.person === 'yanis')?.amount ?? 0
  const wifeContrib      = contributions.find((c) => c.person === 'wife')?.amount ?? 0
  const totalContribs    = yanisContrib + wifeContrib
  const totalExpenses    = expenses.reduce((s, e) => s + e.amount, 0)
  const balance          = totalContribs - totalExpenses

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <MonthNav year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} />
        <SharedBalanceCard
          totalContributions={totalContribs}
          totalExpenses={totalExpenses}
          balance={balance}
          yanisContrib={yanisContrib}
          wifeContrib={wifeContrib}
        />
        <SharedContributionsCard
          year={year}
          month={month}
          yanisContrib={yanisContrib}
          wifeContrib={wifeContrib}
          onUpdate={load}
        />
        <SharedExpensesCard year={year} month={month} expenses={expenses} onUpdate={load} />
      </main>
    </div>
  )
}
