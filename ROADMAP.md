# jakeer.com Roadmap

This roadmap records practical improvements and future features for the portfolio, knowledge base, developer tools, and private publishing dashboard. It is intentionally outcome-oriented so an agent can turn an item into an implementation plan without rediscovering the architecture.

Update the status and acceptance criteria when work is started or completed. Keep architectural details in [`CONTEXT.md`](./CONTEXT.md), and keep this file focused on future work.

## Priority and status

- **P0 — Foundation:** security, correctness, reliability, or work that unblocks several other improvements.
- **P1 — High value:** directly improves authoring, discovery, performance, or maintainability.
- **P2 — Product improvements:** meaningful user-facing features after the foundation is stable.
- **P3 — Exploration:** optional ideas that should be validated before committing to implementation.

Statuses used below: `Proposed`, `In progress`, `Complete`, and `Deferred`.

## Recommended sequence

1. Establish automated content validation and a documented Supabase schema/security baseline.
2. Make the admin save → branch → PR → merge workflow resilient and observable.
3. Remove duplicated content metadata and improve content discovery.
4. Add CI, SEO, accessibility, performance, and deployment guardrails.
5. Expand the portfolio into richer project case studies and useful developer tools.

---

## P0 — Foundation and correctness

### 1. Add content contract validation

**Status:** Complete  
**Scope:** `content/`, `src/lib/mdx.ts`, `scripts/`, package scripts

Create a validation command for all MDX and notes metadata. It should validate frontmatter fields and types, duplicate slugs, valid note topics, `index.json` shape, note ordering, snippet category tags, tool URLs, and references to local images.

**Acceptance criteria**

- A command such as `npm run validate:content` reports every invalid file and field.
- Current content passes validation without warnings that are silently ignored.
- `npm run build` or CI runs the validator before building.
- The validator remains independent from the browser and does not expose private environment values.

**Implementation notes**

- Keep the existing file-backed MDX architecture.
- Prefer a small typed validation module over duplicating frontmatter parsing in each route.
- Decide explicitly whether drafts are validated but excluded from public listings.

### 2. Formalize the Supabase database and Storage security baseline

**Status:** Complete  
**Scope:** Supabase project, admin actions, generated database types

Document and version the `content_drafts` table and `assets` Storage bucket contract. Add the appropriate migrations or declarative schema, RLS policies, Storage policies, indexes, and generated TypeScript types.

**Acceptance criteria**

- A fresh or documented Supabase project can reproduce the required table, bucket, policies, and indexes.
- Every admin data operation is scoped to the authenticated user or an explicitly documented owner model.
- Storage upload, replacement, listing, and public URL behavior are covered by policies and tests/verification queries.
- No service-role or secret key is used in browser code.
- The workflow follows `.agents/skills/supabase/SKILL.md`, including advisor/security verification.

**Dependency:** Confirm the intended Supabase project and current remote schema before writing migrations.

### 3. Add environment validation and safe failure states

**Status:** Complete  
**Scope:** Supabase clients, admin actions, application startup/build

Replace non-null environment assertions with clear validation at the server boundary. Make missing integrations produce actionable admin errors while keeping public pages usable when the admin integration is unavailable.

**Acceptance criteria**

- Missing `NEXT_PUBLIC_SUPABASE_URL` or publishable key has a clear diagnostic.
- Missing `GITHUB_TOKEN` blocks only GitHub-backed admin actions and does not break public routes.
- Secrets are never included in thrown errors, logs, client props, or rendered HTML.
- Local setup documentation lists variable names and safe example placeholders only.

### 4. Make publishing operations idempotent and recoverable

**Status:** Complete  
**Scope:** `src/app/admin/actions.ts`, admin client components, Supabase draft state

Harden the current save → branch/commit → PR → merge workflow against retries, duplicate submissions, stale PRs, partial failures, and branch collisions.

**Acceptance criteria**

- Repeated Save requests update the same draft branch rather than creating unintended duplicate branches.
- A failed GitHub operation does not leave a draft marked as successfully published.
- PR creation is idempotent or detects an existing open PR for the draft.
- Merge results are checked before archiving the draft.
- GitHub and Supabase failures are shown with a recoverable action and useful server-side correlation information.
- Destructive actions remain authenticated and protected against acting on another user’s draft.

**Implementation notes**

