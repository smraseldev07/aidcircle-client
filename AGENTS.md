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
- Auth (`lib/auth.ts`, `lib/auth-client.ts`) needs `.env` (BETTER_AUTH_SECRET, BETTER_AUTH_URL, MONGODB_URI). Note the `.env` in the repo holds real Atlas credentials — don't commit new secrets.
- The events backend is a separate service at `http://localhost:8000`; without it, `/events` shows its error state and `/events/[id]` renders `notFound()`.

## Backend (separate repo)

- Source is the sibling repo **`E:\projects\aidcircle-server`** — one `index.js`. Client URLs are hardcoded `http://localhost:8000`: `GET /events`, `GET /events/{id}`, `POST /create-event`, `POST /joined`, `GET /manage-event/{email}`, `PATCH /manage-event/{id}`, `DELETE /manage-event/{id}`.
- **No watch mode: restart `node index.js` after every server change** — the running process keeps serving stale code, and a real fix then looks like it didn't work. (Bites repeatedly; check this first when an edit "does nothing".)
- `GET /manage-event/{email}` returns **joined copies** (joined collection, matched on `email`), not events by creatorEmail — the manage page's copy says "organized", the data says "joined".
- `PATCH /manage-event/{id}` updates **both** collections so edits show on `/manage-event`, `/events`, and `/events/[id]`: the joined copy (`_id` stored as **String**) and the original event (`_id` as **ObjectId**). `_id` types differ per collection — a single `new ObjectId(id)` query matches nothing in `joined`; keep both `$set`s in sync when touching this handler.
- `DELETE /manage-event/{id}` deletes **only the joined copy** — the original event stays in `events`, so it keeps showing on `/events` and `/events/[id]` after deletion.

## Routes

- `/` landing, `/events` upcoming-events list, `/events/[id]` event detail, `/create-event`, `/login`, `/signup`, `/manage-event`, `/joined-events`.
- Navbar (`components/navbar.tsx`) links Home and `/events`; signed-out users get a Login link, signed-in users a popover (Create Event, Manage Events, Joined Events, Sign out) driven by `authClient.useSession()`.
- Auth is wired end to end: `/login` and `/signup` call `authClient.signIn/signUp.email`; the server pages `/events/[id]`, `/manage-event`, `/joined-events` gate on `auth.api.getSession({ headers: await headers() })`.
- `/manage-event` fetches `GET /manage-event/{user.email}`. Edit opens `components/EditEvent.tsx` — a create-event-style form prefilled from the card that PATCHes, then closes and `router.refresh()`; its trigger must stay the card's direct flex child (no wrapper `<form>` around it) and the form lives inside `DialogContent`. Delete is `components/DeleteEvent.tsx` — `window.confirm` then DELETEs (removes the joined copy only). `/joined-events` currently fetches `/manage-event` too — a placeholder until the real endpoint exists.

## Structure

- **Navbar and Footer live in `app/layout.tsx`** (global chrome, rendered around every route) — not in `page.tsx`. `app/page.tsx` only composes the landing sections: `Banner`, `WhyOrganize`, `Subscribe` (all in `components/`).
- **Events data layer is `lib/events.ts`**: reads/writes localStorage under `aidcircle:events`; `EventRecord`, `EVENT_TYPES`, `todayISO()`. Business rule: event `date` (`YYYY-MM-DD`, local time) is never in the past. Only `app/create-event/page.tsx` uses `addEvent`/`getEvents` (a local mirror saved after the backend POST) — the `/events` pages read the backend, not localStorage.
- **Two incompatible backend shapes**: `app/events/page.tsx` normalizes `GET /events` (Mongo-style `_id`, create-form fields: `type`, `thumbnailUrl`, `date`) into `EventRecord` via its canonical `toEventRecord` mapper. `app/events/[id]/page.tsx` instead consumes `GET /events/{id}` with a *different* schema (`_id`, `eventType`, `thumbnail`, `eventDate`, `eventTime`, `creatorName/Email/Photo`), typed in `app/events/[id]/event-data.ts`, and no mapper. Don't assume one shape for both — check the page you're touching.
- The detail page is `EventPage` (Suspense wrapper) around an async `EventDetails` server component that fetches with `cache: 'no-store'`; the Join button is the `BookingActions` client component (POSTs to `/joined`).
- `lib/highlighter.tsx` + `hooks/use-highlighted-code.ts` are a vendored shiki setup (unused so far).

## Conventions that differ from defaults

- **UI primitives are Base UI, not Radix.** `components/ui/*` are shadcn in `base-nova` style (`components.json`, `rsc: true`); imports come from `@base-ui/react/*` sub-paths. `npx shadcn add ...` regenerates blocks into `@/components/ui`.
- **Class merging uses the `cn` package**: `import { cn } from "cn"` — not `@/lib/utils` (that file just re-exports it; the vendored components don't use it). Match this when writing new components.
- **Tailwind v4, CSS-first**: no `tailwind.config`; theme tokens live in `app/globals.css` (OKLCH CSS variables, `tw-animate-css`). Note `globals.css` also imports base tokens from `shadcn/tailwind.css` — component design tokens come partly from that package, not only from this file.
- **Caching is default Next semantics**: `next.config.ts` sets `cacheComponents: false` and `partialPrefetching: false`; pages opt out explicitly with `cache: 'no-store'`.
- Path alias `@/*` maps to the **repo root** (`app/`, `components/`, `hooks/`, `lib/`) — there is no `src/` directory.
