export function AboutCommunity() {
  const cards = [
    {
      title: "Remote Workers & Digital Nomads",
      desc: "Keep your home base while exploring new hubs. High-speed wifi and dedicated workspaces are standard.",
    },
    {
      title: "Urban Families & Professionals",
      desc: "Swap your city apartment for a change of pace without sacrificing comfort or space for the kids.",
    },
    {
      title: "Empty-nesters & Semi-retired",
      desc: "Leverage your empty nest to travel the world slowly in a community-vetted exchange.",
    },
  ];

  return (
    <section className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
        Who is our community for?
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700 shadow-sm"
          >
            <div className="h-40 bg-slate-200 dark:bg-slate-800" />
            <div className="p-5 space-y-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {card.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}