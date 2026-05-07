import { createClient } from '@supabase/supabase-js'
import type { FixedCharge, VariableExpense, MonthlySaving, MonthSummary, WifeInvoice, WifeVariableExpense, WifeMonthlySaving, WifeSettings, SharedContribution, SharedExpense } from './types'
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

// ── Wife — Invoices ─────────────────────────────────────────────

function monthRange(year: number, month: number) {
  const padM = String(month).padStart(2, '0')
  const lastDay = String(new Date(year, month, 0).getDate()).padStart(2, '0')
  return { from: `${year}-${padM}-01`, to: `${year}-${padM}-${lastDay}` }
}

export async function getWifeInvoices(year: number, month: number): Promise<WifeInvoice[]> {
  const { from, to } = monthRange(year, month)
  const { data, error } = await supabase
    .from('wife_invoices')
    .select('*')
    .gte('date_issued', from)
    .lte('date_issued', to)
    .order('date_issued', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getWifeEncaisseForMonth(year: number, month: number): Promise<WifeInvoice[]> {
  const { from, to } = monthRange(year, month)
  const { data, error } = await supabase
    .from('wife_invoices')
    .select('*')
    .eq('status', 'payée')
    .gte('date_paid', from)
    .lte('date_paid', to)
  if (error) throw error
  return data ?? []
}

export async function getWifeAnnualCA(year: number): Promise<number> {
  const { data, error } = await supabase
    .from('wife_invoices')
    .select('amount')
    .gte('date_issued', `${year}-01-01`)
    .lte('date_issued', `${year}-12-31`)
  if (error) throw error
  return (data ?? []).reduce((s, inv) => s + inv.amount, 0)
}

export async function addWifeInvoice(
  invoice: Omit<WifeInvoice, 'id' | 'created_at'>
): Promise<WifeInvoice> {
  const { data, error } = await supabase
    .from('wife_invoices')
    .insert(invoice)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateWifeInvoiceStatus(
  id: string,
  status: WifeInvoice['status'],
  date_paid?: string | null
): Promise<void> {
  const update: { status: WifeInvoice['status']; date_paid?: string | null } = { status }
  if (date_paid !== undefined) update.date_paid = date_paid
  const { error } = await supabase.from('wife_invoices').update(update).eq('id', id)
  if (error) throw error
}

export async function deleteWifeInvoice(id: string): Promise<void> {
  const { error } = await supabase.from('wife_invoices').delete().eq('id', id)
  if (error) throw error
}

// ── Wife — Variable expenses ─────────────────────────────────────

export async function getWifeVariableExpenses(year: number, month: number): Promise<WifeVariableExpense[]> {
  const { data, error } = await supabase
    .from('wife_variable_expenses')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .order('expense_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addWifeVariableExpense(
  expense: Omit<WifeVariableExpense, 'id' | 'created_at'>
): Promise<WifeVariableExpense> {
  const { data, error } = await supabase
    .from('wife_variable_expenses')
    .insert(expense)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteWifeVariableExpense(id: string): Promise<void> {
  const { error } = await supabase.from('wife_variable_expenses').delete().eq('id', id)
  if (error) throw error
}

// ── Wife — Monthly savings ───────────────────────────────────────

export async function getWifeMonthlySaving(year: number, month: number): Promise<WifeMonthlySaving | null> {
  const { data, error } = await supabase
    .from('wife_monthly_savings')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function upsertWifeMonthlySaving(year: number, month: number, amount: number): Promise<WifeMonthlySaving> {
  const { data, error } = await supabase
    .from('wife_monthly_savings')
    .upsert({ year, month, amount }, { onConflict: 'year,month' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Wife — Settings ──────────────────────────────────────────────

export async function getWifeSettings(): Promise<WifeSettings> {
  const { data, error } = await supabase
    .from('wife_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw error
  return data ?? { id: 1, monthly_goal: 0 }
}

export async function updateWifeMonthlyGoal(monthly_goal: number): Promise<void> {
  const { error } = await supabase
    .from('wife_settings')
    .upsert({ id: 1, monthly_goal }, { onConflict: 'id' })
  if (error) throw error
}

// ── Shared account — Contributions ──────────────────────────────

export async function getSharedContributions(year: number, month: number): Promise<SharedContribution[]> {
  const { data, error } = await supabase
    .from('shared_contributions')
    .select('*')
    .eq('year', year)
    .eq('month', month)
  if (error) throw error
  return (data ?? []) as SharedContribution[]
}

export async function upsertSharedContribution(
  year: number,
  month: number,
  person: 'yanis' | 'wife',
  amount: number
): Promise<void> {
  const { error } = await supabase
    .from('shared_contributions')
    .upsert({ year, month, person, amount }, { onConflict: 'year,month,person' })
  if (error) throw error
}

// ── Shared account — Expenses ────────────────────────────────────

export async function getSharedExpenses(year: number, month: number): Promise<SharedExpense[]> {
  const { data, error } = await supabase
    .from('shared_expenses')
    .select('*')
    .eq('year', year)
    .eq('month', month)
    .order('expense_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function addSharedExpense(
  expense: Omit<SharedExpense, 'id' | 'created_at'>
): Promise<SharedExpense> {
  const { data, error } = await supabase
    .from('shared_expenses')
    .insert(expense)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteSharedExpense(id: string): Promise<void> {
  const { error } = await supabase.from('shared_expenses').delete().eq('id', id)
  if (error) throw error
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
      .in('year', Array.from(new Set(months.map((m) => m.year)))),
    supabase
      .from('monthly_savings')
      .select('*')
      .in('year', Array.from(new Set(months.map((m) => m.year)))),
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
