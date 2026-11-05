import Link from "next/link";
import { History, MapPin } from "lucide-react";

import { todayISO, type EventRecord } from "@/lib/events";

// Same dev backend the rest of the pages read from (not env-driven yet).
const EVENTS_API_URL = "http://localhost:8000/events";

/**
 * "Community in Action" homepage section: highlights events that already
 * happened (most recent first, capped at six) as a small proof of the
 * community's activity. Same tolerant normalization as the upcoming-events
 * section, so it survives both backend field shapes.
 */
async function getPastEvents(): Promise<EventRecord[]> {
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

  // Only strictly past events, most recent first.
  return records
    .filter((event) => event.date < todayISO())
    .sort((a, b) => b.date.localeCompare(a.date))
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

/** "2026-11-19" -> "Nov 19, 2026" (local time, matches the other pages). */
function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function CommunityInAction() {
  let events: EventRecord[] | null = null;

  // The homepage should still render even when the dev backend is down.
  try {
    events = await getPastEvents();
  } catch {
    events = null;
  }

  return (
    <section className="bg-muted px-10 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Community in Action
        </h2>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          A look back at the efforts volunteers already made happen.
        </p>

        {events === null ? (
          // Backend unreachable: a quiet note instead of a broken section.
          <p role="alert" className="mt-10 text-center text-sm text-muted-foreground">
            Our community highlights are unavailable right now — check back soon.
          </p>
        ) : events.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No past events yet — your first completed drive will show up here.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <PastEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** One past-event card: grayscaled thumbnail, title, location, "happened" date. */
function PastEventCard({ event }: { event: EventRecord }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative w-full bg-muted">
        {/* thumbnailUrl is a user-entered external URL, so a plain <img> is
            simpler than next/image (which would need remotePatterns config).
            No onError handler here: this is a server component. The grayscale
            + muted badge visually mark these as past events. */}
        {event.thumbnailUrl && (
          <img
            src={event.thumbnailUrl}
            alt={`Thumbnail for ${event.title}`}
            className="h-44 w-full object-cover grayscale transition-transform duration-300 group-hover:scale-105 group-hover:grayscale-0"
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-foreground/60 px-2.5 py-1 text-[11px] font-bold text-background backdrop-blur-sm">
          <History className="h-3 w-3" />
          Past event
        </span>
        {event.type && (
          <span className="absolute right-3 top-3 rounded-full bg-[#146240] px-2.5 py-1 text-[11px] font-bold text-white opacity-90">
            {event.type}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-base font-bold text-foreground">
          {event.title}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
          <span className="truncate">{event.location || "Location TBD"}</span>
        </p>

        <p className="mt-auto text-sm text-muted-foreground">
          Happened on{" "}
          <span className="font-semibold text-foreground">
            {formatDate(event.date)}
          </span>
        </p>
      </div>
    </Link>
  );
}
