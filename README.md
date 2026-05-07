# Hisabi — حسابي

Ton outil de gestion budgétaire personnelle. Stack : **Next.js 14 + Supabase + Vercel**.

---

## Déploiement en 5 étapes

### 1. Créer ton projet Supabase

1. Va sur [supabase.com](https://supabase.com) et crée un compte
2. Clique **"New project"**, donne-lui un nom (ex : `hisabi`), choisis une région Europe
3. Une fois le projet créé, va dans **SQL Editor** (menu gauche)
4. Colle le contenu du fichier `supabase-schema.sql` et clique **Run**
5. Va dans **Project Settings → API** et note :
   - `Project URL` → c'est ta `SUPABASE_URL`
   - `anon public` key → c'est ta `SUPABASE_ANON_KEY`

---

### 2. Configurer les variables d'environnement en local

Dans le dossier du projet, copie le fichier `.env.local.example` :

```bash
cp .env.local.example .env.local
```

Puis ouvre `.env.local` et remplace les valeurs :

```
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

---

### 3. Installer les dépendances et tester en local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

### 4. Pousser sur GitHub

1. Crée un nouveau repo sur [github.com](https://github.com) (bouton **New repository**)
2. Dans le terminal, dans le dossier du projet :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/hisabi.git
git push -u origin main
```

---

### 5. Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com), connecte ton compte GitHub
2. Clique **"Add New Project"**, importe le repo `hisabi`
3. Dans la section **Environment Variables**, ajoute :
   - `NEXT_PUBLIC_SUPABASE_URL` → ta valeur
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → ta valeur
4. Clique **Deploy** — ton app sera en ligne en 2 minutes ! 🎉

---

## Structure du projet

```
hisabi/
├── app/
│   ├── page.tsx              — Dashboard principal
│   └── historique/page.tsx   — Page historique avec graphiques
├── components/
│   ├── Header.tsx            — Barre de navigation
│   ├── FixedChargesCard.tsx  — Charges fixes
│   ├── VariableExpensesCard.tsx — Dépenses variables
│   ├── LivretACard.tsx       — Livret A
│   ├── InvestBanner.tsx      — Disponible à investir
│   └── charts/               — Graphiques recharts
├── lib/
│   ├── supabase.ts           — Client et requêtes DB
│   ├── constants.ts          — Salaire, catégories, couleurs
│   ├── types.ts              — Types TypeScript
│   └── utils.ts              — Fonctions utilitaires
└── supabase-schema.sql       — Schéma de la base de données
```

## Modifier le salaire ou les charges par défaut

Ouvre `lib/constants.ts` :

```ts
export const SALARY = 2150  // ← ton salaire

export const DEFAULT_FIXED_CHARGES = [
  { id: 'loyer', label: 'Loyer (ta part)', amount: 660, ... },
  { id: 'pea',   label: 'PEA',             amount: 200, ... },
]
```
