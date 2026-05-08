'use client'
import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import MonthNav from '@/components/MonthNav'
import MetricCards from '@/components/MetricCards'
import AllocationBar from '@/components/AllocationBar'
import FixedChargesCard from '@/components/FixedChargesCard'
import LivretACard from '@/components/LivretACard'
import SalaryCard from '@/components/SalaryCard'
import VariableExpensesCard from '@/components/VariableExpensesCard'
import InvestBanner from '@/components/InvestBanner'
import { getFixedCharges, getVariableExpenses, getMonthlySaving, getMonthlySalary } from '@/lib/supabase'
import type { FixedCharge, VariableExpense } from '@/lib/types'
import { DEFAULT_FIXED_TOTAL } from '@/lib/constants'
import { effectiveAmount } from '@/lib/utils'

export default function Home() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [salary, setSalary]             = useState(0)
  const [fixedCharges, setFixedCharges] = useState<FixedCharge[]>([])
  const [expenses, setExpenses]         = useState<VariableExpense[]>([])
  const [livretA, setLivretA]           = useState(0)

  const load = useCallback(async () => {
    const [sal, fc, exp, sav] = await Promise.all([
      getMonthlySalary(year, month).catch(() => null),
      getFixedCharges(),
      getVariableExpenses(year, month),
      getMonthlySaving(year, month),
    ])
    setSalary(sal?.amount ?? 0)
    setFixedCharges(fc)
    setExpenses(exp)
    setLivretA(sav?.livret_a ?? 0)
  }, [year, month])

  useEffect(() => { load() }, [load])

  const totalCustomFixed = fixedCharges.reduce((s, f) => s + effectiveAmount(f.amount, f.split_with_wife), 0)
  const totalFixed    = DEFAULT_FIXED_TOTAL + totalCustomFixed
  const totalVariable = expenses.reduce((s, e) => s + e.amount, 0)
  const invest        = salary - totalFixed - totalVariable - livretA

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <MonthNav year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m) }} salary={salary} />
        <MetricCards salary={salary} totalFixed={totalFixed} totalVariable={totalVariable} livretA={livretA} invest={invest} />
        <AllocationBar salary={salary} totalFixed={totalFixed} livretA={livretA} totalVariable={totalVariable} invest={invest} />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <FixedChargesCard charges={fixedCharges} onUpdate={load} />
          </div>
          <div className="flex flex-col gap-4">
            <SalaryCard year={year} month={month} salary={salary} onUpdate={load} />
            <LivretACard year={year} month={month} livretA={livretA} onUpdate={load} />
          </div>
        </div>

        <VariableExpensesCard year={year} month={month} expenses={expenses} onUpdate={load} />
        <InvestBanner invest={invest} />
      </main>
    </div>
  )
}
