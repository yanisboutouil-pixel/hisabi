'use client'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import MonthNav from '@/components/MonthNav'
import MetricCards from '@/components/MetricCards'
import AllocationBar from '@/components/AllocationBar'
import FixedChargesCard from '@/components/FixedChargesCard'
import LivretACard from '@/components/LivretACard'
import VariableExpensesCard from '@/components/VariableExpensesCard'
import InvestBanner from '@/components/InvestBanner'
import { getFixedCharges, getVariableExpenses, getMonthlySaving } from '@/lib/supabase'
import type { FixedCharge, VariableExpense } from '@/lib/types'
import { DEFAULT_FIXED_TOTAL } from '@/lib/constants'
import { effectiveAmount } from '@/lib/utils'

export default function Home() {
  const now = new Date()
  const [year, setYear]       = useState(now.getFullYear())
  const [month, setMonth]     = useState(now.getMonth() + 1)

  const [fixedCharges, setFixedCharges]   = useState<FixedCharge[]>([])
  const [expenses, setExpenses]           = useState<VariableExpense[]>([])
  const [livretA, setLivretA]             = useState(0)

  const load = useCallback(async () => {
    const [fc, exp, sav] = await Promise.all([
      getFixedCharges(),
      getVariableExpenses(year, month),
      getMonthlySaving(year, month),
    ])
    setFixedCharges(fc)
    setExpenses(exp)
    setLivretA(sav?.livret_a ?? 0)
  }, [year, month])

  useEffect(() => { load() }, [load])

  const handleMonthChange = (y: number, m: number) => { setYear(y); setMonth(m) }

  const totalCustomFixed = fixedCharges.reduce((s, f) => s + effectiveAmount(f.amount, f.split_with_wife), 0)
  const totalFixed    = DEFAULT_FIXED_TOTAL + totalCustomFixed
  const totalVariable = expenses.reduce((s, e) => s + e.amount, 0)
  const invest        = 2150 - totalFixed - totalVariable - livretA

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <MonthNav year={year} month={month} onChange={handleMonthChange} />
        <MetricCards totalFixed={totalFixed} totalVariable={totalVariable} livretA={livretA} invest={invest} />
        <AllocationBar totalFixed={totalFixed} livretA={livretA} totalVariable={totalVariable} invest={invest} />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <FixedChargesCard charges={fixedCharges} onUpdate={load} />
          </div>
          <div>
            <LivretACard year={year} month={month} livretA={livretA} onUpdate={load} />
          </div>
        </div>

        <VariableExpensesCard year={year} month={month} expenses={expenses} onUpdate={load} />
        <InvestBanner invest={invest} />
      </main>
    </div>
  )
}
