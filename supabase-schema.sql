-- Hisabi — Schéma Supabase
-- Colle ce code dans l'éditeur SQL de ton projet Supabase (onglet "SQL Editor")

-- Charges fixes personnalisées (globales, pas par mois)
create table if not exists custom_fixed_charges (
  id            uuid primary key default gen_random_uuid(),
  label         text    not null,
  amount        numeric not null,
  split_with_wife boolean default false,
  account       text    not null,
  created_at    timestamptz default now()
);

-- Dépenses variables (par mois)
create table if not exists variable_expenses (
  id           uuid primary key default gen_random_uuid(),
  year         int  not null,
  month        int  not null,
  label        text not null,
  amount       numeric not null,
  account      text not null,
  category     text not null,
  expense_date date not null,
  created_at   timestamptz default now()
);

-- Épargne Livret A (par mois)
create table if not exists monthly_savings (
  id       uuid primary key default gen_random_uuid(),
  year     int     not null,
  month    int     not null,
  livret_a numeric default 0,
  unique(year, month)
);

-- Désactiver Row Level Security pour usage personnel (pas d'auth)
alter table custom_fixed_charges disable row level security;
alter table variable_expenses    disable row level security;
alter table monthly_savings      disable row level security;
