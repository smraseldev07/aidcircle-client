import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Clock, Tag, ArrowLeft, CheckCircle2, ShieldCheck, Mail, Share2 } from 'lucide-react';


interface EventData {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  eventTime?: string;
  creatorName?: string;
  creatorEmail?: string;
  creatorPhoto?: string;
  maxVolunteers?: number;
  currentJoined?: number;
}

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">Loading event details…</p>
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

  const res = await fetch(`http://localhost:8000/events/${id}`, {
    cache: 'no-store', // ensures up-to-date details
  });

  if (!res.ok) {
    notFound();
  }

  const data: EventData = await res.json();

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-8 text-slate-800 antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
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
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-sm">
              <img
                src={data.thumbnail || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200'}
                alt={data.title}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>

            {/* Badges & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                <Tag className="h-3 w-3" />
                {data.eventType || 'Community Drive'}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {data.title}
              </h1>

              {/* Quick Meta Row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium text-slate-500 pt-1">
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

            <hr className="border-slate-200" />

            {/* Event Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">About This Initiative</h2>
              <div className="text-base leading-relaxed text-slate-600 whitespace-pre-line space-y-4">
                {data.description}
              </div>
            </div>

            {/* Volunteer Expectations Checklist */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">What Volunteers Will Do</h3>
              <ul className="space-y-3 text-sm text-slate-600">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={data.creatorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={data.creatorName || 'Organizer'}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{data.creatorName || 'Community Lead'}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500">Event Organizer &amp; Ground Coordinator</p>
                </div>
              </div>

              {data.creatorEmail && (
                <a
                  href={`mailto:${data.creatorEmail}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Contact Host
                </a>
              )}
            </div>

          </section>

          {/* ================= RIGHT STICKY ACTION PANEL (4 COLUMNS) ================= */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              
              {/* Card Header & Status Quota */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Event Logistics</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Spots Available
                </span>
              </div>

              {/* Key Logistical Breakdown */}
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Date</span>
                  <span className="font-bold text-slate-800">{data.eventDate}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Time</span>
                  <span className="font-bold text-slate-800">{data.eventTime || '09:00 AM – 01:00 PM'}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Meeting Point</span>
                  <span className="font-bold text-slate-800">{data.location}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Gear / Requirements</span>
                  <span className="text-slate-600">ID proof, casual comfortable sneakers, and a water bottle.</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Action Buttons */}
              <div className="space-y-3">
             <button
  type="button"
  className="group relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-700/30 active:scale-[0.99] cursor-pointer"
>
  {/* Plus/Hand Icon */}
  <svg 
    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>

  <span>Join Event</span>
</button>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  Share Initiative
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 leading-normal">
                Joining registers your email with the organizer. You will receive emergency drive alerts on updates.
              </p>

            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};