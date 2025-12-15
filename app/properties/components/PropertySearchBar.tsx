// app/properties/components/PropertySearchBar.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Search, Calendar, Users as UsersIcon } from "lucide-react";
import type { PropertyFilters } from "../lib/propertyData";

type Props = {
  filters: PropertyFilters;
  onApply: (next: PropertyFilters) => void;
};

export default function PropertySearchBar({ filters, onApply }: Props) {
  // 本地表单状态
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  // 外部 filters 变化时，同步到表单里
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

  const typeCycle: PropertyFilters["type"][] = ["all", "luxury", "beach", "city"];
  const pointsCycle: PropertyFilters["pointsRange"][] = [
    "any",
    "0-600",
    "600-700",
    "700+",
  ];

  // ⭐ 显式写 prev: PropertyFilters
  const handleCycleType = () => {
    setLocalFilters((prev: PropertyFilters) => {
      const index = typeCycle.indexOf(prev.type);
      const next = typeCycle[(index + 1) % typeCycle.length];
      return { ...prev, type: next };
    });
  };

  const handleCyclePointsRange = () => {
    setLocalFilters((prev: PropertyFilters) => {
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
                setLocalFilters((prev: PropertyFilters) => ({
                  ...prev,
                  query: e.target.value,
                }))
              }
              className="bg-transparent border-none outline-none text-sm sm:text-base w-full placeholder:text-[rgb(var(--color-muted))]"
            />
          </div>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Dates：现在只是 UI 占位 */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]"
          >
            <Calendar className="w-4 h-4" />
            <span>Any dates</span>
          </button>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Guests：同样只是 UI 占位 */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]"
          >
            <UsersIcon className="w-4 h-4" />
            <span>Guests</span>
          </button>

          {/* Search 提交按钮 */}
          <button
            type="submit"
            className="ml-auto rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] px-6 sm:px-8 py-2 text-sm sm:text-base font-medium hover:opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* 右：Type / Points Range / More Filters */}
        <div className="flex gap-3">
          {/* Type 过滤 */}
          <button
            type="button"
            onClick={handleCycleType}
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">🏠</span>
            <span>Type: {typeLabelMap[localFilters.type]}</span>
          </button>

          {/* Points Range 过滤 */}
          <button
            type="button"
            onClick={handleCyclePointsRange}
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <span className="text-[rgb(var(--color-muted))]">◎</span>
            <span>Points: {pointsLabelMap[localFilters.pointsRange]}</span>
          </button>

          {/* More Filters 占位 */}
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