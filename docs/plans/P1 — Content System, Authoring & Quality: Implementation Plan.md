# P1 — Content System, Authoring & Quality: Implementation Plan

> **Reference:** [ROADMAP.md](../../ROADMAP.md#p1--content-system-and-authoring-experience) · [CONTEXT.md](../../CONTEXT.md) · [Phase 0 record](../Phase-0-Foundation-Implementation.md)
> **Scope:** Roadmap items **P1-5 through P1-13**
> **Status:** Complete — fully implemented and verified
> **Prepared:** October 21, 2026
> **Planning baseline:** branch `feature/phase-0`, revision `dea58f3` (`feat: implement content draft workflow, Supabase database types, and validation scripts`)

This document is the pickup plan for the next agent. It turns the two P1 sections in `ROADMAP.md` into reviewable implementation slices, records the current architecture and risks, and defines the order in which the work should be performed.

## 1. Phase 1 outcome

Phase 1 should make the public content system derive its metadata from the committed content model, give the authenticated author a safe preview and recoverable editor workflow, improve search and related-content navigation, and establish the CI/SEO/performance/accessibility guardrails needed for reliable releases.

The completed phase must preserve these architectural boundaries:

- Public writing, snippets, tools, and notes remain file-backed under `content/`.
- Supabase continues to store private drafts/assets only; it does not become a second public content database.
- GitHub remains the publishing boundary for public MDX and committed draft images.
- Server-only filesystem reads, Supabase server clients, Octokit, and `GITHUB_TOKEN` stay out of client bundles.
- Public URLs and current visual ordering remain stable unless a change is intentionally documented and tested.
- Projects remain curated typed/config data and are not coupled to the MDX publication workflow.

### Phase 1 roadmap items

| Item | Roadmap title | Primary result |
| --- | --- | --- |
| P1-5 | Remove duplicated content metadata | Home writing and snippet counts use one documented source of truth. |
| P1-6 | Add draft preview before creating a pull request | Authenticated authors can inspect the same rendered MDX path used publicly before PR creation. |
| P1-7 | Improve the editor and asset workflow | Draft status, recovery, validation, and asset lifecycle are explicit and accessible. |
| P1-8 | Expand content discovery | Search covers writing, snippets, tools, notes, tags, and projects with correct detail URLs. |
| P1-9 | Add related content and taxonomy navigation | Deterministic related items and normalized taxonomy links work across content types. |
| P1-10 | Establish CI and release checks | Pull requests run validation, typecheck, lint, tests, and build with named checks. |
| P1-11 | Improve SEO and content syndication | Canonicals, social metadata, structured data, sitemap, robots, and feeds use public readers. |
| P1-12 | Measure and improve content loading performance | Baselines are recorded before caching/static-rendering changes are made. |
| P1-13 | Complete accessibility and responsive QA | Shared controls and routes pass automated and manual keyboard/theme/responsive checks. |

## 2. Current baseline and constraints

Phase 0 is recorded as complete. The current repository already has content validation, Supabase migrations/types, environment validation, and a hardened save → branch → PR → merge state machine.

Important facts verified during planning:

- `src/lib/mdx.ts` reads MDX synchronously from disk and returns loosely typed `Record<string, unknown>` frontmatter.
- `src/app/page.tsx` renders `recentPosts` from `src/lib/constants.ts`, duplicating writing frontmatter.
- `src/app/snippets/page.tsx` renders editorial counts from `snippetCategories`, while category pages count actual tagged files.
- Snippet tags are not consistently normalized; some current content uses lowercase route tags and at least one file uses title-case tags.
- `src/app/actions.ts` searches writing, snippets, and tools only. Notes and projects are absent, and snippet selections currently open `/snippets/<category>` instead of `/snippets/<category>/<slug>`.
- `getContentBySlug()` does not currently filter `draft: true`; all public detail routes must address this before SEO/feed work can be considered safe.
- Writing and snippet detail pages duplicate the MDX component registry. Notes import the writing registry rather than using a shared module.
- The admin editor currently uses `alert()` for status/error feedback, has no autosave or dirty-state protection, and its Save action performs GitHub work immediately.
- Inline editor images are stored as base64 metadata and committed to `public/assets/`; the separate Supabase Storage manager handles reusable assets but has no delete workflow.
- `package.json` has no `typecheck` script. `npm run build` already runs `validate:content` through `prebuild`.
- `.github/workflows/build.yml` currently installs with `npm ci --ignore-scripts`, runs coverage, and runs SonarQube; it does not expose named `build` or `lint` jobs.
- `.github/rulesets/main-branch-ruleset.json` requires status contexts named `build` and `lint`.
- There are no `sitemap.ts`, `robots.ts`, feed route handlers, browser tests, Playwright setup, or axe integration.
- `src/lib/config.ts` is the canonical origin/identity source (`siteConfig.url`); `siteConfig.ogImage` currently points to `/og-image.png`, which must be verified or replaced.
- `public/site.webmanifest` has empty `name` and `short_name` values.
- `src/components/CodeBlock.tsx` invokes Shiki for every code block and falls back to `text` on unsupported languages; no performance baseline exists.
- Existing automated tests are Vitest/jsdom unit/component tests. The repository has no browser-level route matrix.

### Non-negotiable implementation rules

1. Read the relevant Next.js 16 documentation in `node_modules/next/dist/docs/` before changing route handlers, metadata APIs, caching, static params, or other Next.js behavior.
2. If implementation changes Supabase schema, Storage policies, auth, or data access, reload and follow `.agents/skills/supabase/SKILL.md`; verify the actual remote/local schema before writing migrations.
3. Reuse the Phase 0 validator contracts rather than defining a second incompatible frontmatter schema.
4. Do not mark a roadmap item `Complete` until its acceptance criteria and checks have actually passed. Keep item statuses `Proposed` while this plan is being implemented.
5. Do not edit `.next/`, `coverage/`, `out/`, or Playwright artifacts to make checks pass.
6. Keep private environment values out of plans, logs, fixtures, CI output, and committed files.

## 3. Dependency order and work streams

The recommended order is deliberately staged so later agents do not optimize or build indexes on top of unstable readers:

```text
P1-12 baseline capture
        │
        ├── P1-10 CI/release checks ─────────────┐
        │                                         │
        └── P1-5 normalized content projections ──┼── P1-8 discovery ── P1-9 related/taxonomy
                                                  │
                               P1-6 preview ──────┤
                                      │           │
                               P1-7 editor/assets ┘
                                                  │
                                      P1-11 SEO/syndication
                                                  │
                                      P1-12 measured optimization
                                                  │
                                      P1-13 final QA gate
```

Recommended implementation sequence:

1. **Capture P1-12 baselines first.** Record a clean build duration, representative route timings, repeated content-read observations, and a Shiki-heavy route before changing caching or rendering.
2. **Implement P1-10.** Add named deterministic checks so every later PR is protected by the same baseline.
3. **Implement P1-5.** Create typed normalized projections/helpers for content, tags, snippet categories, and home-page writing.
4. **Implement P1-6 and P1-7 together.** Share one MDX renderer, draft validation path, saved-draft state model, and asset model. They may be separate PRs if the preview boundary is kept stable.
5. **Implement P1-8.** Build typed server-generated search records with explicit `href` values.
6. **Implement P1-9.** Reuse the taxonomy normalization from P1-5/P1-8; defer tag landing pages unless related links prove they are useful.
7. **Implement P1-11.** Add route metadata, sitemap/robots, feeds, and structured data after public readers and draft filtering are stable.
8. **Apply P1-12 optimizations.** Compare against the recorded baseline; do not add persistent caching without a file-change/invalidation decision.
9. **Complete P1-13 as the release gate.** Fix obvious accessibility regressions during earlier work, then run the full route/theme/responsive matrix at the end.

### Suggested PR boundaries

Prefer one focused PR per item, with these two tightly coupled exceptions:

| PR | Scope | Notes |
| --- | --- | --- |
| 0 | Baseline record only | Documentation/script output; no optimization. |
| 1 | P1-10 | CI scripts/workflow/ruleset/docs. |
| 2 | P1-5 | Content projections and source-of-truth fixes. |
| 3 | P1-6 + shared renderer | Preview and MDX registry extraction. |
| 4 | P1-7 | Editor/asset lifecycle and status UX. |
| 5 | P1-8 + P1-9 | Search and related-content helpers share taxonomy code. |
| 6 | P1-11 | Metadata, sitemap, robots, feeds, structured data. |
| 7 | P1-12 | Only measured performance changes. |
| 8 | P1-13 | Accessibility/browser QA and final fixes. |

## 4. P1-5 · Remove duplicated content metadata

**Goal:** A new writing post can appear in the intended home-page list without editing unrelated constants, and snippet landing counts agree with category pages.

### Slice 5A — Establish typed content projections

Likely files:

- `src/lib/mdx.ts`
- New shared module such as `src/lib/content-projections.ts` or `src/lib/content-model.ts`
- `scripts/validate-content.ts` only if a new frontmatter field is added
- Tests under `src/lib/__tests__/` and route-specific `__tests__/`

Work:

1. Define typed projections for writing, snippets, tools, notes, and projects without moving public content out of files.
2. Normalize optional frontmatter fields at the reader boundary (`title`, `description`, `tags`, `date`, `readTime`, `draft`) so UI components do not repeatedly cast unknown values.
3. Add a shared case-insensitive tag/category slug helper. It must turn values such as `React`, `react`, and `React JS` into the intended stable route representation without changing display labels.
4. Make public detail readers reject or return `null` for draft content. Add a separate explicit draft reader for authenticated preview/admin code so draft access is never accidental.

### Slice 5B — Derive home writing

Likely files:

- `src/app/page.tsx`
- `src/lib/constants.ts`
- `src/app/writing/page.tsx`
- `src/app/writing/WritingClient.tsx`

Recommended default: derive the home-page “Recent Writing” cards from `getAllContent("writing")`, sorted by the existing date rule, and take the first three. Preserve the existing display shape expected by `ArticleCard`.

If editorial ordering must differ from date ordering, add a documented optional `homeOrder` frontmatter field or a small explicit featured contract. Do not retain a second copy of title, excerpt, date, read time, and tags in `recentPosts`.

Acceptance checks:

- A fixture/new post changes the home projection without a `constants.ts` edit.
- The first three current posts retain their URL and intentional visual order unless the change is explicitly documented.
- Draft posts never appear on the home page.
- The writing index and home cards use the same normalized values.

### Slice 5C — Derive snippet category counts

Keep `snippetCategories` only as the curated catalog of route slugs, labels, and descriptions if those editorial descriptions are still desired. Derive each `count` from actual validated snippet files using the shared normalized category helper. Do not maintain a hand-entered count.

Decide and document the zero-count behavior before coding:

- Recommended for URL stability: retain the curated category card with `0 snippets` until it is intentionally removed from the catalog.
- Do not invent counts to match the current editorial total of 65.
- Category detail pages and landing cards must call the same helper and return the same files for a given slug.

Acceptance checks:

- A snippet with a normalized category tag increments the landing count and appears on the matching category route.
- Mixed-case current tags do not create duplicate categories or broken routes.
- Projects and `featuredProjects` remain manually curated and are not derived from MDX.

### P1-5 tests and verification

Add unit tests for projection/normalization helpers and route tests for home/snippet counts. Run:

```bash
npm run validate:content
npx vitest run src/lib src/app/writing src/app/snippets
npm run lint
npm run build
```

## 5. P1-10 · Establish CI and release checks

This item should land early, after the P1-12 baseline is captured.

### Slice 10A — Add a typecheck command and align local scripts

Modify `package.json` with:

```json
"typecheck": "tsc --noEmit"
```

Keep the existing `validate:content`, `lint`, `test`, `test:coverage`, and `build` commands. Update `README.md` and `CONTEXT.md` together so the documented commands match the actual scripts.

Run `npm run typecheck` before changing CI. Record any pre-existing failures separately from failures introduced by the CI PR.

### Slice 10B — Replace the single-purpose workflow with named checks

Modify `.github/workflows/build.yml` to use the committed lockfile and a deterministic Node version. Separate jobs are preferred so branch protection and failure diagnosis are clear:

- `validate` — `npm run validate:content`
- `typecheck` — `npm run typecheck`
- `lint` — `npm run lint`
- `test` — `npm test` (optionally retain coverage as a separate non-required job)
- `build` — `npm run build`

Use safe placeholder values only if the public build requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never add `GITHUB_TOKEN`, service-role keys, or production secrets to CI. `npm ci --ignore-scripts` must not prevent required build preparation; verify whether this repository needs install scripts before retaining that flag.

Pin or consistently select the Node version already supported by the project. Keep action versions reviewed and avoid unrelated workflow changes.

### Slice 10C — Align branch protection and docs

Verify `.github/rulesets/main-branch-ruleset.json` required contexts match actual workflow check names. Keep at least `build` and `lint` required because the ruleset currently expects them; consider requiring `typecheck`, `test`, and `validate` only after the repository check names are confirmed.

Acceptance checks:

- A pull request runs all required commands without production secrets.
- Every failure identifies the exact command and job.
- The lockfile is used (`npm ci`).
- README, CONTEXT, package scripts, workflow jobs, and branch-protection contexts agree.

Verification:

```bash
npm ci
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
npm run test:coverage
```

The final CI result must be verified in GitHub; a local run alone does not prove the workflow/check names are correct.

## 6. P1-6 · Add draft preview before creating a pull request

**Goal:** An authenticated author can preview title, metadata, code blocks, images, and custom MDX components through the same rendering path used by public pages, before creating a PR.

### Slice 6A — Extract one public/preview MDX renderer

Likely files:

- New `src/components/mdx/registry.tsx` or `src/lib/mdx-components.tsx`
- `src/app/writing/[slug]/page.tsx`
- `src/app/snippets/[category]/[slug]/page.tsx`
- `src/app/notes/[topic]/[slug]/page.tsx`
- `src/components/CodeBlock.tsx` if the shared renderer needs a typed adapter
- Tests under `src/components/mdx/__tests__/` and affected route tests

Move the duplicated heading, inline-code, paragraph, list, image, code-block, and custom-component registry into one shared module. Preserve current behavior, including `slugify()` heading IDs and the Shiki fallback. Public writing, snippet, notes, and preview pages must all pass the same registry to `MDXRemote`.

Do not import server-only filesystem or GitHub modules into the client editor. The renderer can remain a server component/module; the preview page is the authenticated server boundary.

### Slice 6B — Share validation contracts with the preview path

The Phase 0 validator currently owns the content contract. Refactor the reusable schemas/parsers into a server-safe shared module such as `src/lib/content-contracts.ts`, then make `scripts/validate-content.ts` import that module. Do not make the browser bundle depend on a CLI script.

Add a `validateDraftPayload()` boundary that:

- validates category-specific metadata using the same schemas as committed content;
- validates title/slug/description/tags and required category fields;
- checks note topic/subtopic/order rules;
- parses the MDX body before preview/PR creation;
- returns field-level errors safe to display to the author;
- never includes tokens, private Supabase data, or raw server stack traces in client responses.

### Slice 6C — Choose an authenticated preview source

Recommended design: separate the private Supabase draft save from GitHub branch synchronization.

1. Add an owner-scoped `upsertDraftRecordAction()` that stores the draft payload in `content_drafts` without committing to GitHub.
2. Make Preview save the current editor state to Supabase, then navigate to an authenticated route such as `/admin/[id]/preview`.
3. The preview server page loads only the current user’s draft, validates it, constructs category-specific frontmatter/metadata, and renders the body with the shared MDX registry.
4. Keep GitHub branch sync and PR creation as explicit later actions. If compatibility requires retaining `saveDraftAction()`, make it compose the record upsert plus branch sync, while preview/autosave calls the record-only action.
5. Add a separate authenticated `getDraftPreviewData()` server action/loader rather than exposing draft data through a public route.

This prevents autosave from creating noisy GitHub commits and keeps the preview boundary private. The next agent must inspect the current Supabase migration/types before changing the draft payload shape.

Preview route requirements:

- Every page/action verifies `supabase.auth.getUser()` and owner scope; `src/proxy.ts` is not sufficient authorization.
- Add `robots: { index: false, follow: false }` metadata and, if a route handler is introduced, an `X-Robots-Tag: noindex` response as defense in depth.
- Do not add preview URLs to sitemap, feeds, search data, or public navigation.
- Render all four admin categories. For tools, show metadata and external-link information plus the MDX body if present; do not turn external tool URLs into internal content routes.
- Show validation/MDX failures before PR creation with a retryable path.
- Provide an obvious return-to-editor link and indicate which draft version was previewed.

Acceptance checks:

- Preview and public detail pages render the same custom components and code blocks.
- An unauthenticated request cannot read or render a draft.
- Draft content is not present in public listings, search, sitemap, feeds, or `getContentBySlug()` results.
- Invalid MDX/frontmatter blocks preview/PR progression and reports a useful field-level error.
- Preview works for writing, snippets, tools, and notes.

Verification:

```bash
npx vitest run src/app/admin src/app/writing src/app/snippets src/app/notes src/components/mdx
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
```

Add focused tests for shared component registry identity/behavior, draft filtering, owner-scoped preview access, and invalid draft payloads. Do not claim full preview verification without an authenticated manual smoke test.

## 7. P1-7 · Improve the editor and asset workflow

**Goal:** The author can distinguish local edits, Supabase-saved state, branch sync, PR state, and publication; recover drafts; and manage assets without ambiguous or inaccessible UI.

### Slice 7A — Define the editor state model

Likely files:

- `src/app/admin/components/AdminClient.tsx`
- `src/app/admin/components/EditorWrapper.tsx`
- `src/app/admin/[id]/page.tsx`
- `src/app/admin/actions.ts`
- New `src/lib/editor-state.ts` and tests
- `src/app/admin/components/StatusMessage.tsx` or equivalent shared status component

Use the existing persisted draft state machine as the server state and add client-derived state for `dirty`/`saving`/`saved`/`syncing`/`pr_open`/`published`/`error`. Do not invent a second database status column for transient client state.

Recommended user-visible states:

```text
Local changes → Saving draft → Saved to Supabase
                              └→ Syncing branch → Branch synced
                                                   └→ PR open → Published/Archived
```

Display the state in an `aria-live="polite"` region, not only with `alert()`. Preserve useful correlation/error information returned by server actions without rendering raw exceptions.

### Slice 7B — Autosave and recovery

1. Debounce valid form/editor changes and save to Supabase only; do not commit a GitHub branch for every keystroke.
2. Save a local recovery snapshot (metadata + markdown only) under a draft-specific/local-new key. Never store tokens or private server payloads in local storage.
3. On mount, compare the local snapshot with the server draft and offer an accessible “restore local changes” decision rather than silently overwriting either copy.
4. Add `beforeunload` protection only while there are unsaved changes; do not block navigation after the latest save has completed.
5. On reopening `/admin/[id]`, hydrate all fields, markdown, metadata, and asset references from the persisted draft.
6. Keep explicit Save/Sync/Preview actions available even when autosave is enabled.

Avoid autosaving empty or structurally invalid drafts in a way that makes them impossible to recover. Define the minimum payload that may be saved for a new draft and test it.

### Slice 7C — Asset model and validation

Document three distinct asset classes in code and UI:

1. **Reusable Supabase Storage asset:** public URL, reusable across drafts, not deleted merely because one markdown reference is removed.
2. **Draft-owned GitHub asset:** uploaded through the editor, committed under `public/assets/` when branch sync occurs, removable from the draft’s next branch snapshot.
3. **External image URL:** referenced in markdown, not uploaded or deleted by this app.

Use one shared allowlist and size limit on both client and server. Recommended initial policy: PNG, JPEG, GIF, and WebP; maximum 5 MB; reject unsupported MIME types, empty names, path traversal, and files whose extension disagrees with the detected type where practical. SVG should remain excluded until its sanitization/security policy is explicit.

Apply validation to:

- `AdminClient.handleImageUpload()`;
- `AssetUploader` and `uploadAssetAction()`;
- any GitHub blob creation path in `src/app/admin/actions.ts`.

Do not rely on the HTML `accept` attribute as server validation.

### Slice 7D — Removal and Storage controls

- Add removal controls for inline draft-owned images and remove their markdown references/metadata entries consistently.
- On the next branch sync, ensure removed draft-owned files are not left in the draft branch snapshot. Do not delete reusable Supabase assets as a side effect of removing a markdown reference.
- Add an authenticated Storage delete action/UI for reusable assets only if the actual Storage policy supports the intended ownership model. The current Phase 0 policy is authenticated-user based, not per-user ownership; do not claim per-user deletion isolation without verifying and changing the policy.
- If policy changes are needed, use a new versioned migration and run Supabase security verification/advisors; do not patch the remote dashboard manually without a durable migration.

### Slice 7E — Markdown source editing and accessible drawers

Keep `diffSourcePlugin()` and add a manual test proving the author can switch to source mode, edit markdown, and return to rich text without losing content. Add tests for custom JSX components, code blocks, links, tables, and images.

Convert asset/help drawers into dialog semantics:

- `role="dialog"`, an accessible name, and `aria-modal="true"`;
- Escape closes the drawer;
- focus moves into the drawer and returns to the trigger on close;
- background content is not keyboard reachable while open;
- mobile widths do not overflow horizontally.

Acceptance checks:

- The author can identify whether a change is local, Supabase-saved, branch-synced, in a PR, or published.
- Refreshing/reopening restores metadata and editor content.
- Unsupported/oversized uploads fail before transfer with an accessible message.
- Removing an image updates content and metadata without confusing stale UI.
- Reusable Storage assets and draft-owned GitHub assets are visibly distinguished.

Verification:

```bash
npx vitest run src/app/admin src/components
npm run typecheck
npm run lint
npm test
npm run build
```

Manual smoke test as an authenticated user: edit → wait for autosave → refresh → restore/confirm state → preview → sync branch → create PR. Record any missing credentials/integration as a blocked check, not a pass.

## 8. P1-8 · Expand content discovery

**Goal:** Search is generated server-side from the existing readers/config, includes the required content types/metadata, and always opens the selected item’s intended destination.

### Slice 8A — Define a typed search result contract

Modify `src/app/actions.ts` and add a shared type/helper if useful. Prefer a discriminated union with an explicit `href`:

```ts
type SearchResult =
  | { kind: "writing"; slug: string; title: string; description: string; href: string; tags: string[] }
  | { kind: "snippet"; slug: string; title: string; description: string; href: string; tags: string[]; category: string }
  | { kind: "note"; slug: string; title: string; description: string; href: string; tags: string[]; topic: string; subtopic: string }
  | { kind: "tool"; slug: string; title: string; description: string; href: string; external: true }
  | { kind: "project"; slug: string; title: string; description: string; href: string; tags: string[] };
```

The exact type may differ, but route construction must happen on the server/helper, not be reconstructed ad hoc in `CommandPalette`. Search fields must include title, description, tags, note topic/subtopic, and project name where applicable.

Use the current public readers and constants; do not create a second index/database. Exclude drafts by construction.

### Slice 8B — Correct routes and normalization

- Writing result → `/writing/<slug>`.
- Snippet result → `/snippets/<normalized-category>/<slug>`; use the same category normalization as category pages.
- Note result → `/notes/<topic-slug>/<slug>`; preserve directory slugs and display labels separately.
- Tool result → current external `link` in a new tab/window, clearly marked as external.
- Project result → `/projects` until P2-14 creates project detail routes. Do not invent `/projects/<slug>` in P1.

Make project slugs deterministic in the search result only if needed for React keys; do not modify the project data model as part of P1-8.

### Slice 8C — Loading, empty, and failure states

`CommandPalette` currently swallows search failures. Add explicit state for loading, loaded-empty, and failed fetch, with an accessible live/status message. Keep keyboard navigation, Escape close, focus return, and theme actions working.

Acceptance checks:

- Search includes all required content types and metadata.
- Selecting a snippet opens the selected snippet detail URL, not only its category.
- Mixed-case tags do not create invalid category URLs.
- Drafts, preview routes, and private admin records never enter search data.
- Empty/loading/failed states are understandable without relying on color.

Verification:

```bash
npx vitest run src/app/__tests__/actions.test.ts src/components/__tests__/CommandPalette.test.ts
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
```

## 9. P1-9 · Add related content and taxonomy navigation

**Goal:** Public detail pages offer deterministic related items and normalized taxonomy links without creating low-value duplicate pages.

### Slice 9A — Normalization and related-content helper

Add a focused module such as `src/lib/related-content.ts` (or place the generic normalization in the P1-5 content module). Use typed route-aware records rather than passing raw `Record<string, unknown>` values through scoring.

Recommended deterministic algorithm:

1. Normalize tags case-insensitively and trim whitespace.
2. For notes, include normalized topic and subtopic as relationship signals while preserving their display labels.
3. Score exact shared tags/topics; optionally give a higher score to exact topic/subtopic matches than generic tags.
4. Exclude the current item using a stable content identity (`kind + route key`).
5. Sort by score descending, then date descending where available, then title/slug ascending as a stable tie-breaker.
6. Cap results (recommended 3–5) and return an empty list for missing/malformed metadata.

Do not perform fuzzy/AI recommendations in this phase.

### Slice 9B — Render related content and linked taxonomy

Likely files:

- Writing detail page
- Snippet detail page
- Notes detail page
- `src/components/Tag.tsx` or a new linked-tag component
- `src/components/NotesSidebar.tsx` if topic/subtopic links need to be exposed

Add related sections with semantic headings and useful empty behavior. Render note tags, which are currently not displayed. Keep topic labels from `index.json` distinct from `/notes/<topic>` slugs.

Defer tag landing pages unless the implementation demonstrates a clear navigation benefit and there is a defined canonical URL/content model. If links are added, use an explicit route contract and add them to sitemap only when they are real public pages.

Acceptance checks:

- Related items are deterministic and never include the current item.
- Missing/malformed tags do not throw or render broken links.
- Writing, snippets, and notes can relate across content types where routes exist.
- Topic/subtopic labels remain readable while URLs stay slug-based.

Verification:

```bash
npx vitest run src/lib src/app/writing src/app/snippets src/app/notes
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
```

## 10. P1-11 · Improve SEO and content syndication

**Goal:** Every public content page has correct metadata and canonical identity, and public discovery files are generated from the same readers as the pages.

### Slice 11A — Establish canonical metadata foundations

Likely files:

- `src/app/layout.tsx`
- `src/lib/config.ts`
- New metadata helper such as `src/lib/metadata.ts`
- Writing, snippet, and notes detail pages
- `public/site.webmanifest`

Use `siteConfig.url` as the single canonical origin. Add `metadataBase` at the root and route-level `alternates.canonical` values for public pages. Do not copy a different domain from README or an old deployment.

Verify and resolve the `siteConfig.ogImage` contract before emitting it:

- If `/public/og-image.png` exists and is valid, include it in Open Graph/Twitter metadata.
- If it does not exist, create a real asset in a separate focused change or point metadata to an existing valid asset. Do not emit a broken image URL.

Add `generateMetadata()` to snippet detail pages and enrich writing/notes metadata with canonical URL, Open Graph, Twitter, author, and date fields only when those facts exist in frontmatter/config. Use safe fallbacks for missing optional values.

Before implementing any generated metadata API, read the local Next.js 16 metadata documentation.

### Slice 11B — Prevent draft/indexing leaks

- Ensure public `getContentBySlug()` and every public detail route reject drafts.
- Keep preview/admin metadata `noindex, nofollow`.
- Exclude drafts, preview routes, admin routes, and external tool links from sitemap/feed generation.
- Do not include unpublished future content unless the public reader intentionally treats it as published and that behavior is documented.

### Slice 11C — Add sitemap and robots

New files:

- `src/app/sitemap.ts`
- `src/app/robots.ts`

Generate local URLs from the same public readers used by the pages:

- `/`, `/about`, `/writing`, `/snippets`, `/projects`, `/notes`, `/tools`;
- each public writing detail;
- each valid snippet category/detail;
- each notes topic/detail.

Do not treat `content/tools/*.mdx` external `link` fields as local URLs. Decide whether listing pages with no dynamic detail route belong in the sitemap and document the choice.

Robots should allow public content, disallow `/admin` and preview paths, and point to the canonical sitemap URL.

### Slice 11D — Add feeds and structured data

Recommended new route handlers:

- `src/app/rss.xml/route.ts` (or another documented feed path)
- Optional `src/app/feed.json/route.ts` only if a JSON feed provides clear value

RSS/Atom content must use the public writing reader, exclude drafts, use absolute canonical URLs, escape XML correctly, and include stable dates where available. If only RSS is implemented, document why Atom/JSON is deferred.

Add JSON-LD only for facts supported by source data:

- `Person`/`WebSite` at the site level using `siteConfig`;
- `Article` for writing pages with title, description, canonical URL, author, and date when available;
- `TechArticle` or `Article` for snippets/notes only if the chosen schema accurately represents them.

Do not claim employer, dates, images, ratings, or other facts that are not in the content/config.

Acceptance checks:

- Public detail pages expose stable title, description, canonical, Open Graph, Twitter, and applicable structured data.
- Drafts are absent from sitemap, feeds, search, and public route rendering.
- Sitemap/feed generation uses the same content readers as pages.
- XML/JSON output is valid and links resolve to the configured canonical origin.
- Manifest `name` and `short_name` are populated from `siteConfig` or an explicitly documented product name.

Verification:

```bash
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
npm run start
curl -I http://localhost:3000/sitemap.xml
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/rss.xml
```

Inspect representative rendered HTML for canonical, Open Graph, Twitter, and JSON-LD output. Use a real XML parser or equivalent validation rather than relying only on an HTTP 200.

## 11. P1-12 · Measure and improve content loading performance

**Goal:** Make performance changes from recorded evidence, without serving stale file-backed content unexpectedly during local development or after GitHub publishing.

### Slice 12A — Capture a reproducible baseline before optimization

Add either a small documented script or a durable baseline section in the implementation record. Do not modify caching first.

Record:

- `npm run validate:content` duration;
- clean `npm run build` duration and output;
- response timing for `/`, `/writing`, one writing detail, one notes detail, and one snippet detail;
- repeated-request behavior for those routes;
- a representative route containing multiple code blocks and Shiki fallback language;
- an observation of duplicate filesystem/gray-matter reads during metadata + page rendering.

Suggested local commands:

```bash
time npm run validate:content
time npm run build
npm run start
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total}\n' http://localhost:3000/
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total}\n' http://localhost:3000/writing
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total}\n' http://localhost:3000/writing/react-performance-optimization
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total}\n' http://localhost:3000/notes/system-design/cap-theorem
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total}\n' http://localhost:3000/snippets/react/usedebounce-hook
```

Use the current repository revision and environment description in the baseline. Do not compare a development server timing to a production build timing as if they were equivalent.

### Slice 12B — Apply the smallest evidence-based optimization

Likely files:

- `src/lib/mdx.ts`
- `src/components/CodeBlock.tsx`
- public detail routes with duplicate metadata/page reads
- a benchmark/documentation file if a durable comparison is needed

Candidate order:

1. Use React `cache()` or an equivalent per-render deduplication for identical public reads so `generateMetadata()` and the page do not parse the same file twice in one render.
2. Reduce repeated topic/index scans when the same request needs them, while preserving development freshness.
3. Consider a reusable Shiki highlighter or memoized code-to-HTML path only after measuring code-block cost and verifying unsupported-language fallback.
4. Consider `generateStaticParams` or persistent caching only after checking the local Next.js 16 caching/static-generation docs and the GitHub-publish freshness model.

Do not use a persistent cache for admin drafts/previews unless it has explicit invalidation and owner isolation. File-backed public content changes through merges, so the plan must explain when cached data becomes fresh after a deployment or local edit.

Acceptance checks:

- A baseline and post-change comparison are recorded with the same commands/environment.
- Repeated reads decrease or route/build performance improves without an unacceptable freshness regression.
- Shiki output remains correct for supported languages and falls back safely for unsupported languages.
- Development content changes are visible without restarting more than the documented requirement.
- No private draft content enters a public cache.

Verification:

```bash
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
```

Repeat the baseline timing commands and include the before/after evidence in the implementation record. If the measurements are inconclusive, keep the simpler code and document the result instead of adding speculative caching.

## 12. P1-13 · Complete accessibility and responsive QA

**Goal:** Shared components and representative public/admin routes work with keyboard-only input, visible focus, reduced motion, accessible names/statuses, narrow screens, and all supported themes.

### Slice 13A — Add browser/a11y test infrastructure

The repository currently has no Playwright or axe setup. Choose one approach and document it:

- Recommended: Playwright for route/keyboard/responsive checks plus `@axe-core/playwright` for automated accessibility scans.
- Alternative: keep Vitest for component behavior and add an equivalent browser runner only if it can exercise real Next routes and focus behavior.

If adding packages, pin versions in `package.json` and commit the lockfile. Add scripts such as `test:e2e` and/or `test:a11y`; do not make a command part of CI until it runs deterministically in the repository environment.

Add shared test helpers for starting/using the built app, selecting themes, and asserting no horizontal overflow at the target widths.

### Slice 13B — Fix shared interaction semantics

Likely files:

- `src/app/globals.css`
- `src/components/CommandPalette.tsx`
- `src/components/TableOfContents.tsx`
- `src/components/Navbar.tsx`
- `src/components/NotesSidebar.tsx`
- `src/components/FieldControl.tsx`
- `src/components/mdx/MoreInfo.tsx`
- `src/app/admin/components/AdminClient.tsx`
- `src/app/admin/components/AssetUploader.tsx`

Required fixes to verify:

- Add `@media (prefers-reduced-motion: reduce)` to disable/minimize animations, transitions, and smooth scrolling without hiding content.
- Command palette: loading/error/empty states, accessible dialog/listbox behavior, keyboard navigation, Escape close, focus return, and understandable external-tool actions.
- Table of contents: `aria-modal`/dialog semantics for the mobile panel, Escape close, focus trap or inert background, focus return, and focusable close controls.
- Admin asset/help drawers: same dialog/focus requirements; no horizontal overflow at mobile widths.
- `FieldControl`: associate native labels with controls via stable IDs; provide an accessible label strategy for `react-select`/creatable-select/range fields.
- Error/status announcements: use `role="status"` or `role="alert"` intentionally, with no duplicate noisy announcements.
- `MoreInfo`: associate trigger and tooltip, support keyboard focus/escape, and avoid hover-only access.
- Verify `neo-dark` has complete readable tokens or remove/repair the theme before claiming four-theme support.

### Slice 13C — Route/theme/responsive matrix

Automate what is reliable and manually inspect what depends on authenticated data. At minimum cover:

| Area | Routes/components |
| --- | --- |
| Public shell | `/`, `/about`, navbar, footer, theme control |
| Writing | `/writing`, representative writing detail, filters, list/grid toggle, table of contents |
| Snippets | `/snippets`, category, detail, code block, related content |
| Notes | `/notes`, topic, detail, sidebar, table of contents |
| Other public | `/projects`, `/tools`, command palette |
| Admin | `/admin`, `/admin/new`, `/admin/[id]`, `/admin/assets` with authenticated test data or a documented blocked check |

Test at mobile, tablet, and desktop widths; light, dark, neo-light, and neo-dark themes; keyboard-only navigation; reduced motion; and representative long content/code blocks.

Acceptance checks:

- All named interactive controls have accessible names and visible focus states.
- Menus, command palette, dialogs/drawers, theme controls, table of contents, editor, and forms work without a mouse.
- Content remains readable and usable at mobile widths and with reduced motion enabled.
- Automated scans cover shared regressions and are supplemented by the manual route matrix.
- Accessibility fixes do not regress the existing visual themes or public URLs.

Verification:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npx playwright test
```

Only report the browser command as passed if it has actually run successfully in the current environment. If authentication or a browser binary is unavailable, record the exact blocked setup step.

## 13. Cross-cutting test plan

Use the smallest targeted test during each slice, then run the complete checks for shared readers, routes, content contracts, admin actions, or deployment behavior.

### Unit/integration coverage to add

- Content projections, frontmatter normalization, draft filtering, and snippet category counts.
- Shared MDX registry and unsupported Shiki language fallback.
- Draft validation and authenticated/owner-scoped preview data access.
- Editor state transitions, local recovery merge/restore behavior, asset type/size validation, and removal semantics.
- Typed search records and exact route generation for every content kind.
- Related-content scoring, stable tie-breaking, current-item exclusion, malformed metadata fallback.
- Metadata helpers, sitemap/robots/feed filtering, absolute URL generation, and JSON-LD shape.
- Cache/read deduplication behavior where implementation adds it.
- Keyboard/focus behavior for shared dialogs, command palette, table of contents, and form controls.

### Full repository checks

Run these after each cross-cutting PR and before updating roadmap statuses:

```bash
npm run validate:content
npm run typecheck
npm run lint
npm test
npm run build
```

If CI/browser/SEO work changes scripts or dependencies, also run:

```bash
npm ci
npm run test:coverage
npx playwright test
```

Separate the status of `test`, `lint`, `typecheck`, `build`, content validation, browser/a11y, and manual QA in the implementation record. “Not run” and “blocked” are not passes.

## 14. Files likely to change

This is a planning inventory, not permission to modify every file in one PR.

### Shared/content/public

- `src/lib/mdx.ts`
- `src/lib/constants.ts`
- `src/lib/config.ts`
- New `src/lib/content-contracts.ts`
- New `src/lib/content-projections.ts` / `src/lib/related-content.ts` / metadata helper as needed
- `src/app/page.tsx`
- `src/app/actions.ts`
- `src/app/writing/page.tsx`
- `src/app/writing/WritingClient.tsx`
- `src/app/writing/[slug]/page.tsx`
- `src/app/snippets/page.tsx`
- `src/app/snippets/[category]/page.tsx`
- `src/app/snippets/[category]/[slug]/page.tsx`
- `src/app/notes/[topic]/[slug]/page.tsx`
- `src/components/CommandPalette.tsx`
- `src/components/mdx/`
- `src/components/Tag.tsx`
- `src/components/TableOfContents.tsx`
- `src/components/NotesSidebar.tsx`
- `src/components/CodeBlock.tsx`
- `src/app/layout.tsx`
- New `src/app/sitemap.ts`
- New `src/app/robots.ts`
- New feed route under `src/app/rss.xml/route.ts`
- `public/site.webmanifest`
- `public/og-image.png` or the documented replacement asset

### Admin/Supabase

- `src/app/admin/actions.ts`
- `src/app/admin/components/AdminClient.tsx`
- `src/app/admin/components/EditorWrapper.tsx`
- `src/app/admin/components/AssetUploader.tsx`
- `src/app/admin/components/AssetList.tsx`
- `src/app/admin/components/AssetManager.tsx`
- `src/app/admin/[id]/page.tsx`
- New preview route/component under `src/app/admin/`
- `src/lib/supabase/database.types.ts` if the persisted draft shape changes
- `supabase/migrations/` only if asset ownership or draft persistence requires schema/policy changes
- `supabase/tests/security_verification.sql` if Supabase security contracts change

### Tooling/docs/QA

- `package.json` and lockfile
- `README.md`
- `CONTEXT.md` when route/content/integration/verification architecture changes
- `ROADMAP.md` only when an item starts/finishes or acceptance criteria are revised
- `.github/workflows/build.yml`
- `.github/rulesets/main-branch-ruleset.json`
- New Playwright/axe config and browser tests if selected
- `docs/Phase-1-Content-System-Implementation.md` after implementation, mirroring the Phase 0 record style

## 15. Handoff instructions for the next agent

Start here:

1. Read `AGENTS.md`, `CONTEXT.md`, `ROADMAP.md`, this plan, and the Phase 0 implementation record.
2. Confirm the working tree and branch; do not reset or discard unrelated work.
3. Run the P1-12 baseline commands before changing caching/readers.
4. Implement P1-10 first unless the baseline exposes a blocking build/toolchain issue.
5. For each item, update the plan/implementation record with the actual decision, files changed, targeted tests, full checks, and any blocked manual verification.
6. Use focused conventional commits/PRs; do not bundle unrelated P1 items just to reduce the number of commits.
7. Update `CONTEXT.md` whenever the route map, content model, environment boundary, Supabase workflow, or verification commands change.
8. Mark the corresponding roadmap item `In progress` only when implementation starts, and `Complete` only after the item’s acceptance criteria and checks are verified.

### First concrete action

From the repository root, capture the P1-12 baseline and save it in the eventual Phase 1 implementation record (not in generated output):

```bash
git status --short --branch
time npm run validate:content
time npm run build
npm run start
```

Then measure the representative routes listed in Section 11A and record the revision/date. If `npm run start` cannot run because the production build or required safe public environment values are missing, record the exact error and continue with build/tooling diagnosis; do not invent timings.

### Definition of done for Phase 1

Phase 1 is ready to mark complete only when:

- P1-5 through P1-13 have explicit implementation records and acceptance evidence;
- public content has one documented source of truth and draft filtering is enforced;
- preview/editor/asset behavior is authenticated, recoverable, validated, and accessible;
- search and related navigation use deterministic route-aware records;
- CI checks are reproducible and match branch protection;
- SEO/sitemap/robots/feeds exclude private/draft content;
- performance changes include before/after measurements;
- the accessibility/responsive route matrix has passed or has clearly documented non-code blockers;
- `CONTEXT.md`, `ROADMAP.md`, README scripts, and implementation records agree with the final architecture.
