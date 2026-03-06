// app/properties/components/PropertyDetailMainInfo.tsx
import {
  Users as UsersIcon,
  BedDouble,
  Bath,
  Calendar,
} from "lucide-react";
import type { Property } from "../lib/propertyData";

type Props = {
  property: Property;
};

export function PropertyDetailMainInfo({ property }: Props) {
  const tags = property.tags ?? [];

  return (
    <div className="space-y-6">
      {/* Host / 统计卡片 */}
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Hosted by Elena R.</h2>
            <p className="text-xs text-[rgb(var(--color-muted))]">
              Joined in 2021 · Verified Member
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))] text-sm font-semibold">
            ER
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[rgb(var(--color-muted))]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[rgb(var(--color-foreground))]">
              <UsersIcon className="w-3 h-3" />
              <span className="font-medium">{property.guests} Guests</span>
            </div>
            <p>Capacity</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[rgb(var(--color-foreground))]">
              <BedDouble className="w-3 h-3" />
              <span className="font-medium">{property.beds} Beds</span>
            </div>
            <p>Bedrooms</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[rgb(var(--color-foreground))]">
              <Bath className="w-3 h-3" />
              <span className="font-medium">1 Bath</span>
            </div>
            <p>Full bath</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[rgb(var(--color-foreground))]">
              <span className="text-xs font-semibold">65 m²</span>
            </div>
            <p>Size</p>
          </div>
        </div>
      </div>

      {/* About this home */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">About this home</h2>
        <p className="text-sm text-[rgb(var(--color-muted))] leading-relaxed">
          Experience the authentic lifestyle of {property.city} in this
          thoughtfully designed home. Perfect for mid- to long-term stays, with
          a comfortable living area and dedicated workspace. Walking distance to
          local markets, cafes, and public transport.
        </p>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">What this place offers</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm text-[rgb(var(--color-muted))]">
          <p>• Fast Wi-Fi</p>
          <p>• Dedicated workspace</p>
          <p>• Fully equipped kitchen</p>
          <p>• Air conditioning</p>
          <p>• Security system</p>
          <p>• Weekly cleaning included</p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[rgb(var(--color-secondary))] px-3 py-1 text-xs text-[rgb(var(--color-secondary-foreground))]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Availability 占位 */}
      <div className="mt-4 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" />
          <h2 className="font-semibold">Availability</h2>
        </div>
        <p className="text-[rgb(var(--color-muted))]">
          This home is available for mid- to long-term stays. Exact dates and
          exchange terms will be confirmed by our team.
        </p>
      </div>
    </div>
  );
}