- Review the use of `force: true` when updating refs.
- Escape title, description, tags, and other metadata before generating frontmatter.
- Consider explicit draft states such as `draft`, `branch_created`, `pr_open`, `merged`, `archived`, and `failed`.

---

## P1 — Content system and authoring experience

### 5. Remove duplicated content metadata

**Status:** Complete  
**Scope:** `src/lib/constants.ts`, home page, snippets, writing index

Reduce drift between committed MDX and manually maintained values. The home page’s recent writing should be derived from writing frontmatter or use a small explicit `featured`/`homeOrder` contract. Snippet category counts should be derived from actual files, or clearly become editorial overrides.

**Acceptance criteria**

- A newly published writing post can appear in the intended home-page list without editing multiple unrelated arrays.
- Snippet counts and category pages have one documented source of truth.
- Projects remain easy to curate and are not accidentally coupled to content publication.
- Existing URLs and visual ordering are preserved unless intentionally changed.

### 6. Add draft preview before creating a pull request

**Status:** Complete  
**Scope:** admin editor, MDX rendering, preview route/component

Allow authenticated authors to preview the exact rendered title, metadata, code blocks, images, and custom MDX components before opening a PR.

**Acceptance criteria**

- Preview uses the same MDX component registry and code rendering path as public pages.
- Preview content is never written to public content or indexed by search engines.
- Invalid MDX/frontmatter is reported before PR creation.
- Preview supports all four admin categories: writing, snippets, tools, and notes.

### 7. Improve the editor and asset workflow

**Status:** Complete  
**Scope:** `src/app/admin/components/`, Supabase Storage, GitHub asset commits

Add autosave status, unsaved-change protection, image size/type validation, asset removal, markdown source editing, and a clear distinction between reusable Storage assets and assets committed with a draft.

**Acceptance criteria**

- The author can tell whether content is saved locally, saved to Supabase, committed to GitHub, or included in a PR.
- Large/unsupported uploads are rejected before transfer with an accessible error.
- Removing an image removes its reference from content and does not leave confusing orphaned UI state.
- Refreshing or reopening a draft restores all metadata and editor content.

### 8. Expand content discovery

**Status:** Complete  
**Scope:** command palette, writing, notes, snippets, tools

Make search and navigation cover notes, projects, tags, and direct detail URLs. Fix snippet search results so they open the selected snippet rather than only its category.

**Acceptance criteria**

- Search includes title, description, tags, note topic/subtopic, and project name where applicable.
- Selecting a snippet opens `/snippets/<category>/<slug>`.
- Empty, loading, and failed search states are accessible and understandable.
- Search data remains generated server-side and does not require a second content database.

### 9. Add related content and taxonomy navigation

**Status:** Complete  
**Scope:** MDX metadata, detail pages, notes sidebar, tags

Add related writing, snippets, and notes based on explicit tags/topics. Provide tag landing pages only if they improve navigation without creating duplicate or low-value pages.

**Acceptance criteria**

- Related items are deterministic and exclude the current item.
- Missing or malformed tags degrade gracefully.
- Topic and subtopic labels remain distinct from URL slugs.
- The feature does not require migrating public content into Supabase.

---

## P1 — Quality, performance, and discoverability

### 10. Establish CI and release checks

**Status:** Complete  
**Scope:** `.github/workflows/`, package scripts, repository protection

Add a GitHub Actions workflow for install, type checking, linting, content validation, tests, and production build. Configure branch protection so content and code changes receive the same baseline checks.

**Acceptance criteria**

- Pull requests run deterministic checks using the committed lockfile.
- CI uses the minimum safe environment placeholders and does not require production secrets for public build checks.
- Failures identify the exact command and artifact needed for debugging.
- The README and `CONTEXT.md` list the same verification commands as CI.

### 11. Improve SEO and content syndication

**Status:** Complete  
**Scope:** metadata, route handlers, public content

Add sitemap generation, robots policy, canonical URLs, Open Graph images, structured data, RSS/Atom feeds for writing, and optionally JSON feeds for snippets/notes.

**Acceptance criteria**

- Every public content detail page has stable title, description, canonical URL, and social preview metadata.
- Draft content is excluded from sitemap and feeds.
- Sitemap/feed generation uses the same content readers as the pages.
- Structured data is valid and does not claim facts that are absent from the content.

