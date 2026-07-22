-- Repair missing app tables after moving to a new Supabase project.
-- This migration is intentionally non-destructive: it creates missing objects
-- but does not rewrite existing conversations, messages, or combinations data.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  onboarding_completed boolean default false,
  subscription text default 'free',
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view and edit their own profile" on public.profiles;
create policy "Users can view and edit their own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create table if not exists public.trends_cache (
  category text primary key,
  data jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trends_cache enable row level security;

drop policy if exists "Users can read trends cache" on public.trends_cache;
create policy "Users can read trends cache"
  on public.trends_cache
  for select
  using (true);

drop policy if exists "Service role can manage trends cache" on public.trends_cache;
create policy "Service role can manage trends cache"
  on public.trends_cache
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create or replace view public.chat_history as
select
  m.role,
  m.content,
  c.user_id,
  m.created_at
from public.messages m
join public.conversations c on m.conversation_id = c.id;
