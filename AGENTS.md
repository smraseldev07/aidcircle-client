<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# aidcircle-client

Frontend-only Next.js 16 app (App Router) bootstrapped from create-next-app; the full shadcn UI kit is vendored under `components/ui`. The app is a single landing page: `app/page.tsx` composes section components in `components/` (`navbar`, `banner`, `why-organize`, `subscribe`, `footer`) — most feature work means editing those section files, not adding routes.

## Commands

- `npm run dev` — Turbopack dev server (default bundler; Tailwind runs through `@tailwindcss/turbopack`, configured in `next.config.ts`).
- `npm run lint` — runs bare `eslint`.
- `npm run build` — the only typecheck; there is no `typecheck` script and no test suite or CI.

## Conventions that differ from defaults

- **UI primitives are Base UI, not Radix.** `components/ui/*` are shadcn in `base-nova` style (`components.json`, `rsc: true`); imports come from `@base-ui/react/*` sub-paths. `npx shadcn add ...` regenerates blocks into `@/components/ui`.
- **Class merging uses the `cn` package**: `import { cn } from "cn"` — not `@/lib/utils` (that file exists but the vendored components don't use it). Match this when writing new components.
- **Tailwind v4, CSS-first**: no `tailwind.config`; theme tokens live in `app/globals.css` (OKLCH CSS variables, `tw-animate-css`). Note `globals.css` also imports base tokens from `shadcn/tailwind.css` — component design tokens come partly from that package, not only from this file.
- **`cacheComponents: true`** in `next.config.ts` — data fetching uses Next 16 cache semantics; check `node_modules/next/dist/docs/` before assuming old `fetch`/route caching behavior.
- Path alias `@/*` maps to the **repo root** (`app/`, `components/`, `hooks/`, `lib/`, `lib/highlighter.tsx` for shiki code blocks) — there is no `src/` directory.
