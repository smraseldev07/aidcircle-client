
import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Clock, Tag, ArrowLeft, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import { BookingActions } from './booking-actions';
import type { EventData } from './event-data';

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <p className="text-sm font-medium text-muted-foreground">Loading event details…</p>
          </div>
        </div>
      }
    >
      <EventDetails params={params} />
    </Suspense>
  );
}

const EventDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

const jwttoken = await auth.api.getToken({
  headers: await headers()
})
   



  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
    cache: 'no-store', 
  headers :{
    authorization : `Bearer ${jwttoken?.token}`
  },
  });

  if (!res.ok) {
    notFound();
  }

  const data: EventData = await res.json();

  return (
    <main className="min-h-screen bg-muted py-8 text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Upcoming Events
          </Link>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* ================= LEFT CONTENT (8 COLUMNS) ================= */}
          <section className="space-y-8 lg:col-span-8">
            
            {/* Thumbnail Banner */}
            <div className="overflow-hidden rounded-2xl border border-border bg-slate-900 shadow-sm">
              <img
                src={data.thumbnail || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200'}
                alt={data.title}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>

            {/* Badges & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                <Tag className="h-3 w-3" />
                {data.eventType || 'Community Drive'}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {data.title}
              </h1>

              {/* Quick Meta Row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>{data.eventDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span>{data.eventTime || '09:00 AM - 01:00 PM'}</span>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Event Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">About This Initiative</h2>
              <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-line space-y-4">
                {data.description}
              </div>
            </div>

            {/* Volunteer Expectations Checklist */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-foreground">What Volunteers Will Do</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Coordinate on-ground logistics and manage recipient lines cleanly and respectfully.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Assemble at the designated landmark 20 minutes prior to briefing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Supervise distribution tokens and conduct post-drive site cleanup.</span>
                </li>
              </ul>
            </div>

            {/* Organizer Profile Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={data.creatorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={data.creatorName || 'Organizer'}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground">{data.creatorName || 'Community Lead'}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-muted-foreground">Event Organizer &amp; Ground Coordinator</p>
                </div>
              </div>

              {data.creatorEmail && (
                <a
                  href={`mailto:${data.creatorEmail}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                >
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Contact Host
                </a>
              )}
            </div>

          </section>

          {/* ================= RIGHT STICKY ACTION PANEL (4 COLUMNS) ================= */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
              
              {/* Card Header & Status Quota */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-lg font-extrabold text-foreground">Event Logistics</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Spots Available
                </span>
              </div>

              {/* Key Logistical Breakdown */}
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</span>
                  <span className="font-bold text-foreground">{data.eventDate}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</span>
                  <span className="font-bold text-foreground">{data.eventTime || '09:00 AM – 01:00 PM'}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Meeting Point</span>
                  <span className="font-bold text-foreground">{data.location}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gear / Requirements</span>
                  <span className="text-muted-foreground">ID proof, casual comfortable sneakers, and a water bottle.</span>
                </div>
              </div>

              <hr className="border-border" />

              {/* Join / Share (client component — needs event handlers) */}
              <BookingActions event={data} user={user ? {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image ?? null,
              } : null} />

              <p className="text-center text-[11px] text-muted-foreground leading-normal">
                Joining registers your email with the organizer. You will receive emergency drive alerts on updates.
              </p>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};