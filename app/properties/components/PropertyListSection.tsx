import PropertyCard from "./PropertyCard";
import {
  MOCK_PROPERTIES,
  matchesFilters,
  type PropertyFilters,
} from "../lib/propertyData";

type Props = {
  filters: PropertyFilters;
};

export default function PropertyListSection({ filters }: Props) {
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
              href={`/properties/${p.id}`}   // ✅ 在这里决定：列表上的卡片点击进详情
            />
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition">
          Load more properties
        </button>
      </div>
    </section>
  );
}