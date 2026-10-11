# jakeer.com Project Context

This file is the durable architecture and workflow reference for agents working in this repository. It describes the current implementation; update it when a structural or workflow change makes any section inaccurate.

## Project at a glance

- **Purpose:** Personal portfolio, technical writing site, engineering notes, code snippets, external developer tools directory, and a private content-authoring dashboard for Jakeer Chilakala.
- **Framework:** Next.js `16.2.10` App Router with React `19.2.4` and TypeScript in strict mode.
- **Styling:** Tailwind CSS v4, PostCSS, and custom CSS variables in `src/app/globals.css` for the light, dark, and neo themes.
- **Content:** Markdown/MDX files committed under `content/`; public pages read these files directly at build/request time.
- **Admin:** Supabase Auth/Storage plus a `content_drafts` table; GitHub API branches and pull requests are used to publish content.
- **Deployment target:** Vercel is the intended deployment platform. The canonical site URL is configured in `src/lib/config.ts`.
- **Import alias:** `@/*` resolves to `src/*`.

## Source-of-truth map

| Concern | Source of truth | Notes |
| --- | --- | --- |
| Site name, bio, social links, navigation, stats, metadata URL | `src/lib/config.ts` | Update this before changing site-wide identity or navigation. |
| Home page recent posts and featured work | `src/lib/constants.ts` | These are curated display entries, not automatically derived from all content. |
| Full project catalog | `src/lib/constants.ts` and `src/app/projects/page.tsx` | Projects are hardcoded data; there is no project content collection. |
| Writing, snippets, and tools content | `content/writing/`, `content/snippets/`, `content/tools/` | Frontmatter is consumed by `src/lib/mdx.ts` and the relevant route. |
| Notes metadata and ordering | `content/notes/<topic>/index.json` | Each topic needs an `index.json`; notes are grouped by `subtopic` frontmatter. |
| Notes content and order | `content/notes/<topic>/*.mdx` | `order` controls ordering within a subtopic. |
| Shared MDX components | `src/components/mdx/` | Export new components from `src/components/mdx/index.ts` and register them on MDX pages. |
| Theme tokens and global layout styles | `src/app/globals.css`, `tailwind.config.ts` | Prefer existing CSS variables and design tokens over one-off colors. |
| Admin metadata options | `src/lib/constants.ts` | Topic/subtopic options for notes are derived dynamically from `content/notes` in `src/lib/mdx.ts`. |
| Future improvements and feature priorities | `ROADMAP.md` | Use this when planning new work; update it when items start or finish. |

## Route map

### Public routes

- `/` — hero, stats, curated recent writing, featured projects, and section links.
- `/about` — profile/about page.
- `/writing` — file-backed writing index with client-side filtering.
- `/writing/[slug]` — MDX article detail page.
- `/snippets` — static category directory from `snippetCategories` in `src/lib/constants.ts`.
- `/snippets/[category]` — filters actual snippet files by their `tags` frontmatter.
- `/snippets/[category]/[slug]` — MDX snippet detail page.
- `/projects` — project catalog from `projects` in `src/lib/constants.ts`.
- `/notes` — dynamically discovered knowledge bases.
- `/notes/[topic]` — topic overview, principles, subtopics, and notes.
- `/notes/[topic]/[slug]` — individual note detail page.
- `/tools` — dynamically discovered external tools from `content/tools/`.

### Admin routes

- `/admin` — login screen or authenticated draft dashboard.
- `/admin/new` — authenticated two-step content editor.
- `/admin/[id]` — authenticated draft editor.
- `/admin/assets` — authenticated Supabase Storage asset manager.

Admin pages perform their own `supabase.auth.getUser()` checks. `src/proxy.ts` is the Next.js 16 request hook used to refresh Supabase cookies; it is not the authorization boundary by itself.

## Architecture and data flow

### Public content

1. Server components call functions in `src/lib/mdx.ts`.
2. `src/lib/mdx.ts` reads from `path.join(process.cwd(), "content")` using `fs` and `gray-matter`.
3. Draft files with `draft: true` are filtered from collection listings.
4. Writing and snippets are sorted by `date`; notes are sorted by `order`, then title.
5. Detail pages render MDX through `next-mdx-remote/rsc`.
6. Fenced code blocks use Shiki through `src/components/CodeBlock.tsx`; custom components include `Callout`, `SparkyText`, `MoreInfo`, `SwirlyUnderline`, and `HighlightText`.

### Notes knowledge base

`getAllKnowledgeBases()` discovers directories under `content/notes/`. Each topic directory is expected to contain:

```text
content/notes/<topic>/
├── index.json       # label, description, icon, color, principles, displayOrder
└── <note>.mdx       # title, description, subtopic, order, tags, optional readTime/date
```

The current topic slugs are `java`, `javascript`, `typescript`, `react`, `ai-ml`, `mcp`, `ci-cd`, `system-design`, `docker-k8s`, and `aws`. Adding a topic normally means adding its directory, `index.json`, and MDX files; the notes UI and admin topic selector discover them dynamically.

