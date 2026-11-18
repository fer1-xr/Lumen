-- Datos de estudio de cada usuario (notas, resaltados, marcadores, progreso, ajustes)
create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "leer propios datos" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insertar propios datos" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "actualizar propios datos" on public.user_data
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "borrar propios datos" on public.user_data
  for delete to authenticated using ((select auth.uid()) = user_id);
