// app/dashboard/components/DashboardFavourites.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

type Favourite = {
  id: number;
  city: string;
  country: string;
  title: string;
  tags: string[];
  referencePoints: number | null;
};

export default function DashboardFavourites() {
  const { user } = useUser();
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavourites() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/favourites/list");

        if (!response.ok) {
          throw new Error("Failed to fetch favourites");
        }

        const data = await response.json();
        
        // ✅ 使用新 API 的数据结构: data.favourites
        const formattedFavourites: Favourite[] = (data.favourites || []).map((fav: any) => {
          const prop = fav.property;
          return {
            id: prop.id,
            city: prop.city || "Unknown",
            country: prop.country || "",
            title: prop.title || "Untitled Property",
            tags: [], // 如果 properties 表有 tags 字段,改为 prop.tags
            referencePoints: null, // 如果有积分字段,改为 prop.reference_points
          };
        });

        setFavourites(formattedFavourites);
      } catch (error) {
        console.error("Error loading favourites:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFavourites();
  }, [user]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 h-full">
        <h2 className="text-base sm:text-lg font-semibold mb-3">
          My favourites
        </h2>
        <p className="text-sm text-[rgb(var(--color-muted))]">
          Loading your favourites...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 h-full">
      <h2 className="text-base sm:text-lg font-semibold mb-3">
        My favourites
      </h2>

      <div className="space-y-3">
        {favourites.length > 0 ? (
          favourites.map((fav) => (
            <Link
              key={fav.id}
              href={`/properties/${fav.id}`}
              className="block rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-3 hover:border-[rgb(var(--color-primary))] transition-colors"
            >
              <p className="text-xs text-[rgb(var(--color-muted))]">
                {fav.city}{fav.country ? `, ${fav.country}` : ""}
              </p>
              <p className="text-sm font-medium mt-0.5">{fav.title}</p>
              
              {fav.tags && fav.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {fav.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[rgb(var(--color-border))] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[rgb(var(--color-muted))]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="mt-2 text-xs text-[rgb(var(--color-muted))]">
                {fav.referencePoints ? (
                  <>Reference {fav.referencePoints} pts / night</>
                ) : (
                  <>Reference: Points estimation pending</>
                )}
              </p>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-[rgb(var(--color-muted))] mb-3">
              You haven&apos;t saved any homes yet.
            </p>
            <Link
              href="/homes"
              className="inline-block text-sm text-[rgb(var(--color-primary))] hover:underline"
            >
              Browse homes →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}