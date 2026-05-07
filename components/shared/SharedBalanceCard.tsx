import { fmt } from '@/lib/utils'

interface Props {
  totalContributions: number
  totalExpenses: number
  balance: number
  yanisContrib: number
  wifeContrib: number
}

export default function SharedBalanceCard({ totalContributions, totalExpenses, balance, yanisContrib, wifeContrib }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="metric-card">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Yanis</p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{fmt(yanisContrib)}</p>
        <p className="text-xs text-zinc-400">Versement</p>
      </div>
      <div className="metric-card">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Juliette</p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{fmt(wifeContrib)}</p>
        <p className="text-xs text-zinc-400">Versement</p>
      </div>
      <div className={`metric-card ${balance < 0 ? 'border-red-200 dark:border-red-800' : ''}`}>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Solde</p>
        <p className={`text-xl font-semibold ${balance >= 0 ? 'text-primary-600 dark:text-primary-200' : 'text-red-600 dark:text-red-400'}`}>
          {fmt(balance)}
        </p>
        <p className="text-xs text-zinc-400">{fmt(totalContributions)} versés − {fmt(totalExpenses)} dépensés</p>
      </div>
    </div>
  )
}
