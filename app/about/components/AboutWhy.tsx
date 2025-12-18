export function AboutWhy() {
  const reasons = [
    {
      title: "Verified members only",
      desc: "Every member is identity-verified and home-vetted to build trust before you swap.",
    },
    {
      title: "Designed for 1–12 months",
      desc: "Optimised for medium to long-term living, not quick vacation stays.",
    },
    {
      title: "Points-based exchange",
      desc: "Fair value stays without the hassle of direct reciprocity or rent negotiations.",
    },
    {
      title: "Human-supported matching",
      desc: "Our team curates matches and logistics so you don’t have to figure it out alone.",
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
        Why Global Living Exchange?
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
        We bridge the gap between expensive vacation rentals and long-term leases,
        creating a trusted ecosystem for global citizens.
      </p>

      <div className="grid gap-6 md:grid-cols-4">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700 px-5 py-6 space-y-3"
          >
            <div className="h-8 w-8 rounded-xl bg-[rgb(var(--color-primary))]/10" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {r.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}