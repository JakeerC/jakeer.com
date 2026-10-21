# Phase 0: Foundation & Correctness — Implementation Record

> **Reference:** [ROADMAP.md](../ROADMAP.md#p0--foundation-and-correctness) · [CONTEXT.md](../CONTEXT.md) · [Implementation Plan](plans/P0%20%E2%80%94%20Foundation%20&%20Correctness:%20Implementation%20Plan.md)  
> **Status:** Fully Implemented & Verified  
> **Completed:** October 2026

---

## 1. Executive Summary

Phase 0 establishes the engineering, security, and authoring foundation for **jakeer.com**. Prior to Phase 0, content validation was implicit, publishing operations were susceptible to branch collisions and unverified PR merges, database schema was unversioned, and environment variables relied on unsafe non-null assertions (`!`).

This phase resolved all foundational risks across four key initiatives:
1. **P0-1 · Content Contract Validation:** An automated validator checking frontmatter schemas, duplicate slugs, topic consistency, and image references across all 51 content files.
2. **P0-2 · Supabase & Storage Security Baseline:** Versioned migrations, strict Row-Level Security (RLS) policies scoped to authenticated owners, Storage bucket permissions, and generated TypeScript database types.
3. **P0-3 · Environment Validation & Safe Failure States:** Centralized environment variable validation with safe diagnostics, redacting secrets and ensuring missing admin credentials never crash public routes.
4. **P0-4 · Idempotent & Recoverable Publishing:** Hardened save → branch → PR → merge workflow with deterministic branch naming, formal state machine, idempotent PR handling, frontmatter sanitization, and merge verification before archiving.

---

## 2. Implemented Items

### P0-1: Content Contract Validation

- **Validator Engine:** Implemented in [`scripts/validate-content.ts`](../scripts/validate-content.ts) using **Zod** for strict runtime schema enforcement and `gray-matter` for parsing frontmatter.
- **Schemas Defined:**
  - `WritingFrontmatterSchema`: Requires `title`, `date`, `readTime`, `tags`, `description`. Optional `featured`, `image`, `draft`.
  - `SnippetFrontmatterSchema`: Requires `title`, `date`, `description`, `lang`, `level` (`BEGINNER` | `INTERMEDIATE` | `ADVANCED`), `tags`. Optional `draft`.
  - `ToolFrontmatterSchema`: Requires `name`, `description`, `category`, `link` (URL validation), `icon`. Optional `draft`.
  - `NoteFrontmatterSchema`: Requires `title`, `description`, `readTime`, `topic`, `subtopic`, `order`, `tags`. Optional `draft`.
  - `NoteIndexJsonSchema`: Requires `label`, `description`, `icon`, `color`, `principles` array. Optional `displayOrder`.
- **Cross-File Validations:**
  - Duplicate slug detection within each category.
  - Note topic directory matching (ensures frontmatter `topic` matches parent folder).
  - Validates `index.json` existence and structure in every note topic directory.
  - Snippet category tag validation against known categories (`KNOWN_SNIPPET_CATEGORIES`).
  - Image existence checks: Verifies all markdown `![...](path)` and frontmatter `image` paths exist in `public/` or relative paths.
- **Lifecycle & CI Integration:**
  - Added script `"validate:content": "npx tsx scripts/validate-content.ts"`.
  - Added `"prebuild": "npm run validate:content"` to [`package.json`](../package.json), guaranteeing zero invalid content enters production builds.
- **Tests:** 16 tests in [`scripts/__tests__/validate-content.test.ts`](../scripts/__tests__/validate-content.test.ts) covering happy paths, missing required fields, invalid enums, broken images, and duplicate slugs.

---

### P0-2: Supabase Database & Storage Security Baseline

- **Database Migrations:**
  - [`supabase/migrations/20261012000000_create_content_drafts.sql`](../supabase/migrations/20261012000000_create_content_drafts.sql):
    - Creates table `public.content_drafts` with UUID primary key, foreign key cascade to `auth.users(id)`.
    - Check constraints on `category` (`writing`, `snippets`, `tools`, `notes`) and `status` (`draft`, `branch_created`, `pr_open`, `merged`, `archived`, `failed`).
    - B-tree indexes on `user_id`, `category`, `is_archived`, and `status`.
    - Enables RLS with `(select auth.uid()) = user_id` for `SELECT`, `INSERT`, `UPDATE` (using & with check), and `DELETE` targeting `authenticated` role only.
  - [`supabase/migrations/20261012000001_create_assets_bucket.sql`](../supabase/migrations/20261012000001_create_assets_bucket.sql):
    - Creates public storage bucket `assets`.
    - Enables public `SELECT` for assets delivery.
    - Limits `INSERT`, `UPDATE`, and `DELETE` to authenticated users.
- **TypeScript Types:** Generated and versioned in [`src/lib/supabase/database.types.ts`](../src/lib/supabase/database.types.ts), providing compile-time type safety across all Supabase queries. Added `"gen:types"` script to `package.json`.
- **Security Verification Suite:** [`supabase/tests/security_verification.sql`](../supabase/tests/security_verification.sql) contains SQL queries verifying RLS activation, policy definitions, bucket visibility, and confirming `anon` has zero table access.
- **Client Security:** [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts) only utilizes the public publishable key; service-role keys are strictly avoided.

---

### P0-3: Environment Validation & Safe Failure States

- **Centralized Validation Module:** [`src/lib/env.ts`](../src/lib/env.ts) provides typed accessors:
  - `requireEnv(name)`: Throws a diagnostic error without leaking secret values.
  - `optionalEnv(name)`: Safely returns optional strings.
  - `getSupabaseUrl()`: Direct static property access for client bundler inlining.
  - `getSupabasePublishableKey()`: Direct static property access for client bundler inlining.
  - `getGitHubToken()`: Lazily evaluated server-side accessor.
- **Decoupled Failure Boundaries:**
  - Missing `GITHUB_TOKEN` only blocks admin GitHub publishing actions. Public routes remain fully operational.
  - Removed all non-null assertions (`!`) from [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts), [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts), [`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts), and [`src/app/admin/actions.ts`](../src/app/admin/actions.ts).
- **Error Redaction:** Error messages identify missing variable names but never echo values, headers, or token fragments.
- **Tests:** 11 unit tests in [`src/lib/__tests__/env.test.ts`](../src/lib/__tests__/env.test.ts).

---

### P0-4: Idempotent & Recoverable Publishing

- **Deterministic Branch Naming:**
  - Format: `content/${category}-${slug}-${draftId}`.
  - For new drafts, the draft record is created in Supabase first to obtain the UUID before creating the branch.
  - Eliminates duplicate branch sprawl when repeated saves occur.
- **Draft State Machine:** Implemented in [`src/lib/draft-states.ts`](../src/lib/draft-states.ts) and backed by database check constraints:
  ```text
  draft ───► branch_created ───► pr_open ───► merged ───► archived
    │               │               │
    ▼               ▼               ▼
  failed ◄──────── failed ◄──────── failed
    │
    └───► (retry back to draft / branch_created / pr_open)
  ```
- **Idempotent PR Creation:** In [`createPRForContent`](../src/app/admin/actions.ts), queries existing open PRs matching `${owner}:${branchName}`. If an open PR already exists, it updates the PR title and metadata instead of throwing a collision error.
- **Merge Verification Before Archiving:** In [`mergePRAction`](../src/app/admin/actions.ts), GitHub's squash merge response is confirmed via `octokit.rest.pulls.get()`. If `prAfterMerge.merged !== true`, the draft is marked `failed` and an error is thrown; only confirmed merges transition to `status: "merged"` and `is_archived: true`.
- **Frontmatter Sanitization:** Added [`src/lib/sanitize.ts`](../src/lib/sanitize.ts) with `escapeYamlString()`, escaping quotes, colons, newlines, and special characters to prevent YAML/frontmatter injection.
- **Owner-Scoped Mutations:** Every database update and delete in admin actions pairs `.eq("id", id)` with `.eq("user_id", user.id)` alongside RLS enforcement.
- **`force: true` Documentation:** Rationale documented in [`src/app/admin/actions.ts`](../src/app/admin/actions.ts) confirming draft branches are single-author throwaway branches.
- **Tests:** 37 tests in [`src/app/admin/__tests__/actions.test.ts`](../src/app/admin/__tests__/actions.test.ts), 6 tests in [`src/lib/__tests__/draft-states.test.ts`](../src/lib/__tests__/draft-states.test.ts), and 5 tests in [`src/lib/__tests__/sanitize.test.ts`](../src/lib/__tests__/sanitize.test.ts).

---

## 3. File Inventory

| File Path | Purpose |
| :--- | :--- |
| [`scripts/validate-content.ts`](../scripts/validate-content.ts) | Content contract validator engine (Zod + grey-matter) |
| [`scripts/__tests__/validate-content.test.ts`](../scripts/__tests__/validate-content.test.ts) | Validator unit tests |
| [`src/lib/env.ts`](../src/lib/env.ts) | Centralized environment variable validation |
| [`src/lib/__tests__/env.test.ts`](../src/lib/__tests__/env.test.ts) | Environment validation unit tests |
| [`src/lib/draft-states.ts`](../src/lib/draft-states.ts) | Draft state machine and transition definitions |
| [`src/lib/__tests__/draft-states.test.ts`](../src/lib/__tests__/draft-states.test.ts) | State transition validation unit tests |
| [`src/lib/sanitize.ts`](../src/lib/sanitize.ts) | Frontmatter YAML escaping and sanitization |
| [`src/lib/__tests__/sanitize.test.ts`](../src/lib/__tests__/sanitize.test.ts) | Sanitizer unit tests |
| [`src/lib/supabase/database.types.ts`](../src/lib/supabase/database.types.ts) | Generated database TypeScript definitions |
| [`supabase/migrations/20261012000000_create_content_drafts.sql`](../supabase/migrations/20261012000000_create_content_drafts.sql) | SQL migration: `content_drafts` table, indexes, and RLS |
| [`supabase/migrations/20261012000001_create_assets_bucket.sql`](../supabase/migrations/20261012000001_create_assets_bucket.sql) | SQL migration: `assets` storage bucket and security policies |
| [`supabase/tests/security_verification.sql`](../supabase/tests/security_verification.sql) | SQL queries for verifying database/storage security |
| [`src/app/admin/actions.ts`](../src/app/admin/actions.ts) | Admin publishing actions with hardening & idempotency |
| [`src/app/admin/__tests__/actions.test.ts`](../src/app/admin/__tests__/actions.test.ts) | Admin actions unit tests |
| [`package.json`](../package.json) | Added `validate:content`, `prebuild`, and `gen:types` scripts |
| [`CONTEXT.md`](../CONTEXT.md) | Updated architecture and workflow documentation |
| [`ROADMAP.md`](../ROADMAP.md) | Marked P0 items 1–4 as `Complete` |

---

## 4. Verification & Testing Evidence

1. **Content Validation:**
   ```bash
   $ npm run validate:content
   Found 51 content files:
     • Writing: 6
     • Snippets: 4
     • Tools: 9
     • Notes: 22 (across 10 topics)
   ✅ All content files are valid!
   ```
2. **Vitest Suite:**
   ```bash
   $ npm test
   Test Files  38 passed (38)
   Tests       259 passed (259)
   ```
3. **Production Build:**
   ```bash
   $ npm run build
   > npm run validate:content
   ✅ All content files are valid!
   ▲ Next.js 16.2.10 (Turbopack)
   ✓ Compiled successfully in 6.4s
   ✓ Generating static pages using 7 workers (13/13) in 285ms
   ```

---

## 5. Next Steps (Phase 1 Readiness)

With Phase 0 complete:
- The content contract is locked, enabling **P1-5 (Removing duplicated content metadata)** without risking content breakages.
- The state machine and branch naming are stable, unblocking **P1-6 (Draft preview before pull request)**.
- The build and validation pipeline is reproducible, ready for **P1-10 (GitHub Actions CI workflow)**.
