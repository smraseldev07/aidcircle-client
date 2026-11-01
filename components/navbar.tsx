import Link from "next/link";

export function Navbar() {
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
        <div className="size-9 rounded-full bg-emerald-500" aria-hidden />
      </div>
    </header>
  );
}
