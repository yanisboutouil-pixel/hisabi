import { fmt } from '@/lib/utils'
import { MONTHS_FR } from '@/lib/constants'

interface Props {
  caEncaisse: number
  urssaf: number
  year: number
  month: number
}

export default function WifeUrssafBanner({ caEncaisse, urssaf, year, month }: Props) {
  const nextMonthNum = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  const lastDay = new Date(nextYear, nextMonthNum, 0).getDate()
  const deadline = `${lastDay} ${MONTHS_FR[nextMonthNum - 1]} ${nextYear}`

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-0.5">
            Déclaration URSSAF mensuelle
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            À déclarer avant le {deadline} · basé sur le CA encaissé (obligatoire)
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-amber-800 dark:text-amber-200">{fmt(urssaf)}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500">sur {fmt(caEncaisse)} encaissés</p>
        </div>
      </div>
    </div>
  )
}
