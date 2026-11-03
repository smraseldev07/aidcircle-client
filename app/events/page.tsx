"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { todayISO, type EventRecord } from "@/lib/events";

// Same dev backend the Create Event form posts to (not env-driven yet).
const EVENTS_API_URL = "http://localhost:8000/events";

// Green button style shared across this page.
const primaryButtonClass =
  "h-10 rounded-lg bg-[#146240] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]";

// ---------------------------------------------------------------- The page

/**
 * Upcoming Events.
 *
 * 1. Load every event from the backend's /events endpoint.
 * 2. Keep only events happening today or later, soonest first.
 * 3. Render them as a grid of cards.
 *
 * The page shows one of four states: loading, error (with retry),
 * empty (nothing upcoming), or the event grid.
 */
export default function UpcomingEventsPage() {
  // null means "still loading"; [] means "loaded, but nothing upcoming".
  const [events, setEvents] = React.useState<EventRecord[] | null>(null);
  const [error, setError] = React.useState("");

  function loadEvents() {
    fetchUpcomingEvents()
      .then(setEvents)
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load events."
        );
      });
  }

  React.useEffect(() => {
    loadEvents();
  }, []);

  // Start over: back to "loading", then fetch again.
  function retry() {
    setEvents(null);
    setError("");
    loadEvents();
  }

  return (
    <main className="min-h-screen px-10 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-[#0e5738] sm:text-3xl">
          Upcoming Events
        </h1>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Community efforts you can still join — cleanups, plantations,
          donations and more.
        </p>

        {error ? (
          // Something went wrong while fetching.
          <ErrorView message={error} onRetry={retry} />
        ) : events === null ? (
          // request in flight
          <p className="mt-10 text-center text-sm text-slate-500">
            Loading events…
          </p>
        ) : events.length === 0 ? (
          // Loaded fine, but every event is already over (or there are none).
          <EmptyView />
        ) : (
          // Everything went fine: show the cards.
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ------------------------------------------------- Small pieces of the page

/** Message + "Try again" button, shown after a failed fetch. */
function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mt-10 text-center">
      <p role="alert" className="text-sm text-red-600">
        Failed to load events: {message}
      </p>
      <button type="button" onClick={onRetry} className={`${primaryButtonClass} mt-4`}>
        Try again
      </button>
    </div>
  );
}

/** Shown when the list loaded fine but contains no upcoming events. */
function EmptyView() {
  return (
    <div className="mt-10 text-center">
      <p className="text-sm font-semibold text-[#0e5738]">
        No upcoming events yet.
      </p>
      <Link
        href="/create-event"
        className={`mt-4 inline-block leading-10 ${primaryButtonClass}`}
      >
        Create the first one
      </Link>
    </div>
  );
}

/** One card in the grid: thumbnail, type badge, title, where/when, and the
 * View Event button. */
function EventCard({ event }: { event: EventRecord }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail, with the event type badge on top-left of the image. */}
      <div className="relative w-full bg-slate-100">
        {/* thumbnailUrl is a user-entered external URL, so a plain <img> is
            simpler than next/image (which would need remotePatterns config). */}
        {event.thumbnailUrl && (
          <img
            src={event.thumbnailUrl}
            alt={`Thumbnail for ${event.title}`}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-[#1fca82] px-2.5 py-1 text-[11px] font-bold text-white">
          {event.type}
        </span>
      </div>

      {/* The details, and the button pinned to the bottom of the card. */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-base font-bold text-[#20293d]">
          {event.title}
        </h3>

        {event.description && (
          <p className="line-clamp-2 text-sm leading-5 text-slate-500">
            {event.description}
          </p>
        )}

        <p className="flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin className="h-4 w-4 shrink-0 text-[#0e5738]" />
          <span className="truncate">{event.location || "Location TBD"}</span>
        </p>

        {/* e.g. "Nov 19, 2026 · In 3 days" */}
        <p className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#0e5738]" />
          {formatDate(event.date)}
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs font-semibold text-[#1fca82]">
            {relativeDate(event.date)}
          </span>
        </p>

      
        <Link
          href={`/events/${event.id}`}
          className={`${primaryButtonClass} mt-auto flex items-center justify-center`}
        >
          View Event
        </Link>
      </div>
    </article>
  );
}

// ------------------------------------------------------------ Data loading

/** Fetch all events, keep the upcoming ones, return them soonest-first. */
async function fetchUpcomingEvents(): Promise<EventRecord[]> {
  const response = await fetch(EVENTS_API_URL);
  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  // The endpoint returns a bare array; also accept an { events: [...] } wrapper.
  const data = await response.json();
  const rawList: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.events)
      ? data.events
      : [];

  // Step 1: turn every backend record into a proper EventRecord
  // (malformed ones are dropped).
  const records = rawList
    .map(toEventRecord)
    .filter((event): event is EventRecord => event !== null);

  // Step 2: keep today or later. The Create Event form already blocks past
  // dates, but the backend may still hold old records.
  return records
    .filter((event) => event.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Convert one backend record to the shared EventRecord shape.
 * The backend is Mongo-flavored: it uses `_id` instead of `id`, and it only
 * stores the Create Event form fields. Fill in safe defaults for the rest.
 * Returns null when the record has no id, title, or date. */
function toEventRecord(raw: unknown): EventRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, string | undefined>;
  const id = data.id ?? data._id;
  const { title, date, description, type, thumbnailUrl, location, creatorEmail, createdAt } = data;
  if (!id || !title || !date) return null;

  return {
    id: String(id),
    title,
    description: description ?? "",
    type: type ?? "",
    thumbnailUrl: thumbnailUrl ?? "",
    location: location ?? "",
    date: date.slice(0, 10), // just the "YYYY-MM-DD" part
    creatorEmail: creatorEmail ?? "",
    createdAt: createdAt ?? "",
  };
}

// ------------------------------------------------------------ Date helpers

/** "2026-11-19" -> "Nov 19, 2026" (parsed as local time, not UTC). */
function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "2026-11-19" -> "Happening today" | "Tomorrow" | "In 3 days". */
function relativeDate(date: string): string {
  const days = daysFromToday(date);
  if (days === 0) return "Happening today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/** How many days ahead of today the date is (0 = today; negative = past). */
function daysFromToday(date: string): number {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const [y, m, d] = date.split("-").map(Number);
  const [ty, tm, td] = todayISO().split("-").map(Number);
  // Both dates are built as local dates, so the difference is exact.
  return Math.round(
    (new Date(y, m - 1, d).getTime() - new Date(ty, tm - 1, td).getTime()) / DAY_MS
  );
}
