"use client";

import Link from "next/link";
import { LogOut, CalendarPlus, ClipboardList, Handshake, type LucideIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navbar() {
  // Session from better-auth; `{ user: {...}, session: {...} }` when signed in.
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
  }

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center bg-white px-10 py-4 ">
      <Link
        href="/"
        className="text-xl font-extrabold tracking-tight text-emerald-950 max-w-6xl mx-auto"
      >
        AidCircle.
      </Link>

      <nav>
        <Link
          href="/events"
          className="text-xs font-bold text-[#20293d] hover:text-emerald-800"
        >
          Upcoming Events
        </Link>
      </nav>

      <div className="flex items-center justify-end gap-6 max-w-6xl mx-auto">
        {/* Session is still loading: keep the slot empty instead of flashing
            the Login button to signed-in users. */}
        {isPending ? null : session?.user ? (
          <SignedInMenu
            email={session.user.email}
            name={session.user.name}
            image={session.user.image ?? null}
            onSignOut={handleSignOut}
          />
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-[#146240] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0e4d32]"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

/** Avatar that opens a popover with quick links and a sign-out button. */
function SignedInMenu({
  email,
  name,
  image,
  onSignOut,
}: {
  email: string;
  name: string;
  image: string | null;
  onSignOut: () => void;
}) {
  // First letter of the name (or email) for the fallback avatar.
  const initial = (name || email).trim().charAt(0).toUpperCase();

  return (
    <Popover>
      <PopoverTrigger
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-[#1fca82]/30"
        aria-label="Account menu"
      >
        <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-[#146240] text-sm font-bold text-white">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            initial
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64">
        <PopoverTitle>{email}</PopoverTitle>
        <p className="text-xs text-slate-500">Signed in to AidCircle</p>

        <div className="h-px bg-slate-200" />

        <PopoverLink
          href="/create-event"
          icon={CalendarPlus}
          label="Create Event"
        />
        <PopoverLink
          href="/manage-event"
          icon={ClipboardList}
          label="Manage Events"
        />
        <PopoverLink
          href="/joined-events"
          icon={Handshake}
          label="Joined Events"
        />

        <div className="h-px bg-slate-200" />

        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-[#20293d] transition-colors hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
          Sign out
        </button>
      </PopoverContent>
    </Popover>
  );
}

/** One menu row: icon + label, navigates to the route, closes the popover. */
function PopoverLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#20293d] transition-colors hover:bg-slate-100"
    >
      <Icon className="h-4 w-4 text-[#0e5738]" />
      {label}
    </Link>
  );
}
