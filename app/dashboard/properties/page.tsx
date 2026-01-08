// app/dashboard/properties/page.tsx
"use client";

import { useState } from "react";
import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useLogout";


// 复用 property 页里的「内容组件」
import PropertySearchBar from "../../properties/components/PropertySearchBar";
import PropertyListSection from "../../properties/components/PropertyListSection";
import PointsMapSection from "../../properties/components/PointsMapSection";
import type { PropertyFilters } from "../../properties/lib/propertyData";

export default function DashboardPropertiesPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  // 当前筛选条件
  const [filters, setFilters] = useState<PropertyFilters>({
    query: "",
    type: "all",
    pointsRange: "any",
  });


  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 登录版导航：variant="authed" */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 顶部搜索条 */}
        <PropertySearchBar filters={filters} onApply={setFilters} />

        {/* 左列表 + 右侧积分图 */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <PropertyListSection filters={filters} />
          <PointsMapSection />
        </section>
      </main>
    </div>
  );
}