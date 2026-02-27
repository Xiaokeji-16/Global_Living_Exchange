"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Users, BedDouble, ShieldCheck } from "lucide-react";

type Home = {
  id: number;
  city: string;
  country: string;
  title: string;
  guests: number;
  beds: number;
  photos: string[];
  verification_status: string;
};

export function FeaturedHomesSection() {
  const router = useRouter();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/properties/list");
        const data = await res.json();
        // 最多显示6个
        setHomes((data.properties || []).slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section id="properties" className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-foreground))]">
            Featured homes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-2xl mx-auto">
            Discover unique homes from our verified community members around the world.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[rgb(var(--color-muted))]">Loading...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {homes.map((home) => (
              <article
                key={home.id}
                onClick={() => router.push("/login")}
                className="group overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={home.photos?.[0] || "/icon/cozy_home.jpg"}
                    alt={home.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-sm border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Verified</span>
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex items-center text-xs sm:text-sm text-[rgb(var(--color-muted))] mb-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    <span>{home.city}, {home.country}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-3">
                    {home.title}
                  </h3>
                  <div className="mt-auto pt-2 border-t border-[rgb(var(--color-border))] flex items-center gap-4 text-xs sm:text-sm text-[rgb(var(--color-muted))]">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{home.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{home.beds} beds</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-full border border-[rgb(var(--color-primary))] bg-transparent text-sm font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-foreground))] transition"
          >
            View all properties
          </button>
        </div>
      </div>
    </section>
  );
}