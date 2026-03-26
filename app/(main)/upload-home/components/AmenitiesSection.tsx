"use client";

import { useState } from "react";
import {
  AMENITY_OPTIONS,
  type AmenityCategory,
  getAmenityIcon,
} from "../../properties/lib/amenities";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
};

const CATEGORY_ORDER: AmenityCategory[] = [
  "Essentials",
  "Kitchen & dining",
  "Bathroom & laundry",
  "Comfort",
  "Work & family",
  "Outdoors & views",
  "Safety & access",
  "Parking & services",
];

const groupedAmenities = AMENITY_OPTIONS.reduce<
  Record<AmenityCategory, typeof AMENITY_OPTIONS>
>(
  (acc, amenity) => {
    acc[amenity.category].push(amenity);
    return acc;
  },
  {
    Essentials: [],
    "Kitchen & dining": [],
    "Bathroom & laundry": [],
    Comfort: [],
    "Work & family": [],
    "Outdoors & views": [],
    "Safety & access": [],
    "Parking & services": [],
  }
);

export function AmenitiesSection({ value, onChange }: Props) {
  const [activeCategory, setActiveCategory] =
    useState<AmenityCategory>("Essentials");

  const toggleAmenity = (amenityId: string) => {
    if (value.includes(amenityId)) {
      onChange(value.filter((item) => item !== amenityId));
      return;
    }

    onChange([...value, amenityId]);
  };

  const selectedAmenities = AMENITY_OPTIONS.filter((amenity) =>
    value.includes(amenity.id)
  );

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-5">
      <div>
        <h2 className="text-base sm:text-lg font-semibold">Amenities</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
          Choose the amenities guests can expect. Browse by category instead of
          seeing every option at once.
        </p>
        <p className="mt-2 text-xs text-[rgb(var(--color-muted))]">
          {value.length} selected
        </p>
      </div>

      {selectedAmenities.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[rgb(var(--color-muted))]">
            Selected
          </p>
        <div className="flex flex-wrap gap-2">
          {selectedAmenities.slice(0, 8).map((amenity) => {
            const Icon = getAmenityIcon(amenity.id);

            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-primary))]/20 bg-[rgb(var(--color-primary))]/8 px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-foreground))] transition hover:border-[rgb(var(--color-primary))]/40"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{amenity.label}</span>
              </button>
            );
          })}
            {selectedAmenities.length > 8 && (
              <span className="rounded-full border border-[rgb(var(--color-border))] px-3 py-1.5 text-xs text-[rgb(var(--color-muted))]">
                +{selectedAmenities.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[rgb(var(--color-muted))]">
          Browse categories
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((category) => {
            const selectedCount = groupedAmenities[category].filter((amenity) =>
              value.includes(amenity.id)
            ).length;
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/8 text-[rgb(var(--color-foreground))]"
                    : "border-[rgb(var(--color-border))] text-[rgb(var(--color-muted))] hover:border-[rgb(var(--color-primary))]/40 hover:text-[rgb(var(--color-foreground))]"
                }`}
              >
                {category}
                {selectedCount > 0 ? ` (${selectedCount})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/40 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
              {activeCategory}
            </h3>
            <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
              {groupedAmenities[activeCategory].length} options in this section
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groupedAmenities[activeCategory].map((amenity) => {
            const selected = value.includes(amenity.id);
            const Icon = getAmenityIcon(amenity.id);

            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/8 text-[rgb(var(--color-foreground))]"
                    : "border-[rgb(var(--color-border))] bg-transparent text-[rgb(var(--color-muted))] hover:border-[rgb(var(--color-primary))]/50"
                }`}
              >
                <span className="flex items-center gap-2.5 font-medium">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{amenity.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
