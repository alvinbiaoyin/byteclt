-- Jianji™ laboratory intelligence schema
-- Run in Supabase SQL Editor, then apply seed.sql

create table if not exists public.laboratories (
  id text primary key,
  name text not null,
  city text not null,
  province text not null,
  longitude numeric(10, 6) not null,
  latitude numeric(10, 6) not null,
  biomarkers text[] not null default '{}',
  assays text[] not null default '{}',
  platform text not null,
  utilization integer not null check (utilization >= 0 and utilization <= 100),
  tier text not null,
  tat_days integer not null check (tat_days > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists laboratories_province_idx on public.laboratories (province);
create index if not exists laboratories_platform_idx on public.laboratories (platform);

alter table public.laboratories enable row level security;

create policy "Allow public read access on laboratories"
  on public.laboratories
  for select
  to anon, authenticated
  using (true);
