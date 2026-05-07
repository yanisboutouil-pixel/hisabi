import { fmt } from '@/lib/utils'

interface Props {
  caEmis: number
  caEncaisse: number
  urssaf: number
  revenuNet: number
}

export default function WifeMetricCards({ caEmis, caEncaisse, urssaf, revenuNet }: Props) {
  const cards = [
    { label: 'CA émis ce mois',    value: caEmis,      note: 'Factures envoyées' },
    { label: 'CA encaissé',        value: caEncaisse,  note: 'Factures payées' },
    { label: 'URSSAF à réserver',  value: urssaf,      note: '22% du CA encaissé' },
    { label: 'Revenu net',         value: revenuNet,   note: 'Après cotisations' },
  ]
  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {cards.map((c) => (
        <div key={c.label} className="metric-card">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">{c.label}</p>
          <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{fmt(c.value)}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{c.note}</p>
        </div>
      ))}
    </div>
  )
}
