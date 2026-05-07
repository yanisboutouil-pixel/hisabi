-- Coller ce SQL dans l'éditeur SQL de ton tableau de bord Supabase

create table if not exists wife_invoices (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  client_name text not null,
  amount numeric(10,2) not null,
  date_issued date not null,
  date_paid date,
  status text not null default 'émise',
  notes text,
  created_at timestamptz default now()
);

create table if not exists wife_variable_expenses (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null,
  label text not null,
  amount numeric(10,2) not null,
  account text not null default 'Revolut',
  category text not null default 'Autre',
  expense_date date not null,
  created_at timestamptz default now()
);

create table if not exists wife_monthly_savings (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null,
  amount numeric(10,2) not null default 0,
  unique(year, month)
);

create table if not exists wife_settings (
  id int primary key default 1,
  monthly_goal numeric(10,2) not null default 0
);
insert into wife_settings (id, monthly_goal) values (1, 0) on conflict do nothing;

create table if not exists shared_contributions (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null,
  person text not null,
  amount numeric(10,2) not null default 0,
  unique(year, month, person)
);

create table if not exists shared_expenses (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  month int not null,
  label text not null,
  amount numeric(10,2) not null,
  category text not null default 'Autre',
  expense_date date not null,
  created_at timestamptz default now()
);
