import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

import React from 'react';
import EditEvent from '@/components/EditEvent';
import DeleteEvent from '@/components/DeleteEvent';

// Same dev backend the other pages use; per-organizer route takes the email.
const MANAGE_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/manage-event`;

interface ManagedEvent {
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
 * Normalize one backend record. The manage endpoint should return the same
 * create-form documents as GET /events (Mongo-style `_id`, `type`,
 * `thumbnailUrl`, `date`), but fields are filled with fallbacks for the /
 * events/[id] schema variants too (eventType, thumbnail, eventDate) so the
 * page survives either shape.
 */
function toManagedEvent(raw: unknown): ManagedEvent | null {
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

const ManagePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  // Composed like the other pages: heading at top, cards on a slate canvas.
  const pageFrame = (children: React.ReactNode) => (
    <main className="min-h-screen bg-muted px-10 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-center text-2xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-400 sm:text-3xl">
          Manage Events
        </h1>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Edit or remove the events you organized.
        </p>
        {children}
      </div>
    </main>
  );

  // Not signed in: the backend route needs the organizer's email.
  if (!user?.email) {
    return pageFrame(
      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to see the events you organized.
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

  const res = await fetch(`${MANAGE_API_URL}/${user.email}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return pageFrame(
      <p role="alert" className="mt-10 text-center text-sm text-red-600">
        Could not load your events (backend returned {res.status}).
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
    .map(toManagedEvent)
    .filter((event): event is ManagedEvent => event !== null);

  if (events.length === 0) {
    return pageFrame(
      <div className="mt-10 text-center">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">
          You haven&apos;t created any events yet.
        </p>
        <Link
          href="/create-event"
          className="mt-4 inline-block rounded-lg bg-[#146240] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
        >
          Create the first one
        </Link>
      </div>
    );
  }

  return pageFrame(
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <ManagedEventCard key={event._id} event={event} />
      ))}
    </div>
  );
};

/** One manage card: thumbnail, badge, details, and Edit / Delete buttons. */
function ManagedEventCard({ event }: { event: ManagedEvent }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail with the type badge on top-left, like the events grid. */}
      <div className="relative w-full bg-muted">
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
        <h3 className="line-clamp-2 text-base font-bold text-foreground">
          {event.title}
        </h3>

        {event.description && (
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {event.description}
          </p>
        )}

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
          <span className="truncate">{event.location || 'Location TBD'}</span>
        </p>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0 text-emerald-800 dark:text-emerald-400" />
          {formatDate(event.date)}
        </p>

        {/* Edit opens the EditEvent dialog; Delete is DeleteEvent (no-op
            button until the backend gets a delete route). */}
        <div className="mt-auto flex gap-2 pt-2">
          <EditEvent event={event} />
          <DeleteEvent event={event} />
        </div>
      </div>
    </article>
  );
};

export default ManagePage;
