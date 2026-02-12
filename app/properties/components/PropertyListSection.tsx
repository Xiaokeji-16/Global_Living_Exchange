"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
  const { user } = useUser();
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  const filtered = MOCK_PROPERTIES.filter((p) =>
    matchesFilters(p, filters)
  );

  // 获取用户的收藏列表
  useEffect(() => {
    async function loadFavourites() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/favourites/list");
        if (response.ok) {
          const data = await response.json();
          setFavouriteIds(data.favourites || []);
        }
      } catch (error) {
        console.error("Error loading favourites:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFavourites();
  }, [user]);

  // 处理收藏状态变化
  const handleFavouriteChange = (propertyId: number, isFavourite: boolean) => {
    setFavouriteIds((prev) => {
      if (isFavourite) {
        // 添加收藏
        return [...prev, propertyId];
      } else {
        // 移除收藏
        return prev.filter((id) => id !== propertyId);
      }
    });
  };

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
              isFavourite={favouriteIds.includes(p.id)}
              onFavouriteChange={handleFavouriteChange}
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