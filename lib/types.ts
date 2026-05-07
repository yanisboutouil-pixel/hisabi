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

export interface WifeInvoice {
  id: string
  number: string
  client_name: string
  amount: number
  date_issued: string
  date_paid: string | null
  status: 'émise' | 'payée' | 'en retard'
  notes: string | null
  created_at?: string
}

export interface WifeVariableExpense {
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

export interface WifeMonthlySaving {
  id?: string
  year: number
  month: number
  amount: number
}

export interface WifeSettings {
  id: number
  monthly_goal: number
}

export interface SharedContribution {
  id?: string
  year: number
  month: number
  person: 'yanis' | 'wife'
  amount: number
}

export interface SharedExpense {
  id: string
  year: number
  month: number
  label: string
  amount: number
  category: string
  expense_date: string
  created_at?: string
}
