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
    <section className="bg-[#eef1f6] px-10 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#20293d] sm:text-3xl">
          Why Organize with AidCircle
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500">
          Built to ensure volunteer efforts directly reach communities in need.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white px-6 py-7"
            >
              <h3 className="text-sm font-bold text-[#20293d]">
                {feature.title}
              </h3>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
