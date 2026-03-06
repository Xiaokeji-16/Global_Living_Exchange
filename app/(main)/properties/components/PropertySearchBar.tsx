// app/properties/components/PropertySearchBar.tsx
"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Search, Calendar, Users, Home, Coins, SlidersHorizontal, X } from "lucide-react";
import type { PropertyFilters } from "../lib/propertyData";

type Props = {
  filters: PropertyFilters;
  onApply: (next: PropertyFilters) => void;
};

export default function PropertySearchBar({ filters, onApply }: Props) {
  // 本地表单状态
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);
  
  // 下拉菜单状态
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  
  // 日期和人数的临时状态
  const [dateRange, setDateRange] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState(1);

  // Refs for click outside
  const datePickerRef = useRef<HTMLDivElement>(null);
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const moreFiltersRef = useRef<HTMLDivElement>(null);

  // 外部 filters 变化时，同步到表单里
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) {
        setShowGuestPicker(false);
      }
      if (moreFiltersRef.current && !moreFiltersRef.current.contains(event.target as Node)) {
        setShowMoreFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // 格式化日期显示
  const formatDateDisplay = () => {
    if (!dateRange.checkIn && !dateRange.checkOut) return "Any dates";
    if (dateRange.checkIn && dateRange.checkOut) {
      return `${new Date(dateRange.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(dateRange.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return "Select dates";
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

          {/* Dates 选择器 */}
          <div className="hidden sm:block relative" ref={datePickerRef}>
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition"
            >
              <Calendar className="w-4 h-4" />
              <span>{formatDateDisplay()}</span>
            </button>

            {showDatePicker && (
              <div className="absolute top-full mt-2 left-0 z-50 w-80 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Select dates</h3>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(false)}
                    className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Check-in</label>
                    <input
                      type="date"
                      value={dateRange.checkIn}
                      onChange={(e) => setDateRange(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Check-out</label>
                    <input
                      type="date"
                      value={dateRange.checkOut}
                      onChange={(e) => setDateRange(prev => ({ ...prev, checkOut: e.target.value }))}
                      min={dateRange.checkIn}
                      className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDateRange({ checkIn: "", checkOut: "" });
                      setShowDatePicker(false);
                    }}
                    className="w-full text-sm text-[rgb(var(--color-primary))] hover:underline"
                  >
                    Clear dates
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 分隔线 */}
          <div className="hidden sm:block h-6 w-px bg-[rgb(var(--color-border))]" />

          {/* Guests 选择器 */}
          <div className="hidden sm:block relative" ref={guestPickerRef}>
            <button
              type="button"
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition"
            >
              <Users className="w-4 h-4" />
              <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
            </button>

            {showGuestPicker && (
              <div className="absolute top-full mt-2 right-0 z-50 w-64 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Guests</h3>
                  <button
                    type="button"
                    onClick={() => setShowGuestPicker(false)}
                    className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Number of guests</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full border border-[rgb(var(--color-border))] flex items-center justify-center hover:border-[rgb(var(--color-primary))] transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(20, guests + 1))}
                      className="w-8 h-8 rounded-full border border-[rgb(var(--color-border))] flex items-center justify-center hover:border-[rgb(var(--color-primary))] transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

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
            <Home className="w-4 h-4 text-[rgb(var(--color-muted))]" />
            <span>Type: {typeLabelMap[localFilters.type]}</span>
          </button>

          {/* Points Range 过滤 */}
          <button
            type="button"
            onClick={handleCyclePointsRange}
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
          >
            <Coins className="w-4 h-4 text-[rgb(var(--color-muted))]" />
            <span>Points: {pointsLabelMap[localFilters.pointsRange]}</span>
          </button>

          {/* More Filters */}
          <div className="relative" ref={moreFiltersRef}>
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-2 text-sm text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] transition"
            >
              <SlidersHorizontal className="w-4 h-4 text-[rgb(var(--color-muted))]" />
              <span>More Filters</span>
            </button>

            {showMoreFilters && (
              <div className="absolute top-full mt-2 right-0 z-50 w-72 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Additional filters</h3>
                  <button
                    type="button"
                    onClick={() => setShowMoreFilters(false)}
                    className="text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <p className="text-[rgb(var(--color-muted))]">
                    More advanced filters coming soon...
                  </p>
                  {/* 未来可以在这里添加更多筛选选项 */}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}