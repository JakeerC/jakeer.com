-- Create content_drafts table
create table if not exists public.content_drafts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category    text not null check (category in ('writing', 'snippets', 'tools', 'notes')),
  title       text not null,
  slug        text not null,
  description text,
  markdown    text,
  metadata    jsonb default '{}'::jsonb,
  branch_name text,
  pr_number   integer,
  status      text default 'draft' check (status in ('draft', 'branch_created', 'pr_open', 'merged', 'archived', 'failed')),
  is_archived boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_content_drafts_user_id on public.content_drafts(user_id);
create index if not exists idx_content_drafts_category on public.content_drafts(category);
create index if not exists idx_content_drafts_archived on public.content_drafts(is_archived);
create index if not exists idx_content_drafts_status on public.content_drafts(status);

-- Enable Row Level Security
alter table public.content_drafts enable row level security;

-- Drop existing policies if any for idempotency
drop policy if exists "Users can view their own drafts" on public.content_drafts;
drop policy if exists "Users can insert their own drafts" on public.content_drafts;
drop policy if exists "Users can update their own drafts" on public.content_drafts;
drop policy if exists "Users can delete their own drafts" on public.content_drafts;
drop policy if exists "Users can view own drafts" on public.content_drafts;
drop policy if exists "Users can insert own drafts" on public.content_drafts;
drop policy if exists "Users can update own drafts" on public.content_drafts;
drop policy if exists "Users can delete own drafts" on public.content_drafts;

-- Policies: only authenticated authors can view, create, update, and delete their own drafts
create policy "Users can view own drafts"
  on public.content_drafts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own drafts"
  on public.content_drafts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own drafts"
  on public.content_drafts for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own drafts"
  on public.content_drafts for delete
  to authenticated
  using ((select auth.uid()) = user_id);
