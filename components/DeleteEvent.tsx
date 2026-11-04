"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import type { EditableEvent } from "@/components/EditEvent";

// Backend delete route (aidcircle-server/index.js): removes the joined copy
// and the original event, so the card disappears from every page.
const DELETE_API_URL = "http://localhost:8000/manage-event";

const DeleteEvent = ({ event }: { event: EditableEvent }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleDelete() {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    setIsDeleting(true);
    try {
      const response = await fetch(`${DELETE_API_URL}/${event._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }
      router.refresh(); // re-render the list without this event
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the event."
      );
      setIsDeleting(false);
    }
  }

  return (
    // Column wrapper keeps any error text below the button instead of
    // squeezing it into the card's horizontal button row.
    <div className="flex flex-1 flex-col gap-1.5">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete ${event.title}`}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2.5 text-xs font-bold text-red-600 ring-1 ring-inset ring-red-100 transition-colors hover:bg-red-100 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default DeleteEvent;
