create extension if not exists pgcrypto;

create table if not exists public.charter_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null check (
    email ~* '^[A-Za-z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$'
  ),
  phone text,
  yacht text,
  date date,
  message text,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create index if not exists charter_requests_created_at_idx
on public.charter_requests (created_at desc);

create index if not exists charter_requests_status_idx
on public.charter_requests (status);

alter table public.charter_requests enable row level security;

-- Browser traffic should not write directly to Supabase.
-- The backend uses the service-role / secret key, which bypasses RLS.
-- If you ever connect the browser directly, create a public INSERT policy and
-- avoid storing service credentials in the frontend.
