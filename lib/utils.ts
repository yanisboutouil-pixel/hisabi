export function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' €'
}

export function defaultDateForMonth(year: number, month: number): string {
  const today = new Date()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1
  if (isCurrentMonth) return today.toISOString().split('T')[0]
  const lastDay = new Date(year, month, 0).getDate()
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
}

export function badgeClass(account: string): string {
  if (account === 'Revolut')      return 'badge-rev'
  if (account === 'Compte joint') return 'badge-cj'
  return 'badge-ce'
}

export function effectiveAmount(amount: number, splitWithWife: boolean): number {
  return splitWithWife ? amount / 2 : amount
}
