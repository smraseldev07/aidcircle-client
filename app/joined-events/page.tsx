import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

import React from 'react';

// Same dev backend family as the join POST (/joined). GET-style route is
// assumed to take the email path param like /manage-event does — one-line
// change here if the real endpoint differs.
const JOINED_API_URL = 'http://localhost:8000/manage-event';

interface JoinedEvent {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnailUrl: string;
  location: string;
  /** "YYYY-MM-DD" */
  date: string;
}

/**
 * Normalize one backend record. Should be the same create-form documents
 * (Mongo-style `_id`, `type`, `thumbnailUrl`, `date`), with fallbacks for the
 * /events/[id] schema variants (eventType, thumbnail, eventDate) so the page
 * survives either shape.
 */
function toJoinedEvent(raw: unknown): JoinedEvent | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, string | undefined>;
  const id = d._id ?? d.id;
  const title = d.title;
  const date = d.date ?? d.eventDate;
  if (!id || !title || !date) return null;

  return {
    _id: String(id),
    title,
    description: d.description ?? '',
    type: d.type ?? d.eventType ?? '',
    thumbnailUrl: d.thumbnailUrl ?? d.thumbnail ?? '',
    location: d.location ?? '',
    date: date.slice(0, 10),
  };
}

/** "2026-11-19" -> "Nov 19, 2026" (local time, matches the events list). */
function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const JoinedPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  // Composed like the other pages: heading at top, cards on a slate canvas.
  const pageFrame = (children: React.ReactNode) => (
    <main className="min-h-screen bg-slate-50 px-10 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-[#0e5738] sm:text-3xl">
          Joined Events
        </h1>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Community efforts you signed up for.
        </p>
        {children}
      </div>
    </main>
  );

  // Not signed in: the backend route needs the user's email.
  if (!user?.email) {
    return pageFrame(
      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500">
          Sign in to see the events you joined.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-[#146240] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
        >
          Login
        </Link>
      </div>
    );
  }

  const res = await fetch(`${JOINED_API_URL}/${user.email}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return pageFrame(
      <p role="alert" className="mt-10 text-center text-sm text-red-600">
        Could not load your joined events (backend returned {res.status}).
      </p>
    );
  }

  const data: unknown = await res.json();
  console.log(data);

  // Accept a bare array or an { events: [...] } wrapper, like /events does.
  const rawList: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray((data as { events?: unknown[] })?.events)
      ? (data as { events: unknown[] }).events
      : [];

  const events = rawList
    .map(toJoinedEvent)
    .filter((event): event is JoinedEvent => event !== null);

  if (events.length === 0) {
    return pageFrame(
      <div className="mt-10 text-center">
        <p className="text-sm font-semibold text-[#0e5738]">
          You haven&apos;t joined any events yet.
        </p>
        <Link
          href="/events"
          className="mt-4 inline-block rounded-lg bg-[#146240] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
        >
          Browse Upcoming Events
        </Link>
      </div>
    );
  }

  return pageFrame(
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <JoinedEventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

/** One joined card: thumbnail, badge, and details (no action buttons). */
function JoinedEventCard({ event }: { event: JoinedEvent }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail with the type badge on top-left, like the events grid. */}
      <div className="relative w-full bg-slate-100">
        {event.thumbnailUrl && (
          // Deliberate plain <img>: user-entered external URL, next/image
          // would need remotePatterns for every domain.
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
          <span className="truncate">{event.location || 'Location TBD'}</span>
        </p>

        <p className="mt-auto flex items-center gap-1.5 text-sm text-slate-600">
          <Calendar className="h-4 w-4 shrink-0 text-[#0e5738]" />
          {formatDate(event.date)}
        </p>
      </div>
    </article>
  );
};

export default JoinedPage;
