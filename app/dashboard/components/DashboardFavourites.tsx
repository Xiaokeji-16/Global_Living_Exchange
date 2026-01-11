// app/dashboard/components/DashboardFavourites.tsx
"use client";

export default function DashboardFavourites() {
  // 先写死几条，之后可以从数据库取
  const favourites = [
    {
      id: 1,
      city: "Lisbon, Portugal",
      title: "Penthouse with Sea View",
      tags: ["Luxury", "Family friendly"],
      points: 800,
    },
    {
      id: 2,
      city: "Amsterdam, Netherlands",
      title: "Cozy Canal-side Loft",
      tags: ["City center"],
      points: 520,
    },
  ];

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 h-full">
      <h2 className="text-base sm:text-lg font-semibold mb-3">
        My favourites
      </h2>

      <div className="space-y-3">
        {favourites.map((fav) => (
          <a
            key={fav.id}
            href={`/properties/${fav.id}`}
            className="block rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-3 hover:border-[rgb(var(--color-primary))] transition-colors"
          >
            <p className="text-xs text-[rgb(var(--color-muted))]">
              {fav.city}
            </p>
            <p className="text-sm font-medium">{fav.title}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {fav.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-[rgb(var(--color-border))] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[rgb(var(--color-muted))]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
              Reference {fav.points} pts / night
            </p>
          </a>
        ))}

        {favourites.length === 0 && (
          <p className="text-sm text-[rgb(var(--color-muted))]">
            You haven&apos;t saved any homes yet.
          </p>
        )}
      </div>
    </section>
  );
}