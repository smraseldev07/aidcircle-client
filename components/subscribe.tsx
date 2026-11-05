export function Subscribe() {
  return (
    <section className="bg-card px-10 py-14">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#ddebe1] dark:bg-emerald-950/60 px-8 py-12">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-400 sm:text-3xl">
          Stay Updated on Emergency Relief Drives
        </h2>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Subscribe to our weekly dispatch of newly scheduled community efforts.
        </p>

        <form className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="h-10 w-full rounded-lg border border-border bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#1fca82] focus:ring-3 focus:ring-[#1fca82]/30"
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
