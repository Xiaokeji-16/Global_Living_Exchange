// app/properties/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Users as UsersIcon, BedDouble } from "lucide-react";

import { Header } from "../../components/Header";
import { MOCK_PROPERTIES, type Property } from "../lib/propertyData";

/**
 * 详情页：/properties/[id]
 */
export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // 主题逻辑和列表页保持一致（可以复制你列表页那段）
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 根据 id 找到对应的 property
  const idNumber = Number(params.id);
  const property: Property | undefined = MOCK_PROPERTIES.find(
    (p) => p.id === idNumber
  );

  if (!property) {
    // 如果找不到，就简单返回一个提示（后面可以改成 notFound()）
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Property {params.id} not found.</p>
      </div>
    );
  }

  const { city, country, title, guests, beds, imageSrc, referencePoints } =
    property;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 顶部返回 */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition"
        >
          ← Back to search
        </button>

        {/* 标题 + 地点 */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]">
            <MapPin className="w-4 h-4" />
            <span>
              {city}, {country}
            </span>
          </div>
        </header>

        {/* 上半部分：大图 + 右侧信息（简单版） */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] mb-8">
          {/* 大图区域 */}
          <div className="relative w-full h-64 sm:h-80 lg:h-[420px] overflow-hidden rounded-2xl">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
            />
          </div>

          {/* 右侧 info + 积分卡片（先做个占位） */}
          <aside className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 flex flex-col justify-between">
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))] font-semibold">
                  GL
                </div>
                <div>
                  <p className="font-medium">Hosted by Global Living</p>
                  <p className="text-[rgb(var(--color-muted))] text-xs">
                    Verified Member
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="rounded-xl bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] p-3 flex flex-col gap-1">
                  <span className="text-[rgb(var(--color-muted))]">
                    Guests
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <UsersIcon className="w-4 h-4" />
                    {guests}
                  </span>
                </div>
                <div className="rounded-xl bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] p-3 flex flex-col gap-1">
                  <span className="text-[rgb(var(--color-muted))]">
                    Beds
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <BedDouble className="w-4 h-4" />
                    {beds}
                  </span>
                </div>
                <div className="rounded-xl bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] p-3 flex flex-col gap-1">
                  <span className="text-[rgb(var(--color-muted))]">
                    Reference
                  </span>
                  <span className="font-medium">
                    {referencePoints ? `${referencePoints} pts` : "Est."}
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-4 w-full rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-2 text-sm font-medium hover:opacity-90 transition">
              Contact platform to request
            </button>
          </aside>
        </section>

        {/* 下半部分：描述占位（之后可以再根据 PRD 填内容） */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              About this home
            </h2>
            <p className="text-sm text-[rgb(var(--color-muted))] leading-relaxed">
              This is a placeholder description for the property detail
              page. Later we can replace this text with real content from
              your PRD: lifestyle description, neighbourhood highlights,
              verification notes, etc.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">
              What this place offers
            </h2>
            <ul className="text-sm text-[rgb(var(--color-muted))] space-y-1">
              <li>Fast Wi-Fi</li>
              <li>Dedicated workspace</li>
              <li>Fully equipped kitchen</li>
              <li>Secure vetting process</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}