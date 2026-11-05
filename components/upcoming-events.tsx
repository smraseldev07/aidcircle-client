import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

import { todayISO, type EventRecord } from "@/lib/events";

// Same dev backend the rest of the pages read from (not env-driven yet).
const EVENTS_API_URL = "http://localhost:8000/events";

/**
 * "Recent upcoming events" teaser shown on the homepage: the next six
 * events (today or later) sorted soonest first. Reads GET /events with
 * the same tolerant normalization as /manage-event, so it survives both
 * backend field shapes (type|eventType, thumbnailUrl|thumbnail,
 * date|eventDate). The server component fetches with no-store so the
 * homepage always shows fresh data.
 */
async function getUpcomingEvents(): Promise<EventRecord[]> {
  const res = await fetch(EVENTS_API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Backend returned ${res.status}`);
  }

  // Accept a bare array or an { events: [...] } wrapper.
  const data: unknown = await res.json();
  const rawList: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as { events?: unknown[] })?.events)
      ? (data as { events: unknown[] }).events
      : [];

  const records = rawList
    .map(toEventRecord)
    .filter((event): event is EventRecord => event !== null);

  return records
    .filter((event) => event.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);
}

function toEventRecord(raw: unknown): EventRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, string | undefined>;
  const id = d.id ?? d._id;
  const title = d.title;
  const date = d.date ?? d.eventDate;
  if (!id || !title || !date) return null;

  return {
    id: String(id),
    title,
    description: d.description ?? "",
    type: d.type ?? d.eventType ?? "",
    thumbnailUrl: d.thumbnailUrl ?? d.thumbnail ?? "",
    location: d.location ?? "",
    date: date.slice(0, 10), // just the "YYYY-MM-DD" part
    creatorEmail: d.creatorEmail ?? "",
    createdAt: d.createdAt ?? "",
  };
}

/** "2026-11-19" -> "Nov 19, 2026" (local time, matches the events list). */
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
  const [y, m, d] = date.split("-").map(Number);
  const then = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((then.getTime() - today.getTime()) / 86_400_000);
}

export async function UpcomingEvents() {
  let events: EventRecord[] | null = null;

  // The homepage should still render even when the dev backend is down.
  try {
    events = await getUpcomingEvents();
  } catch {
    events = null;
  }

  return (
    <section className="bg-muted px-10 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Upcoming Events
        </h2>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          The next community efforts you can still join.
        </p>

        {events === null ? (
          // Backend unreachable: a quiet note instead of a broken section.
          <p role="alert" className="mt-10 text-center text-sm text-muted-foreground">
            Live events are unavailable right now — check back soon.
          </p>
        ) : events.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No upcoming events yet — be the first to organize one.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-lg bg-[#146240] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
          >
            See all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** One card in the grid: thumbnail, type badge, title, where/when, link. */
function EventCard({ event }: { event: EventRecord }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Thumbnail, with the event type badge on top-left of the image. */}
      <div className="relative w-full bg-muted">
        {/* thumbnailUrl is a user-entered external URL, so a plain <img> is
            simpler than next/image (which would need remotePatterns config).
            No onError handler here: this is a server component. Bad URLs just
            collapse, leaving the muted thumb background. */}
        {event.thumbnailUrl && (
          <img
            src={event.thumbnailUrl}
            alt={`Thumbnail for ${event.title}`}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {event.type && (
          <span className="absolute left-3 top-3 rounded-full bg-[#1fca82] px-2.5 py-1 text-[11px] font-bold text-white">
            {event.type}
          </span>
        )}
      </div>

      {/* The details, and the link pinned to the bottom of the card. */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-base font-bold text-foreground">
          {event.title}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
          <span className="truncate">{event.location || "Location TBD"}</span>
        </p>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
          {formatDate(event.date)}
          <span className="text-xs">·</span>
          <span className="text-xs font-semibold text-[#1fca82]">
            {relativeDate(event.date)}
          </span>
        </p>
      </div>
    </Link>
  );
}
