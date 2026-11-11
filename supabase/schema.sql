-- Esegui questo script nel SQL Editor di Supabase.
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: senza queste policy chiunque abbia l'anon key leggerebbe tutto.
alter table public.progress enable row level security;

create policy "leggi solo i tuoi progressi" on public.progress
  for select using (auth.uid() = user_id);
create policy "crea solo i tuoi progressi" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "aggiorna solo i tuoi progressi" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cancella solo i tuoi progressi" on public.progress
  for delete using (auth.uid() = user_id);
