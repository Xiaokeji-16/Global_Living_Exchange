// app/properties/page.tsx
"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme"


import PropertySearchBar from "./components/PropertySearchBar";
import PropertyListSection from "./components/PropertyListSection"
import type { PropertyFilters } from "./lib/propertyData";

export default function PropertiesPage() {
  // 主题（和首页保持一致）
  const { theme, toggleTheme } = useTheme();

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
        <section className="mt-8">
          <PropertyListSection filters={filters} mode="public"/>
        </section>
      </main>
    </div>
  );
}