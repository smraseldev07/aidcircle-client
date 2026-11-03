<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# aidcircle-client

Next.js 16 app (App Router) with two data sources: a separate dev backend at hardcoded `http://localhost:8000` (events) and better-auth backed by MongoDB Atlas. The shadcn UI kit is vendored under `components/ui`.

## Commands

- `npm run dev` — Turbopack dev server (default bundler; Tailwind runs through `@tailwindcss/turbopack`, configured in `next.config.ts`).
- `npm run lint` — runs bare `eslint`.
- `npm run build` — the only typecheck; there is no `typecheck` script and no test suite or CI.
- Auth and `lib/auth.ts` need `.env` (BETTER_AUTH_SECRET, BETTER_AUTH_URL, MONGODB_URI). Note the `.env` in the repo holds real Atlas credentials — don't commit new secrets.

## Routes

- `/` landing, `/events` upcoming-events list, `/events/[id]` event detail, `/create-event`. The Navbar (`components/navbar.tsx`) links only Home and `/events` — `/create-event` is reachable by URL / the empty-state button only.
- `app/api/auth/[...all]/route.ts` is the better-auth catch-all handler (email+password, `mongodbAdapter`, db `aid-circle`; server config `lib/auth.ts`, client `lib/auth-client.ts`). Not yet used by any page or component.

## Structure

- **Navbar and Footer live in `app/layout.tsx`** (global chrome, rendered around every route) — not in `page.tsx`. `app/page.tsx` only composes the landing sections: `Banner`, `WhyOrganize`, `Subscribe` (all in `components/`).
- **Events data layer is `lib/events.ts`**: reads/writes localStorage under `aidcircle:events`; `EventRecord`, `EVENT_TYPES`, `todayISO()`. Business rule: event `date` (`YYYY-MM-DD`, local time) is never in the past. Only `app/create-event/page.tsx` uses `addEvent`/`getEvents` (a local mirror saved after the backend POST) — the `/events` pages read the backend, not localStorage.
- **Two incompatible backend shapes**: `app/events/page.tsx` normalizes `GET http://localhost:8000/events` (Mongo-style `_id`, create-form fields: `type`, `thumbnailUrl`, `date`) into `EventRecord` via its canonical `toEventRecord` mapper. `app/events/[id]/page.tsx` instead consumes `GET http://localhost:8000/events/{id}` with a *different* schema (`_id`, `eventType`, `thumbnail`, `eventDate`, `eventTime`, `creatorName/Email/Photo`) and no mapper. Don't assume one shape for both — check the page you're touching.
- Both event pages hardcode `http://localhost:8000` (not env-driven). The detail page is an async server component fetching with `cache: 'no-store'`.
- `lib/highlighter.tsx` + `hooks/use-highlighted-code.ts` are a vendored shiki setup (unused so far).

## Conventions that differ from defaults

- **UI primitives are Base UI, not Radix.** `components/ui/*` are shadcn in `base-nova` style (`components.json`, `rsc: true`); imports come from `@base-ui/react/*` sub-paths. `npx shadcn add ...` regenerates blocks into `@/components/ui`.
- **Class merging uses the `cn` package**: `import { cn } from "cn"` — not `@/lib/utils` (that file just re-exports it; the vendored components don't use it). Match this when writing new components.
- **Tailwind v4, CSS-first**: no `tailwind.config`; theme tokens live in `app/globals.css` (OKLCH CSS variables, `tw-animate-css`). Note `globals.css` also imports base tokens from `shadcn/tailwind.css` — component design tokens come partly from that package, not only from this file.
- **`cacheComponents: true`** in `next.config.ts` — data fetching uses Next 16 cache semantics; check `node_modules/next/dist/docs/` before assuming old `fetch`/route caching behavior.
- Path alias `@/*` maps to the **repo root** (`app/`, `components/`, `hooks/`, `lib/`) — there is no `src/` directory.
