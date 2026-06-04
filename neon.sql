-- VilmaGourmet - Neon PostgreSQL
-- Cole no SQL Editor do Neon e execute.

create extension if not exists pgcrypto;

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  package_quantity numeric(12,3) not null default 0,
  package_unit text not null default 'g',
  package_cost numeric(12,2) not null default 0,
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  extra_percent numeric(8,2) not null default 25,
  profit_multiplier numeric(8,2) not null default 3,
  yield_quantity numeric(12,2) not null default 1,
  individual_package_cost numeric(12,2) not null default 0,
  sale_price numeric(12,2) not null default 0,
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  quantity_used numeric(12,3) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_date date not null default current_date,
  client_name text not null,
  product_name text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  total_price numeric(12,2) not null default 0,
  status text not null default 'Pendente',
  payment_method text default 'Pix',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id int primary key default 1,
  content text default '',
  updated_at timestamptz not null default now(),
  constraint notes_single_row check (id = 1)
);

insert into notes (id, content)
values (1, '')
on conflict (id) do nothing;

create index if not exists ingredients_name_idx on ingredients(name);
create index if not exists recipes_name_idx on recipes(name);
create index if not exists recipe_items_recipe_idx on recipe_items(recipe_id);
create index if not exists orders_order_date_idx on orders(order_date desc);

-- Atualização para site público + checkout Mercado Pago
alter table orders add column if not exists customer_phone text default '';
alter table orders add column if not exists customer_address text default '';
alter table orders add column if not exists customer_number text default '';
alter table orders add column if not exists customer_neighborhood text default '';
alter table orders add column if not exists customer_complement text default '';
alter table orders add column if not exists delivery_fee numeric(12,2) not null default 0;
alter table orders add column if not exists payment_status text default 'Pendente';
alter table orders add column if not exists mp_payment_id text default '';
create index if not exists orders_mp_payment_id_idx on orders(mp_payment_id);