### Search and navigation

The client-side command palette in `src/components/CommandPalette.tsx` calls the server action `getSearchData()` in `src/app/actions.ts`. Search data is assembled from writing, snippets, and tools MDX frontmatter. There is no separate search index or database.

### Admin publishing workflow

The normal content workflow is:

1. Authenticate through Supabase on `/admin`.
2. Save a draft. `saveDraftAction()` writes the draft to Supabase and creates/updates a GitHub branch named `content/<category>-<slug>-<timestamp>`.
3. The branch contains the generated MDX under the appropriate `content/` path and any editor-uploaded images under `public/assets/`.
4. Create a pull request with `createPRForContent()`.
5. Publish by squash-merging the PR with `mergePRAction()`, then archive the draft.

The GitHub repository is currently hardcoded in `src/app/admin/actions.ts` as owner `JakeerC` and repo `jakeer.com`. Do not silently change this when modifying the workflow.

The admin database/storage contract currently assumes:

- Supabase table: `content_drafts`.
- Supabase Storage bucket: `assets`.
- Authenticated users are required for every admin server action.
- Missing `content_drafts` or `assets` resources are handled as empty/unavailable in several dashboard paths.
- This repository does not contain a `supabase/` migrations directory, so database schema changes need to be checked against the connected Supabase project before implementation.

## Content authoring contract

Keep frontmatter compatible with the existing readers and admin writer.

### Writing (`content/writing/*.mdx`)

Common fields: `title`, `date`, `readTime`, `tags`, `description`, optional `featured`, and optional `image`.

### Snippets (`content/snippets/*.mdx`)

Common fields: `title`, `date`, `description`, `lang`, `level`, and `tags`. The category route is derived from a tag, so tags need to match the route value (current files use lower-case values such as `java`, `react`, or `typescript`). The landing page category labels/counts are maintained separately in `snippetCategories`.

### Tools (`content/tools/*.mdx`)

Common fields: `name`, `description`, `category`, `link`, and optional `icon`. Tools are external links; there is currently no `/tools/[slug]` detail route.

### Notes (`content/notes/<topic>/*.mdx`)

Common fields: `title`, `description`, `readTime`, `topic`, `subtopic`, `order`, and `tags`. The directory/topic slug is used for routing; `index.json` supplies display metadata and principles.

All MDX content may use the registered custom components. Preserve valid MDX and frontmatter delimiters when editing generated content.

## Environment and integration boundaries

The application references these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` — browser/server Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable Supabase key used by browser, server, and request-hook clients.
- `GITHUB_TOKEN` — server-only token used by admin actions for branches, commits, pull requests, and asset blobs.

`.env*` files are ignored by Git. Never print, commit, or expose their values. A `NEXT_PUBLIC_` variable is browser-visible; do not put secrets in one. For any Supabase-related implementation, read `.agents/skills/supabase/SKILL.md` first and follow its current documentation/security workflow.

## Development and verification

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

Use a targeted Vitest test while iterating, then run the full suite for cross-cutting changes. Tests live beside the relevant source area under `__tests__/`, with additional unit tests in `src/lib/` and `src/components/`.

Before changing Next.js behavior, read the relevant versioned guidance in `node_modules/next/dist/docs/` as required by `AGENTS.md`. This codebase uses Next.js 16 conventions, including promise-based route `params` and `src/proxy.ts`; do not replace these patterns with older `middleware.ts` or synchronous-params examples without checking the local docs.

## Working conventions and known traps

- Prefer server components for file reads and data loading. Add `"use client"` only for browser interactivity, state, event handlers, or client-only libraries.
- Use the `@/` alias for imports from `src/` and preserve strict TypeScript types.
- Keep public content file-backed. Do not move writing, snippets, tools, or notes into Supabase unless the task explicitly changes the content architecture.
- `src/lib/constants.ts` contains intentionally curated and partly duplicated data (`recentPosts`, `projects`, `featuredProjects`, snippet categories, and admin options). Check all consumers before editing a constant.
- The snippet landing-page counts are editorial values and may not equal the number of files currently present. The category/detail routes use actual MDX tags.
- Projects have no MDX collection; change the constants when changing project copy, tags, links, or features.
- Global theme behavior is shared through `ThemeProvider`, `Navbar`, and CSS variables. Test both light/dark behavior for visual changes.
- Keep server-only integrations (`GITHUB_TOKEN`, server Supabase clients, Octokit, filesystem reads) out of client components.
- Do not read or modify generated artifacts such as `coverage/`, `.next/`, `out/`, or Playwright captures as part of normal feature work.

## Planning future work

Use [`ROADMAP.md`](./ROADMAP.md) for prioritized improvements and feature ideas. If a change affects the route structure, content model, integrations, environment variables, or verification workflow, update this context file together with the implementation.
