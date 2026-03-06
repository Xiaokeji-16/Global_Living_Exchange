"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import PropertyCard from "./PropertyCard";
import {
  matchesFilters,
  type PropertyFilters,
  type Property,
} from "../lib/propertyData";

type Props = {
  filters: PropertyFilters;
  mode?: "public" | "authed";
};

export default function PropertyListSection({ filters, mode = "public" }: Props) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载房产数据
  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch("/api/properties/list");
        if (!response.ok) {
          console.error("Properties API error:", response.status, await response.text());
          setProperties([]);
          return;
        }
        const data = await response.json();
        console.log("Properties data:", data); // 调试用，确认后可删除

        const formattedProperties: Property[] = (data.properties || []).map((prop: any) => ({
          id: prop.id,
          city: prop.city || "Unknown",
          country: prop.country || "",
          title: prop.title || "Untitled Property",
          guests: prop.guests || 1,
          beds: prop.beds || 1,
          referencePoints: prop.reference_points ?? null,
          tags: prop.tags || [],
          imageSrc: prop.photos?.[0] || "/placeholder-property.jpg",
          verified: prop.verification_status === "approved",
        }));

        setProperties(formattedProperties);
      } catch (error) {
        console.error("Error loading properties:", error);
      }
    }

    loadProperties();
  }, []);

  // 加载收藏列表（等 Clerk 初始化完成）
  useEffect(() => {
    if (!isLoaded) return; // 等 Clerk 加载完

    async function loadFavourites() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/favourites/list");
        if (!response.ok) {
          console.error("Favourites API error:", response.status, await response.text());
          setLoading(false);
          return;
        }
        const data = await response.json();
        const ids = (data.favourites || []).map((fav: any) => fav.property?.id).filter(Boolean);
        setFavouriteIds(ids);
      } catch (error) {
        console.error("Error loading favourites:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFavourites();
  }, [user, isLoaded]);

  const handleFavouriteChange = (propertyId: number, isFavourite: boolean) => {
    setFavouriteIds((prev) =>
      isFavourite ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)
    );
  };

  const filtered = properties.filter((p) => matchesFilters(p, filters));

  const handleLoadMore = () => {
    if (mode === "public") {
      router.push("/login");
    } else {
      console.log("TODO: load more properties for authed user");
    }
  };

  if (loading) {
    return (
      <section aria-label="Property results">
        <div className="col-span-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 text-sm text-[rgb(var(--color-muted))]">
          Loading properties...
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Property results">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 text-sm text-[rgb(var(--color-muted))]">
            No properties match your filters. Try adjusting destination, type or points range.
          </div>
        ) : (
          filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              href={`/properties/${p.id}`}
              isFavourite={favouriteIds.includes(p.id)}
              onFavouriteChange={handleFavouriteChange}
            />
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={handleLoadMore}
            className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition">
            Load more properties
          </button>
        </div>
      )}
    </section>
  );
}