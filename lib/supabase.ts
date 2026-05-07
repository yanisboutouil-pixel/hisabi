import { createClient } from '@supabase/supabase-js'
import type { FixedCharge, VariableExpense, MonthlySaving, MonthSummary } from './types'
import { DEFAULT_FIXED_TOTAL, MONTHS_FR, SALARY } from './constants'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Fixed charges ──────────────────────────────────────────────

export async function getFixedCharges(): Promise<FixedCharge[]> {
  const { data, error } = await supabase
    .from('custom_fixed_charges')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function addFixedCharge(
  charge: Omit<FixedCharge, 'id' | 'created_at'>
): Promise<FixedCharge> {
  const { data, error } = await supabase
    .from('custom_fixed_charges')
    .insert(charge)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteFixedCharge(id: string): Promise<void> {
  const { error } = await supabase.from('custom_fixed_charges').delete().eq('id', id)
  if (error) throw error
}

// ── Variable expenses ──────────────────────────────────────────

export async function getVariableExpenses(
  year: number,
  month: number
): Promise<VariableExpense[]> {
  const { data, error } = await supabase
    .from('variable_expenses')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .order('expense_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addVariableExpense(
  expense: Omit<VariableExpense, 'id' | 'created_at'>
): Promise<VariableExpense> {
  const { data, error } = await supabase
    .from('variable_expenses')
    .insert(expense)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteVariableExpense(id: string): Promise<void> {
  const { error } = await supabase.from('variable_expenses').delete().eq('id', id)
  if (error) throw error
}

// ── Monthly savings ────────────────────────────────────────────

export async function getMonthlySaving(
  year: number,
  month: number
): Promise<MonthlySaving | null> {
  const { data, error } = await supabase
    .from('monthly_savings')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertMonthlySaving(
  year: number,
  month: number,
  livret_a: number
): Promise<MonthlySaving> {
  const { data, error } = await supabase
    .from('monthly_savings')
    .upsert({ year, month, livret_a }, { onConflict: 'year,month' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── History (last N months) ────────────────────────────────────

export async function getMonthSummaries(count: number = 12): Promise<MonthSummary[]> {
  const now = new Date()
  const months: { year: number; month: number }[] = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  const [fixedRows, expenseRows, savingRows] = await Promise.all([
    getFixedCharges(),
    supabase
      .from('variable_expenses')
      .select('*')
      .in('year', [...new Set(months.map((m) => m.year))]),
    supabase
      .from('monthly_savings')
      .select('*')
      .in('year', [...new Set(months.map((m) => m.year))]),
  ])

  const expenses: VariableExpense[] = (expenseRows.data ?? []) as VariableExpense[]
  const savings: MonthlySaving[]    = (savingRows.data  ?? []) as MonthlySaving[]

  const totalCustomFixed = fixedRows.reduce(
    (s, f) => s + (f.split_with_wife ? f.amount / 2 : f.amount),
    0
  )
  const totalFixed = DEFAULT_FIXED_TOTAL + totalCustomFixed

  return months.map(({ year, month }) => {
    const monthExpenses = expenses.filter((e) => e.year === year && e.month === month)
    const saving        = savings.find((s) => s.year === year && s.month === month)
    const totalVariable = monthExpenses.reduce((s, e) => s + e.amount, 0)
    const livretA       = saving?.livret_a ?? 0
    const invest        = SALARY - totalFixed - totalVariable - livretA

    const expensesByCategory: Record<string, number> = {}
    monthExpenses.forEach((e) => {
      expensesByCategory[e.category] = (expensesByCategory[e.category] ?? 0) + e.amount
    })

    return {
      year,
      month,
      label: `${MONTHS_FR[month - 1].slice(0, 3)} ${year}`,
      totalFixed,
      totalVariable,
      livretA,
      invest,
      expensesByCategory,
    }
  })
}
