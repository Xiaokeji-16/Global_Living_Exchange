"use client";

import { useRouter } from "next/navigation";
import PropertyCard from "./PropertyCard";
import {
  MOCK_PROPERTIES,
  matchesFilters,
  type PropertyFilters,
} from "../lib/propertyData";

type Props = {
  filters: PropertyFilters;
  mode?: "public" | "authed"; // public=游客版，authed=登录版
};

export default function PropertyListSection({ filters, mode = "public" }: Props) {
  const router = useRouter();
  
  const filtered = MOCK_PROPERTIES.filter((p) =>
    matchesFilters(p, filters)
  );

  const handleLoadMore = () => {
    if (mode === "public") {
      router.push("/login");
    } else {
      console.log("TODO: load more properties for authed user");
    }
  };

  return (
    <section aria-label="Property results">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              href={`/properties/${p.id}`}   
            />
          ))
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={handleLoadMore}
          className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition">
          Load more properties
        </button>
      </div>
    </section>
  );
}