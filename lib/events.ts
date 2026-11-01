// Event data lives in localStorage because this app is frontend-only.

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Drive",
  "Food Distribution",
  "Awareness Campaign",
];

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  type: string;
  thumbnailUrl: string;
  location: string;
  /** "YYYY-MM-DD" — the event date, never in the past. */
  date: string;
  /** Email of the user who created the event, used to validate who made it. */
  creatorEmail: string;
  createdAt: string;
}

const STORAGE_KEY = "aidcircle:events";

/** Today as "YYYY-MM-DD" in the user's local time. */
export function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function getEvents(): EventRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as EventRecord[];
  } catch {
    return [];
  }
}

export function addEvent(
  data: Omit<EventRecord, "id" | "createdAt">
): EventRecord {
  const event = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...getEvents(), event]));
  return event;
}
