export const SALARY = 2150

export const DEFAULT_FIXED_CHARGES = [
  { id: 'loyer', label: 'Loyer (ta part)', amount: 660, account: "Caisse d'Épargne", split_with_wife: true },
  { id: 'pea',   label: 'PEA',             amount: 200, account: "Caisse d'Épargne", split_with_wife: false },
]
export const DEFAULT_FIXED_TOTAL = 860

export const CATEGORIES = [
  'Transport',
  'Alimentation',
  'Restaurants & Cafés',
  'Loisirs & Sorties',
  'Abonnements',
  'Shopping',
  'Santé',
  'Maison',
  'Autre',
]

export const ACCOUNTS = ['Revolut', "Caisse d'Épargne", 'Compte joint']

export const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export const CATEGORY_COLORS: Record<string, string> = {
  'Transport':          '#185FA5',
  'Alimentation':       '#0F9B71',
  'Restaurants & Cafés':'#E8960F',
  'Loisirs & Sorties':  '#BA7517',
  'Abonnements':        '#7F77DD',
  'Shopping':           '#D85A30',
  'Santé':              '#D4537E',
  'Maison':             '#378ADD',
  'Autre':              '#888780',
}

export const BAR_COLORS = {
  fixed:   '#185FA5',
  livretA: '#0F9B71',
  variable:'#E8960F',
  invest:  '#0A7254',
  over:    '#A32D2D',
}

export const URSSAF_RATE = 0.22
export const WIFE_ANNUAL_CAP = 77700
export const INVOICE_STATUSES = ['émise', 'payée', 'en retard'] as const
