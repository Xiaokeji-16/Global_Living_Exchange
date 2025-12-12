// app/properties/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Header } from "../components/Header";
import PropertyCard from "./components/PropertyCard";
import { MOCK_PROPERTIES, type Property } from "./lib/propertyData";
import {
  Search,
  Calendar,
  Users as UsersIcon,
  MapPin,
} from "lucide-react";

/**
 * 顶部筛选条用到的类型
 */
type PropertyFilters = {
  query: string; // 目的地搜索文本
  type: "all" | "luxury" | "beach" | "city";
  pointsRange: "any" | "0-600" | "600-700" | "700+";
};

export default function PropertiesPage() {
  // 主题和首页保持一致
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  // 当前真正生效的筛选条件
  const [filters, setFilters] = useState<PropertyFilters>({
    query: "",
    type: "all",
    pointsRange: "any",
  });

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 顶部搜索条 */}
        <PropertySearchBar filters={filters} onApply={setFilters} />

        {/* 主体：左列表 + 右侧积分“地图” */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <PropertyListSection filters={filters} />
          <PointsMapSection />
        </section>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 顶部搜索 / 筛选条                                                        */
/* ------------------------------------------------------------------ */

function PropertySearchBar({
  filters,
  onApply,
}: {
  filters: PropertyFilters;
  onApply: (next: PropertyFilters) => void;
}) {
  // 表单内部自己的状态，用户点 Search 才真正提交给父组件
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  // 外部 filters 变了时，同步到本地（比如点击 Clear 等场景）
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApply(localFilters);
  };

  const typeLabelMap: Record<PropertyFilters["type"], string> = {
    all: "All",
    luxury: "Luxury",
    beach: "Beach",
    city: "City",
  };

  const pointsLabelMap: Record<PropertyFilters["pointsRange"], string> = {
    any: "Any",
    "0-600": "0–600 pts",
    "600-700": "600–700 pts",
    "700+": "700+ pts",
  };

  const typeCycle: PropertyFilters["type"][] = [
    "all",
    "luxury",
    "beach",
    "city",
  ];

  const pointsCycle: PropertyFilters["pointsRange"][] = [
    "any",
    "0-600",
    "600-700",
    "700+",
  ];

  const handleCycleType = () => {
    setLocalFilters((prev) => {
      const index = typeCycle.indexOf(prev.type);
      const next = typeCycle[(index + 1) % typeCycle.length];
      return { ...prev, type: next };
    });
  };

  const handleCyclePointsRange = () => {
    setLocalFilters((prev) => {
      const index = pointsCycle.indexOf(prev.pointsRange);
      const next = pointsCycle[(index + 1) % pointsCycle.length];
      return { ...prev, pointsRange: next };
    });
  };

  return (
    <section aria-label="Property search filters">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 lg:flex-row lg:items-center"
      >
        {/* 左：目的地 + 日期 + Guests + Search */}
        <div className="flex-1 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-4">
          {/* Destination */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-[rgb(var(--color-muted))]" />
            <input
              type="text"
              placeholder="Destination (City/Country)"
              value={localFilters.query}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  query: e.target.value,
                }))
              }
              className="bg-transparent border-none outline-none text-sm sm:text-base w-full placeholder:text-[rgb(var(--color-muted))]"
            />
          </div>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Dates：目前只是展示占位，不参与筛选 */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]"
          >
            <Calendar className="w-4 h-4" />
            <span>Any dates</span>
          </button>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Guests：目前只是展示占位 */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]"
          >
            <UsersIcon className="w-4 h-4" />
            <span>Guests</span>
          </button>

          {/* Search 按钮：提交 localFilters */}
          <button
            type="submit"
            className="ml-auto rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] px-6 sm:px-8 py-2 text-sm sm:text-base font-medium hover:opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* 右：Type / Points Range / More Filters */}
        <div className="flex gap-3">
          {/* Type：在 All / Luxury / Beach / City 之间切换 */}
          <button
            type="button"
            onClick={handleCycleType}
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">🏠</span>
            <span>Type: {typeLabelMap[localFilters.type]}</span>
          </button>

          {/* Points Range：在几档积分区间间切换 */}
          <button
            type="button"
            onClick={handleCyclePointsRange}
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">◎</span>
            <span>Points: {pointsLabelMap[localFilters.pointsRange]}</span>
          </button>

          {/* More Filters：占位，将来再加额外条件 */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">⚙️</span>
            <span>More Filters</span>
          </button>
        </div>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 左侧房源列表                                                            */
/* ------------------------------------------------------------------ */

function PropertyListSection({ filters }: { filters: PropertyFilters }) {
  const filtered = MOCK_PROPERTIES.filter((p) =>
    matchesFilters(p, filters)
  );

  return (
    <section aria-label="Property results">
      <div className="grid gap-5 md:grid-cols-2">
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
              href={`/properties/${p.id}`} // 点击进入详情页
            />
          ))
        )}
      </div>

      {/* Load more 占位按钮 */}
      <div className="flex justify-center mt-6">
        <button className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition">
          Load more properties
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 右侧积分“地图”                                                          */
/* ------------------------------------------------------------------ */

