-- ============================================================
-- DevOS Tracker · Supabase schema
-- Run this ONCE in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Per-user settings (Java plan config)
create table public.settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_start_date date not null default current_date,
  plan_days int not null default 240,
  daily_java_minutes int not null default 180,
  created_at timestamptz not null default now()
);

-- 2. Habits (checklist definitions)
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default '✅',
  color text not null default '#43D6B5',
  type text not null default 'check' check (type in ('check','steps','water','hours')),
  target numeric not null default 1,      -- steps: 10000 · water: 4 (litres) · hours: 2 · check: 1
  monthly_goal int not null default 30,   -- how many times per month
  sort_order int not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Daily habit logs (one row per habit per day)
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null,
  value numeric not null default 0,
  completed boolean not null default false,
  unique (habit_id, log_date)
);

-- 4. Java study sessions (time blocks toward the daily 3h target)
create table public.java_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null default current_date,
  minutes int not null check (minutes > 0),
  note text,
  created_at timestamptz not null default now()
);

-- 5. DSA problem logs
create table public.dsa_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  problems int not null default 1 check (problems > 0),
  topic text,
  created_at timestamptz not null default now()
);

-- Indexes
create index habit_logs_user_date_idx on public.habit_logs (user_id, log_date);
create index java_sessions_user_date_idx on public.java_sessions (user_id, session_date);
create index dsa_logs_user_date_idx on public.dsa_logs (user_id, log_date);

-- Row Level Security: each user sees only their own rows
alter table public.settings enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.java_sessions enable row level security;
alter table public.dsa_logs enable row level security;

create policy "own settings" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own habit_logs" on public.habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own java_sessions" on public.java_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own dsa_logs" on public.dsa_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Spaced repetition for DSA problems
-- Run this block on an existing database to upgrade it.
-- ─────────────────────────────────────────────────────────────
alter table public.dsa_logs
  add column if not exists title text,
  add column if not exists next_review date,
  add column if not exists review_stage int not null default 0,
  add column if not exists last_reviewed date;

create index if not exists dsa_logs_next_review_idx
  on public.dsa_logs (user_id, next_review);

-- ─────────────────────────────────────────────────────────────
-- Reading list. Safe to run on an existing database.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  author text,
  category text,                                   -- tech / fiction / etc.
  total_pages int check (total_pages is null or total_pages > 0),
  pages_read int not null default 0 check (pages_read >= 0),
  status text not null default 'reading'
    check (status in ('want', 'reading', 'finished', 'abandoned')),
  rating int check (rating is null or (rating between 1 and 5)),
  notes text,
  started_on date,
  finished_on date,
  created_at timestamptz not null default now()
);

create index if not exists books_user_status_idx on public.books (user_id, status);

alter table public.books enable row level security;

drop policy if exists "own books" on public.books;
create policy "own books" on public.books
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Per-session reading log: how many pages, on which day.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.book_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  session_date date not null default current_date,
  pages int not null check (pages > 0),
  created_at timestamptz not null default now()
);

create index if not exists book_sessions_user_date_idx
  on public.book_sessions (user_id, session_date);

alter table public.book_sessions enable row level security;

drop policy if exists "own book sessions" on public.book_sessions;
create policy "own book sessions" on public.book_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
