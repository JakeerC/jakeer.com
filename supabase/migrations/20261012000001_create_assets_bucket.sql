-- Create public assets storage bucket if not exists
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Drop existing policies if any for idempotency
drop policy if exists "Allow public read access" on storage.objects;
drop policy if exists "Allow authenticated users to insert" on storage.objects;
drop policy if exists "Allow authenticated users to update" on storage.objects;
drop policy if exists "Allow authenticated users to delete" on storage.objects;
drop policy if exists "Public read access for assets" on storage.objects;
drop policy if exists "Authenticated users can upload assets" on storage.objects;
drop policy if exists "Authenticated users can update assets" on storage.objects;
drop policy if exists "Authenticated users can delete assets" on storage.objects;

-- Public read access for assets
create policy "Public read access for assets"
  on storage.objects for select
  to public
  using (bucket_id = 'assets');

-- Authenticated users can upload assets
create policy "Authenticated users can upload assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'assets');

-- Authenticated users can update/upsert assets
create policy "Authenticated users can update assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'assets')
  with check (bucket_id = 'assets');

-- Authenticated users can delete assets
create policy "Authenticated users can delete assets"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'assets');
