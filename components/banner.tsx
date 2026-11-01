import { Button } from "@/components/ui/button";

export function Banner() {
  return (
    <section className="bg-[#0e6a46] px-10 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_38%] lg:items-stretch">
        {/* Left: copy + CTAs */}
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#1f7c55] px-3.5 py-1.5 text-xs font-medium">
            <span
              className="size-1.5 rounded-full bg-[#2be098]"
              aria-hidden
            />
            Active Drives in Dhaka
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Turn Local Compassion into{" "}
            <span className="text-[#2be098]">Real Community Impact</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            Join neighborhood drives across Dhaka, from winter blanket
            distribution to tree plantation and seasonal flood relief
            campaigns.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button className="h-10 rounded-lg bg-[#1fca82] px-5 text-white hover:bg-[#19b473]">
              Explore Events
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-lg border-[#2f8f63] bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
            >
              Host an Initiative
            </Button>
          </div>
        </div>

        {/* Right: stat card */}
        <div className="relative min-h-72 rounded-2xl bg-[#1c2231]">
          <div className="absolute bottom-6 left-6 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#1c2231] shadow-sm">
            1,420+ Blankets Delivered
          </div>
        </div>
      </div>
    </section>
  );
}
