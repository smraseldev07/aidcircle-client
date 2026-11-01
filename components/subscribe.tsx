export function Subscribe() {
  return (
    <section className="bg-white px-10 py-14">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#ddebe1] px-8 py-12">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#0e5738] sm:text-3xl">
          Stay Updated on Emergency Relief Drives
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Subscribe to our weekly dispatch of newly scheduled community efforts.
        </p>

        <form className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-[#20293d] outline-none placeholder:text-slate-400 focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-lg bg-[#146240] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d32]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
