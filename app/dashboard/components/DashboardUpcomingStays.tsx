// app/dashboard/components/DashboardUpcomingStays.tsx
"use client";

import Image from "next/image";
import type { UpcomingStay } from "../lib/dashboardData";

type Props = {
  stays: UpcomingStay[];
};

export default function DashboardUpcomingStays({ stays }: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--color-border))]">
        <h2 className="text-base sm:text-lg font-semibold">
          Upcoming stays & requests
        </h2>
      </div>

      <div className="divide-y divide-[rgb(var(--color-border))]">
        {stays.map((stay) => (
          <article
            key={stay.id}
            className="flex flex-col sm:flex-row gap-4 px-5 py-4"
          >
            {/* 左侧小图占位：你后面可以换成真实图片 */}
            <div className="relative h-32 w-full sm:w-40 overflow-hidden rounded-xl">
              <Image
                src="/icon/cozy_home.jpg"
                alt={stay.city}
              fill
              className="object-cover"
              />
            </div>

            {/* 右侧文字 */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold">
                  {stay.city}, {stay.country}
                </h3>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium " +
                    (stay.status === "Confirmed"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-300")
                  }
                >
                  {stay.status}
                </span>
              </div>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                {stay.dateRange}
              </p>
              <p className="text-xs text-[rgb(var(--color-muted))] mt-1">
                {stay.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}