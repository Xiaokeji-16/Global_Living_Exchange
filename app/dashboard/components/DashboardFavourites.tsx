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
        console.log("No user found");
        setLoading(false);
        return;
      }

      console.log("Loading favourites for user:", user.id);

      try {
        const response = await fetch("/api/favourites/list");
        
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error response:", errorText);
          throw new Error("Failed to fetch favourites");
        }

        const data = await response.json();
        console.log("API Response data:", data);
        console.log("Properties count:", data.properties?.length || 0);
        
        // 转换数据格式
        const formattedFavourites: Favourite[] = data.properties.map((prop: any) => {
          console.log("Processing property:", prop);
          return {
            id: prop.id,
            city: prop.city || "Unknown",
            country: prop.country || "",
            title: prop.title || "Untitled Property",
            tags: prop.tags || [],
            referencePoints: prop.reference_points,
          };
        });

        console.log("Formatted favourites:", formattedFavourites);
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
              href="/properties"
              className="inline-block text-sm text-[rgb(var(--color-primary))] hover:underline"
            >
              Browse properties →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}