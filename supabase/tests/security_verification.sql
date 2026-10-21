-- ============================================================================
-- Security Verification Queries for Supabase Database & Storage Baseline
-- ============================================================================

-- 1. Verify RLS is enabled on public.content_drafts
select
  schemaname,
  tablename,
  rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public' and tablename = 'content_drafts';

-- 2. Verify all policies on public.content_drafts
select
  policyname,
  cmd,
  roles,
  qual as using_expression,
  with_check as with_check_expression
from pg_policies
where schemaname = 'public' and tablename = 'content_drafts';

-- 3. Verify public assets bucket exists and is public
select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id = 'assets';

-- 4. Verify storage policies on storage.objects for 'assets' bucket
select
  policyname,
  cmd,
  roles,
  qual as using_expression,
  with_check as with_check_expression
from pg_policies
where schemaname = 'storage' and tablename = 'objects' and policyname ilike '%assets%';

-- 5. Verify no anon permissions to insert/update/delete on content_drafts
select
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'content_drafts'
  and grantee = 'anon';
