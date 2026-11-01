"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { EVENT_TYPES, addEvent, todayISO, type EventRecord } from "@/lib/events";

// The empty form; email is filled in and kept between submissions.
const emptyForm = {
  title: "",
  description: "",
  type: "",
  thumbnailUrl: "",
  location: "",
  date: "",
  email: "",
};

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#20293d] outline-none placeholder:text-slate-400 focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30";

const labelClass = "text-sm font-medium text-[#20293d]";

export default function CreateEventPage() {
  const [form, setForm] = React.useState(emptyForm);
  const [dateError, setDateError] = React.useState("");
  const [created, setCreated] = React.useState<EventRecord | null>(null);

  // One handler for every input/select; works because each field's
  // name matches its key in the form state.
  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setForm({ ...form, date: value });
    // The special rule: the event date may not be in the past.
    if (value && value < todayISO()) {
      setDateError("Past dates are not allowed — pick today or a future date.");
    } else {
      setDateError("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.date < todayISO()) {
      setDateError("Past dates are not allowed — pick today or a future date.");
      return;
    }

    const record = addEvent({
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      thumbnailUrl: form.thumbnailUrl.trim(),
      location: form.location.trim(),
      date: form.date,
      // Kept with the event so we can validate who created it.
      creatorEmail: form.email.trim(),
    });

    setCreated(record);
    setForm({ ...emptyForm, email: form.email }); // keep the email filled in
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-10 py-12">
        <div className="mx-auto w-full max-w-xl rounded-2xl bg-[#ddebe1] px-8 py-10">
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-[#0e5738] sm:text-3xl">
            Create an Event
          </h1>
          <p className="mt-1.5 text-center text-xs text-slate-500">
            Organize a community effort — cleanups, plantations, donations and
            more.
          </p>

          {created ? (
            // Success message shown after the event is saved.
            <div className="mt-8 text-center">
              <p className="text-sm font-semibold text-[#0e5738]">
                Event created successfully!
              </p>
              <p className="mt-1 text-xs text-slate-600">
                “{created.title}” is scheduled for {created.date} and is linked
                to {created.creatorEmail}.
              </p>
              <button
                type="button"
                onClick={() => setCreated(null)}
                className="mt-6 h-10 rounded-lg bg-[#146240] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
              >
                Create another event
              </button>
            </div>
          ) : (
            // Required fields and email/URL checks use native browser
            // validation; the past-date rule is checked in code above.
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className={labelClass}>
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Riverside Park Cleanup Drive"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  placeholder="What will volunteers do? Who should join?"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#20293d] outline-none placeholder:text-slate-400 focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="type" className={labelClass}>
                  Event type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={form.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="thumbnailUrl" className={labelClass}>
                  Thumbnail image URL
                </label>
                <input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  required
                  placeholder="https://example.com/event-photo.jpg"
                  value={form.thumbnailUrl}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  required
                  placeholder="e.g. Riverside Park, Dhaka"
                  value={form.location}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="date" className={labelClass}>
                  Event date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={form.date}
                  onChange={handleDateChange}
                  className={inputClass}
                />
                {dateError ? (
                  <p role="alert" className="text-xs text-red-600">
                    {dateError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Choose a future date — past dates are not allowed.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={labelClass}>
                  Your email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
                <p className="text-xs text-slate-500">
                  Saved with the event so only you can edit it later.
                </p>
              </div>

              <button
                type="submit"
                className="mt-2 h-10 rounded-lg bg-[#146240] text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
              >
                Create event
              </button>
            </form>
          )}

          <Link
            href="/"
            className="mt-6 block text-center text-xs font-bold text-[#20293d] hover:text-emerald-800"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
