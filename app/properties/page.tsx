// app/properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";

// 这三个是你刚刚拆出去的组件
import PropertySearchBar from "./components/PropertySearchBar";
import PropertyListSection from "./components/PropertyListSection";
import PointsMapSection from "./components/PointsMapSection";

import type { PropertyFilters } from "./lib/propertyData";

export default function PropertiesPage() {
  // 主题（和首页保持一致）
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 切换 html 上的 .dark class
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement; // <html>

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 当前生效的筛选条件
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

        {/* 主体：左边列表 + 右边积分 map */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <PropertyListSection filters={filters} />
          <PointsMapSection />
        </section>
      </main>
    </div>
  );
}