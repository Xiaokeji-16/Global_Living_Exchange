// app/dashboard/components/DashboardHomes.tsx
"use client";

import Image from "next/image";
import type { HomeItem } from "../lib/dashboardData";

type Props = {
  homes: HomeItem[];
};

export default function DashboardHomes({ homes }: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--color-border))]">
        <h2 className="text-base sm:text-lg font-semibold">Your homes</h2>
        <button className="text-xs font-medium text-[rgb(var(--color-primary))] hover:underline">
          + Upload new home
        </button>
      </div>

      <div className="divide-y divide-[rgb(var(--color-border))]">
        {homes.map((home) => (
          <article
            key={home.id}
            className="flex gap-4 px-5 py-4"
          >
            <div className="relative h-20 w-28 overflow-hidden rounded-xl flex-shrink-0">
              <Image
                src={home.imageSrc}
                alt={home.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{home.title}</h3>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium " +
                    (home.status === "Active"
                      ? "bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-primary))]"
                      : "bg-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]")
                  }
                >
                  {home.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
                {home.city}, {home.country}
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
                {home.stayType} • {home.guests} Guests
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}