### 12. Measure and improve content loading performance

**Status:** Complete  
**Scope:** `src/lib/mdx.ts`, route rendering, Shiki, Next.js caching

Profile MDX parsing, filesystem reads, Shiki highlighting, and route generation before selecting caching or static generation changes.

**Acceptance criteria**

- A baseline for build time and representative route response/render time is recorded.
- Repeated content reads are reduced without serving stale content unexpectedly during development or publishing.
- Code highlighting remains correct for supported and unsupported languages.
- Any Next.js caching API change is checked against the local Next.js 16 documentation first.

### 13. Complete accessibility and responsive QA

**Status:** Complete  
**Scope:** shared components, public routes, admin UI, themes

Audit keyboard navigation, focus management, color contrast, reduced motion, headings, landmarks, form labels, error announcements, mobile layouts, and both classic/neo themes.

**Acceptance criteria**

- Command palette, menus, editor drawers, dialogs, and theme controls work without a mouse.
- Interactive controls have accessible names and visible focus states.
- Content remains readable at mobile widths and with reduced motion enabled.
- Automated checks cover shared regressions, supplemented by a manual route matrix.

---

## P2 — Portfolio and product features

### 14. Convert projects into case studies

**Status:** Proposed  
**Scope:** projects data model, project routes, MDX or typed content

Give each project a detail page with problem, constraints, architecture, decisions, outcomes, screenshots, links, and technology breakdowns. Start with the existing projects in `src/lib/constants.ts`.

**Acceptance criteria**

- Project summaries and detail pages share one source of truth.
- Empty GitHub/demo links are not rendered as broken actions.
- Sensitive employer or production details are reviewed before publication.
- Project pages have useful metadata and related writing/notes where available.

### 15. Turn selected tools into first-party utilities

**Status:** Proposed  
**Scope:** `content/tools/`, `src/app/tools/`, client tool components

Prioritize small, privacy-friendly tools that can run locally in the browser, such as JSON formatting, Base64 encoding, URL encoding, JWT inspection, regex testing, and diff checking.

**Acceptance criteria**

- Tool inputs are processed locally unless an external service is explicitly required.
- Tool pages have clear input/output states, copy/download actions, reset controls, and error messages.
- No user input is logged or sent to third parties without explicit disclosure.
- Tool metadata and implementation routes are connected without breaking existing external links.

### 16. Add richer note navigation

**Status:** Proposed  
**Scope:** notes knowledge base, content metadata, sidebar

Add previous/next navigation, recently updated notes, difficulty/reading-time filters, and optional cross-topic links. Consider a lightweight graph view only after basic navigation is useful.

**Acceptance criteria**

- Navigation follows the configured topic and note order.
- Links to missing notes are detected by content validation.
- The sidebar remains usable on small screens.
- The information architecture remains understandable without JavaScript.

### 17. Add an optional newsletter/contact workflow

**Status:** Proposed  

Validate the desired audience and provider before adding a subscription or contact form. Keep the existing mailto CTA functional as a fallback.

**Acceptance criteria**

- The chosen provider and data retention behavior are documented.
- Form validation, spam mitigation, success, and failure states are accessible.
- No personal data is stored without a clear purpose and documented policy.
- The feature can be disabled without affecting the rest of the site.

---

## P3 — Exploration and optional improvements

These ideas should be evaluated after P0/P1 work and a clear user benefit is established:

- Reading progress and estimated completion time for long articles.
- Favorites/bookmarks stored locally in the browser.
- A changelog or “now” page for personal updates.
- Content analytics based on privacy-preserving aggregate metrics.
- Internationalization if there is a real audience need.
- Offline/PWA support for notes and snippets.
- A visual architecture diagram library for selected system-design notes.
- Automated link checking and stale-content reminders.

## Roadmap maintenance rules

- Prefer one focused pull request per roadmap item or tightly coupled slice.
- Before implementation, inspect the current code and update the item’s scope if the architecture has changed.
- For Supabase work, follow the repository skill and verify the remote schema/security state before changing data access.
- Add or update meaningful tests for behavior changes; do not test a roadmap document itself.
- When an item changes routes, content contracts, integrations, or commands, update `CONTEXT.md` in the same change.
- Mark items `Complete` only after implementation and verification are finished. Move abandoned ideas to `Deferred` with a short reason.
