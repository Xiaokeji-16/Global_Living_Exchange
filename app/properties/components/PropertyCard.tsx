// 顶部 import
import Property from "../components/PropertyCard";

function PropertyListSection({ filters }: { filters: PropertyFilters }) {
  const filtered = MOCK_PROPERTIES.filter((p) =>
    matchesFilters(p, filters)
  );

  return (
    <section aria-label="Property results">
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 text-sm text-[rgb(var(--color-muted))]">
            No properties match your filters. Try adjusting destination, type
            or points range.
          </div>
        ) : (
          filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              href={`/properties/${p.id}`}   // ✅ 这里一定要传 href
            />
          ))
        )}
      </div>

      {/* Load more... */}
    </section>
  );
}