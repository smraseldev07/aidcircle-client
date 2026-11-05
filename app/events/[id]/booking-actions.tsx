"use client";

import React from "react";
import { Check, Share2 } from "lucide-react";

import type { BookingUser, EventData } from "./event-data";

/**
 * Join / Share actions for one event, on the right action panel.
 * Must be a client component: the page that fetches the event is a server
 * component, and event handlers can't live there.
 */
export function BookingActions({
  event,
  user,
}: {
  event: EventData;
  user: BookingUser | null;
}) {
  // Flips to true once the join is accepted; swaps the button to "Joined".
  const [joined, setJoined] = React.useState(false);

  async function handlebooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const info = {
      ...user,
      ...event,
    };
    const res = await fetch('http://localhost:8000/joined',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      const data = await res.json()
      console.log( data);

      setJoined(true);
  }


  return (
    <form onSubmit={handlebooking}>
      <div className="space-y-3">
        {joined ? (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-6 py-3.5 text-center text-sm font-bold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-800"
          >
            <Check className="h-4 w-4" />
            <span>Joined</span>
          </button>
        ) : (
          <button
            type="submit"
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
        )}

        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-xs font-bold text-foreground hover:bg-muted transition"
        >
          <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
          Share Initiative
        </button>
      </div>
    </form>
  );
}
