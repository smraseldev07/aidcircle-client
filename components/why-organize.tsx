const features = [
  {
    title: "Direct Local Distribution",
    description:
      "Coordinate drop-off points in areas like Mirpur and Mohammadpur with hosts.",
  },
  {
    title: "Transparent Attendance",
    description:
      "Keep real-time tabs on volunteer quotas to prevent over-allocation on the ground.",
  },
  {
    title: "Accountable Creators",
    description:
      "Organizers verify their identities and details before receiving public contributions.",
  },
];

export function WhyOrganize() {
  return (
    <section className="bg-muted px-10 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Why Organize with AidCircle
        </h2>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Built to ensure volunteer efforts directly reach communities in need.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card px-6 py-7"
            >
              <h3 className="text-sm font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
