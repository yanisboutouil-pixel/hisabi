export interface FixedCharge {
  id: string
  label: string
  amount: number
  split_with_wife: boolean
  account: string
  created_at?: string
}

export interface VariableExpense {
  id: string
  year: number
  month: number
  label: string
  amount: number
  account: string
  category: string
  expense_date: string
  created_at?: string
}

export interface MonthlySaving {
  id?: string
  year: number
  month: number
  livret_a: number
}

export interface MonthSummary {
  year: number
  month: number
  label: string
  totalFixed: number
  totalVariable: number
  livretA: number
  invest: number
  expensesByCategory: Record<string, number>
}