function PointsMapSection() {
  const bubbles: { id: number; label: string; top: string; left: string }[] = [
    { id: 1, label: "520", top: "18%", left: "55%" },
    { id: 2, label: "450", top: "45%", left: "40%" },
    { id: 3, label: "800", top: "42%", left: "70%" },
    { id: 4, label: "620", top: "65%", left: "60%" },
    { id: 5, label: "Est.", top: "75%", left: "30%" },
  ];

  return (
    <section
      aria-label="Points map"
      className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5"
    >
      <div className="mb-3 text-sm font-medium text-[rgb(var(--color-foreground))]">
        Points overview
      </div>

      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top,_#020617,_#020617_40%,_#020617)]">
        {/* 背景弧线 / 网格 */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full border border-[rgb(var(--color-border))]/30" />
        <div className="pointer-events-none absolute -top-10 left-10 h-96 w-96 rounded-full border border-[rgb(var(--color-border))]/20" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full border border-[rgb(var(--color-border))]/15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(148,163,184,0.15)_1px,_transparent_1px)] bg-[length:22px_22px] opacity-20" />

        {/* 积分气泡 */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="absolute"
            style={{ top: b.top, left: b.left }}
          >
            <div className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-foreground))] shadow-sm shadow-black/40">
              {b.label === "Est." ? (
                <span className="text-[rgb(var(--color-muted))]">Est.</span>
              ) : (
                <span>{b.label}</span>
              )}
            </div>
          </div>
        ))}

        {/* 右下角定位小按钮 */}
        <button
          type="button"
          className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-foreground))] shadow-md shadow-black/50 hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 过滤逻辑：根据 filters 判断某个 property 是否保留                          */
/* ------------------------------------------------------------------ */

function matchesFilters(property: Property, filters: PropertyFilters): boolean {
  const { query, type, pointsRange } = filters;

  // 1. 文本匹配：city / country / title
  const q = query.trim().toLowerCase();
  if (q) {
    const inCity = property.city.toLowerCase().includes(q);
    const inCountry = property.country.toLowerCase().includes(q);
    const inTitle = property.title.toLowerCase().includes(q);
    if (!inCity && !inCountry && !inTitle) {
      return false;
    }
  }

  // 2. 类型：根据 tags 简单匹配
  if (type !== "all") {
    const tagsLower = (property.tags ?? []).map((t) => t.toLowerCase());
    if (type === "luxury" && !tagsLower.includes("luxury")) return false;
    if (type === "beach" && !tagsLower.includes("beach")) return false;
    if (type === "city" && !tagsLower.some((t) => t.includes("city")))
      return false;
  }

  // 3. 积分区间（只对有 referencePoints 的生效）
  const pts = property.referencePoints;
  if (pointsRange !== "any" && typeof pts === "number") {
    if (pointsRange === "0-600" && !(pts <= 600)) return false;
    if (pointsRange === "600-700" && !(pts >= 600 && pts <= 700)) return false;
    if (pointsRange === "700+" && !(pts >= 700)) return false;
  }

  return true;
}