"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EVENT_TYPES, todayISO } from "@/lib/events";

// Same dev backend the other pages use. The manage route updates one
// document per id (PATCH /manage-event/:id in aidcircle-server/index.js).
const EDIT_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/manage-event`;

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30";

const labelClass = "text-sm font-medium text-foreground";

/** The bits of a managed event the edit form needs (matches ManagedEvent). */
export interface EditableEvent {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnailUrl: string;
  location: string;
  /** "YYYY-MM-DD" */
  date: string;
}

const EditEvent = ({ event }: { event: EditableEvent }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  // Prefill with the event's current values.
  const [form, setForm] = React.useState({
    title: event.title,
    description: event.description,
    type: event.type,
    thumbnailUrl: event.thumbnailUrl,
    location: event.location,
    date: event.date,
  });
  const [dateError, setDateError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  // Send the updated event to the backend, then close and refresh the list.
  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (form.date < todayISO()) {
      setDateError("Past dates are not allowed — pick today or a future date.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    // Same payload shape the Create Event form posts (kept with the event so
    // we can validate who made it).
    const eventData = {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      thumbnailUrl: form.thumbnailUrl.trim(),
      location: form.location.trim(),
      date: form.date,
    };

    try {
      const response = await fetch(`${EDIT_API_URL}/${event._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }
      setOpen(false); // done editing -> back to the card
      router.refresh(); // re-render the server list with the updated event
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not save changes."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* No <form> around the trigger: this component sits in a flex button
          row on the manage-event card, so the trigger itself must be that
          row's flex child for its flex-1 width to work. */}
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            Edit
          </button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        {/* Form lives inside the dialog (which portals to <body>), so the
            Save button is a real member of the form and can submit it. */}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>
              Update your event details here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-title" className={labelClass}>
                Title
              </label>
              <input
                id="edit-title"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                required
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-type" className={labelClass}>
                Event type
              </label>
              <select
                id="edit-type"
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
              <label htmlFor="edit-thumbnailUrl" className={labelClass}>
                Thumbnail image URL
              </label>
              <input
                id="edit-thumbnailUrl"
                name="thumbnailUrl"
                type="url"
                required
                value={form.thumbnailUrl}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-location" className={labelClass}>
                Location
              </label>
              <input
                id="edit-location"
                name="location"
                required
                value={form.location}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-date" className={labelClass}>
                Event date
              </label>
              <input
                id="edit-date"
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
                <p className="text-xs text-muted-foreground">
                  Choose a future date — past dates are not allowed.
                </p>
              )}
            </div>
          </div>

          {submitError ? (
            <p role="alert" className="text-xs text-red-600">
              {submitError}
            </p>
          ) : null}

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving changes…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvent;
