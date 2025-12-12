"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Search,
  Calendar,
  Users as UsersIcon,
  Heart,
  MapPin,
  BedDouble,
} from "lucide-react";

// 临时假数据：之后可以改成从后端/API 获取
const MOCK_PROPERTIES = [
  {
    id: 1,
    city: "Lisbon",
    country: "Portugal",
    title: "Penthouse with Sea View",
    guests: 6,
    beds: 3,
    referencePoints: 800,
    tags: ["Luxury", "Family friendly"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
  {
    id: 2,
    city: "Amsterdam",
    country: "Netherlands",
    title: "Cozy Canal-side Loft",
    guests: 2,
    beds: 1,
    referencePoints: 520,
    tags: ["City center"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
  {
    id: 3,
    city: "Bali",
    country: "Indonesia",
    title: "Beachfront Villa Retreat",
    guests: 8,
    beds: 4,
    referencePoints: undefined, // 没有估值时，展示 “Points estimation pending”
    tags: ["Beach", "Long stay"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
];

type Property = (typeof MOCK_PROPERTIES)[number];

export default function PropertiesPage() {
  // 跟首页相同的主题逻辑
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

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 顶部搜索条 */}
        <PropertySearchBar />

        {/* 主内容：左列表 + 右地图 */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* 左：房源列表 */}
          <PropertyListSection />

          {/* 右：地图 / 积分气泡占位 */}
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 text-sm text-[rgb(var(--color-muted))]">
            这里是地图 / 积分气泡（Points map）——之后再做出你 Figma 中
            450 / 520 / 800 / Est. 的气泡效果。
          </div>
        </section>
      </main>

    </div>
  );
}

/**
 * 顶部搜索 / 筛选条
 */
function PropertySearchBar() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 之后接入真正筛选逻辑，这里先简单 log
    console.log("Search clicked");
  };

  return (
    <section aria-label="Property search filters">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 lg:flex-row lg:items-center"
      >
        {/* 左：大搜索条 */}
        <div className="flex-1 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-4">
          {/* Destination */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-4 h-4 text-[rgb(var(--color-muted))]" />
            <input
              type="text"
              placeholder="Destination (City/Country)"
              className="bg-transparent border-none outline-none text-sm sm:text-base w-full placeholder:text-[rgb(var(--color-muted))]"
            />
          </div>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Dates */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]"
          >
            <Calendar className="w-4 h-4" />
            <span>Any dates</span>
          </button>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Guests */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]"
          >
            <UsersIcon className="w-4 h-4" />
            <span>Guests</span>
          </button>

          {/* Search 按钮 */}
          <button
            type="submit"
            className="ml-auto rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] px-6 sm:px-8 py-2 text-sm sm:text-base font-medium hover:opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* 右：Type / Points Range / More Filters */}
        <div className="flex gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">🏠</span>
            <span>Type</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">◎</span>
            <span>Points Range</span>
          </button>

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

/**
 * 房源列表 + Load more
 */
function PropertyListSection() {
  return (
    <section aria-label="Property results">
      <div className="grid gap-5 md:grid-cols-2">
        {MOCK_PROPERTIES.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition">
          Load more properties
        </button>
      </div>
    </section>
  );
}

/**
 * 单个房源卡片
 */
function PropertyCard({ property }: { property: Property }) {
  const {
    city,
    country,
    title,
    guests,
    beds,
    referencePoints,
    tags,
    imageSrc,
    verified,
  } = property;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm hover:shadow-md hover:border-[rgb(var(--color-primary))]/60 transition">
      {/* 图片区域 */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 收藏心形（先做 UI，不接逻辑） */}
        <button
          type="button"
          className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/70"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Verified 徽标 */}
        {verified && (
          <span className="absolute right-3 top-3 rounded-full bg-[rgb(var(--color-primary))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-primary-foreground))] shadow">
            VERIFIED
          </span>
        )}
      </div>

      {/* 文本区域 */}
      <div className="p-4 space-y-2">
        {/* 地点 */}
        <div className="flex items-center gap-1 text-xs text-[rgb(var(--color-muted))]">
          <MapPin className="w-3 h-3" />
          <span>
            {city}, {country}
          </span>
        </div>

        {/* 标题 */}
        <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))]">
          {title}
        </h3>

        {/* guests / beds */}
        <div className="mt-1 flex items-center gap-4 text-xs text-[rgb(var(--color-muted))]">
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="w-3 h-3" />
            {guests} guests
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble className="w-3 h-3" />
            {beds} beds
          </span>
        </div>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[rgb(var(--color-secondary))] px-2 py-1 text-xs text-[rgb(var(--color-secondary-foreground))]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 底部参考积分 */}
        <div className="mt-3 border-t border-[rgb(var(--color-border))] pt-3 text-xs text-[rgb(var(--color-muted))] flex items-baseline gap-1">
          <span className="mr-1">Reference</span>
          {referencePoints ? (
            <>
              <span className="font-semibold text-[rgb(var(--color-foreground))]">
                {referencePoints} pts
              </span>
              <span>/night</span>
            </>
          ) : (
            <span className="italic">Points estimation pending</span>
          )}
        </div>
      </div>
    </article>
  );
}