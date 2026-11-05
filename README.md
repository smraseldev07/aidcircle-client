# AidCircle Client

AidCircle is a community volunteering platform: anyone can **create community
events** (cleanups, plantations, donations, blood drives, food distribution,
awareness campaigns), browse **upcoming events**, and **join** them by
registering their email with the organizer. Event creators get a **Manage**
dashboard to edit or remove their events, and a **Joined Events** page for
everything they signed up for.

This repository is the Next.js frontend. It talks to a separate Express +
MongoDB backend (see [Running the backend](#running-the-backend-backend-repo)),
and uses [better-auth](https://www.better-auth.com) with MongoDB Atlas for
accounts.

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript, Turbopack dev server)
- **Tailwind CSS v4** (CSS-first config in `app/globals.css`, OKLCH tokens)
- **shadcn-style UI kit** in `components/ui` — vendored, built on
  **Base UI** (`@base-ui/react`) instead of Radix (style: `base-nova`)
- **better-auth** (`mongodb` adapter + `jwt()` plugin) with **MongoDB Atlas**
- Class merging via the small **`cn`** package (`import { cn } from "cn"`)

## Features

- **Landing page** (`/`) — banner, why-organize, and subscribe sections
- **Upcoming events** (`/events`) — grid of cards, past events filtered out,
  error/empty/retry states
- **Event detail** (`/events/[id]`) — full event page with organizer profile
  and a **Join Event** action that POSTs to `/joined`
- **Create event** (`/create-event`) — form with past-date validation; the
  created event is mirrored in localStorage
- **Manage events** (`/manage-event`) — edit (dialog form) and delete (with
  confirm) the events you organize
- **Joined events** (`/joined-events`) — list of events you joined
- **Auth** — email/password sign-up and sign-in (`/signup`, `/login`),
  session-aware navbar with an account popover
- **Dark / light mode** — toggle in the navbar; choice persisted in
  localStorage (`aidcircle:theme`) and applied before hydration (no flash)

## Project structure

```
app/
  layout.tsx            # global chrome (Navbar, Footer) + theme pre-hydration script
  page.tsx              # landing page sections
  events/               # upcoming list + [id]/ detail page & join actions
  create-event/         # event creation form
  manage-event/         # organizer dashboard (EditEvent, DeleteEvent)
  joined-events/        # joined events list
  login/, signup/       # auth pages
  api/auth/[...all]/    # better-auth route handler
proxy.ts                # Next 16 middleware equivalent — redirects signed-out users to /login
components/
  navbar.tsx, footer.tsx, banner.tsx, why-organize.tsx, subscribe.tsx
  theme-toggle.tsx      # dark/light mode toggle
  EditEvent.tsx, DeleteEvent.tsx
  ui/                   # vendored shadcn base-nova primitives (Base UI)
lib/
  auth.ts               # better-auth server config (MongoDB adapter + jwt plugin)
  auth-client.ts        # better-auth client
  events.ts             # localStorage event mirror (aidcircle:events), types, helpers
hooks/                  # small hooks
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas database (connection string)
- The AidCircle backend running locally (see below)

### 1. Configure environment

Create `.env` in the project root:

```env
BETTER_AUTH_SECRET=<random string>
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=<your Atlas connection string>
```

### 2. Run the frontend

```bash
npm install
npm run dev        # → http://localhost:3000
```

### Running the backend (`aidcircle-server` repo)

The backend is a **separate repository** — an Express app (`index.js`) that
serves the events API from MongoDB (`aid-circle` database):

```bash
node index.js      # → http://localhost:8000  (no watch mode — restart after changes)
```

Port matters: the backend verifies the JWTs it receives against better-auth's
JWKS URL **hardcoded to `http://localhost:3000/api/auth/jwks`**, so the
frontend must run on port 3000 and both servers must run at the same time for
create/view events to work.

### 3. Build / lint

```bash
npm run lint       # eslint (there is no separate typecheck script)
npm run build      # full production build; also the project's typecheck
```

## Where the data lives

- **Backend (MongoDB)** — the source of truth for events and joined records.
- **localStorage** (`aidcircle:events`) — a client-side mirror of events
  created through `/create-event`; the events pages themselves read the
  backend, not localStorage.

## Auth flow (frontend → backend)

1. Sign in/up with better-auth (session cookie).
2. When submitting or viewing protected backend endpoints, a short-lived JWT
   is obtained (`authClient.token()` on the client, `auth.api.getToken()` on
   the server) and sent as `Authorization: Bearer <token>`.
3. The backend verifies the token against better-auth's JWKS endpoint.

`proxy.ts` (Next 16's middleware equivalent) also redirects signed-out users
to `/login` for `/create-event`, `/joined-events` and `/events/*`.

## Current limitations

- All frontend→backend URLs are hardcoded to `http://localhost:8000`
  (no env-driven API base yet).
- `/joined-events` currently reuses the manage endpoint as a placeholder.
- Deleting a managed event only removes the joined copy on the backend, so the
  original event still shows up on `/events`.
- The backend has no watch mode — restart `node index.js` after backend edits.
- No test suite or CI; `npm run build` is the de-facto typecheck.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [better-auth documentation](https://www.better-auth.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
