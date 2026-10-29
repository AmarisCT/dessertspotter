-- Dessert Spotter: photos people add after they try something.
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run. It's safe to run more than once.

-- 1. The list of photos (one row per photo).
create table if not exists public.photos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  spot_ref   text not null check (char_length(spot_ref) between 1 and 120),
  spot_name  text check (char_length(spot_name) <= 120),
  dessert    text check (char_length(dessert) <= 60),
  path       text not null unique check (char_length(path) <= 200),
  created_at timestamptz not null default now()
);
create index if not exists photos_spot_ref_idx on public.photos (spot_ref, created_at desc);
create index if not exists photos_created_at_idx on public.photos (created_at desc);

alter table public.photos enable row level security;

drop policy if exists "Anyone can see photos" on public.photos;
create policy "Anyone can see photos" on public.photos
  for select using (true);

drop policy if exists "Signed-in people add their own photos" on public.photos;
create policy "Signed-in people add their own photos" on public.photos
  for insert to authenticated
  with check (user_id = auth.uid() and split_part(path, '/', 1) = auth.uid()::text);

drop policy if exists "People delete their own photos" on public.photos;
create policy "People delete their own photos" on public.photos
  for delete to authenticated
  using (user_id = auth.uid());

-- 2. Where the image files live. Public, so anyone can view them; 3 MB limit; images only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Signed-in people upload into their own folder" on storage.objects;
create policy "Signed-in people upload into their own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "People delete their own uploads" on storage.objects;
create policy "People delete their own uploads" on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
