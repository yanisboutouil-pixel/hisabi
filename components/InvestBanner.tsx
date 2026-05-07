import { fmt } from '@/lib/utils'

export default function InvestBanner({ invest }: { invest: number }) {
  const positive = invest >= 0
  return (
    <div className={`rounded-2xl p-5 flex items-center justify-between ${
      positive
        ? 'bg-primary-50 dark:bg-primary-700/10 border border-primary-200 dark:border-primary-700/30'
        : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700/30'
    }`}>
      <div>
        <p className={`text-sm font-medium mb-0.5 ${positive ? 'text-primary-700 dark:text-primary-300' : 'text-red-700 dark:text-red-400'}`}>
          Disponible à investir
        </p>
        <p className="text-xs text-zinc-400">Après charges, dépenses et épargne</p>
      </div>
      <p className={`text-3xl font-semibold ${positive ? 'text-primary-700 dark:text-primary-300' : 'text-red-600 dark:text-red-400'}`}>
        {fmt(invest)}
      </p>
    </div>
  )
}
