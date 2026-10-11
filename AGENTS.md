<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project-specific instructions

Read [`CONTEXT.md`](./CONTEXT.md) before making changes. It is the project map for the route structure, MDX content model, Supabase/GitHub publishing workflow, environment boundaries, and verification commands. Read [`ROADMAP.md`](./ROADMAP.md) when planning future improvements or feature work.

## Before coding

- Treat `src/app/` as the App Router entry point and keep the Next.js 16 conventions already used in the repository, including promise-based route `params` and `src/proxy.ts`.
- Read the relevant versioned documentation in `node_modules/next/dist/docs/` before changing Next.js APIs, routing, caching, or configuration.
- Preserve the server/client boundary. File-backed MDX reads, Supabase server clients, Octokit, and `GITHUB_TOKEN` belong on the server; interactive UI belongs in explicitly marked client components.
- Use `@/` imports, strict TypeScript, the existing Tailwind/CSS-variable theme system, and the established component patterns.

## Content and integrations

- Public writing, snippets, tools, and notes are file-backed under `content/`; use the frontmatter contracts in `CONTEXT.md` instead of inventing a parallel data source.
- Projects, home-page curation, navigation, and several admin option lists are maintained in `src/lib/config.ts` and `src/lib/constants.ts`.
- For any task involving Supabase, read [`.agents/skills/supabase/SKILL.md`](./.agents/skills/supabase/SKILL.md) before implementing or reviewing changes. Never expose secrets from `.env.local` or commit environment values.
- Admin publishing crosses Supabase and GitHub: inspect the complete save → branch/commit → PR → merge flow before modifying one step.
- When implementing roadmap work, update the item status and update `CONTEXT.md` if the architecture or workflow changes.

## Verification

- Prefer targeted Vitest tests during iteration, then run `npm run lint`, `npm test`, and `npm run build` for changes that affect shared code, routes, content loading, or deployment behavior.
- Do not edit generated output in `coverage/`, `.next/`, `out/`, or Playwright artifacts as a substitute for changing source files.
