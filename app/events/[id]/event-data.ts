// Shape of one event record from the dev backend's GET /events/:id endpoint.
// NOTE: this differs from EventRecord in lib/events.ts (eventType vs type,
// eventDate vs date, etc.) — see AGENTS.md "Two incompatible backend shapes".
export interface EventData {
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

/** The bits of the better-auth session user that the client needs. */
export interface BookingUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}
