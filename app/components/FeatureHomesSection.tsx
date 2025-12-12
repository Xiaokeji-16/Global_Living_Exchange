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
  imageSrc: string;
};

const featuredHomes: Home[] = [
  {
    id: 1,
    city: "Barcelona",
    country: "Spain",
    title: "Modern Downtown Apartment",
    guests: 4,
    beds: 2,
    imageSrc: "/icon/cozy_home.jpg",
  },
  {
    id: 2,
    city: "Aspen",
    country: "USA",
    title: "Mountain Cabin Retreat",
    guests: 5,
    beds: 3,
    imageSrc: "/icon/cozy_home.jpg",
  },
  {
    id: 3,
    city: "Paris",
    country: "France",
    title: "Charming Studio",
    guests: 2,
    beds: 1,
    imageSrc: "/icon/cozy_home.jpg",
  },
  {
    id: 4,
    city: "Bali",
    country: "Indonesia",
    title: "Beachfront Villa",
    guests: 8,
    beds: 4,
    imageSrc: "/icon/cozy_home.jpg",
  },
  {
    id: 5,
    city: "Amsterdam",
    country: "Netherlands",
    title: "Cozy City Loft",
    guests: 2,
    beds: 1,
    imageSrc: "/icon/cozy_home.jpg",
  },
  {
    id: 6,
    city: "Los Angeles",
    country: "USA",
    title: "Luxury Family Home",
    guests: 6,
    beds: 3,
    imageSrc: "/icon/cozy_home.jpg",
  },
];

export function FeaturedHomesSection() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 这里用你登录时设置的 localStorage key
  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = localStorage.getItem("gle_is_logged_in");
      setIsLoggedIn(flag === "true");
    }
  }, []);

  const handleViewAllClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/properties");
    }
  };

  return (
    <section
      id="properties"
      className="py-16 sm:py-20 lg:py-24 bg-[rgb(var(--color-background))]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-foreground))]">
            Featured homes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-2xl mx-auto">
            Discover unique homes from our verified community members around
            the world.
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid gap-6 md:grid-cols-3">
          {featuredHomes.map((home) => (
            <article
              key={home.id}
              className="group overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* 图片 + Verified badge */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={home.imageSrc}
                  alt={home.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[rgb(var(--color-card))]/90 px-3 py-1 text-xs font-medium shadow-md border border-[rgb(var(--color-border))]">
                  <ShieldCheck className="w-3 h-3 text-[rgb(var(--color-primary))]" />
                  <span className="text-[rgb(var(--color-foreground))]">
                    Verified
                  </span>
                </div>
              </div>

              {/* 文本区域 */}
              <div className="flex flex-col flex-1 px-4 py-4 sm:px-5 sm:py-5">
                {/* 位置 */}
                <div className="flex items-center text-xs sm:text-sm text-[rgb(var(--color-muted))] mb-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  <span>
                    {home.city}, {home.country}
                  </span>
                </div>

                {/* 标题 */}
                <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-3">
                  {home.title}
                </h3>

                {/* 底部 meta 行 */}
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

        {/* 底部按钮 */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleViewAllClick}
            className="px-8 py-3 rounded-full border border-[rgb(var(--color-primary))] bg-transparent text-sm font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-foreground))] transition"
          >
            View all properties
          </button>
        </div>
      </div>
    </section>
  );
}