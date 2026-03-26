"use client";

import {
  Users as UsersIcon,
  BedDouble,
  Bath,
  Home,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type PropertyDetail,
  formatPropertyLabel,
  splitHouseRules,
} from "../lib/propertyData";
import { formatAmenityLabel, getAmenityIcon } from "../lib/amenities";

type Props = {
  property: PropertyDetail;
};

export function PropertyDetailMainInfo({ property }: Props) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const amenities = property.tags ?? [];
  const description = property.description?.trim() ||
    "The host has not added a detailed description for this home yet.";
  const descriptionPreview = useMemo(() => {
    if (description.length <= 240) return description;
    return `${description.slice(0, 240).trim()}...`;
  }, [description]);
  const hasLongDescription = description.length > 240;
  const visibleAmenities = amenities.slice(0, 6);
  const detailItems = [
    {
      label: "Home type",
      value: property.propertyType ? formatPropertyLabel(property.propertyType) : "",
    },
    {
      label: "Stay category",
      value: property.stayCategory ? formatPropertyLabel(property.stayCategory) : "",
    },
    {
      label: "Verification",
      value: property.verified ? "Verified listing" : "Pending review",
    },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const ruleItems = splitHouseRules(property.houseRules);

  return (
    <div className="space-y-6">
      {/* Listing overview */}
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Listing overview</h2>
            <p className="text-xs text-[rgb(var(--color-muted))]">
              Real-time details from the approved property listing.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))] text-sm font-semibold">
            <Home className="h-4 w-4" />
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
              <span className="font-medium">{property.bedrooms ?? property.beds} Bedrooms</span>
            </div>
            <p>Sleeping rooms</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[rgb(var(--color-foreground))]">
              <Bath className="w-3 h-3" />
              <span className="font-medium">
                {property.bathrooms ?? "-"} Bath
                {property.bathrooms === 1 ? "" : "s"}
              </span>
            </div>
            <p>Bathrooms</p>
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[rgb(var(--color-foreground))]">
              <BedDouble className="w-3 h-3" />
              <span className="font-medium">{property.beds} Beds</span>
            </div>
            <p>Total beds</p>
          </div>
        </div>
      </div>

      {/* About this home */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold">About this space</h2>
        <p className="text-sm text-[rgb(var(--color-muted))] leading-relaxed whitespace-pre-wrap">
          {descriptionPreview}
        </p>
        {hasLongDescription && (
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="inline-flex items-center rounded-full border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] transition hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]"
          >
            Show more
          </button>
        )}
      </div>

      {detailItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Listing details</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {detailItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4"
              >
                <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-muted))]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-[rgb(var(--color-foreground))]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {amenities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-[rgb(var(--color-primary))]" />
            <h2 className="text-base font-semibold">What this place offers</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {visibleAmenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity);

              return (
                <div
                  key={amenity}
                  className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-3"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-[rgb(var(--color-foreground))]">
                    {formatAmenityLabel(amenity)}
                  </span>
                </div>
              );
            })}
          </div>
          {amenities.length > visibleAmenities.length && (
            <button
              type="button"
              onClick={() => setAmenitiesOpen(true)}
              className="inline-flex items-center rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-5 py-3 text-sm font-medium text-[rgb(var(--color-foreground))] transition hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))]"
            >
              Show all {amenities.length} amenities
            </button>
          )}
        </div>
      )}

      {ruleItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[rgb(var(--color-primary))]" />
            <h2 className="text-base font-semibold">House rules</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 text-sm text-[rgb(var(--color-muted))]">
            {ruleItems.map((rule) => (
              <p key={rule}>• {rule}</p>
            ))}
          </div>
        </div>
      )}

      {aboutOpen && (
        <DetailModal title="About this space" onClose={() => setAboutOpen(false)}>
          <div className="space-y-4 text-sm leading-relaxed text-[rgb(var(--color-muted))]">
            {description
              .split(/\n{2,}/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
        </DetailModal>
      )}

      {amenitiesOpen && (
        <DetailModal title="What this place offers" onClose={() => setAmenitiesOpen(false)}>
          <div className="grid gap-3 sm:grid-cols-2">
            {amenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity);

              return (
                <div
                  key={amenity}
                  className="flex items-center gap-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-3"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-secondary-foreground))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-[rgb(var(--color-foreground))]">
                    {formatAmenityLabel(amenity)}
                  </span>
                </div>
              );
            })}
          </div>
        </DetailModal>
      )}
    </div>
  );
}

function DetailModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-[rgb(var(--color-background))] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[rgb(var(--color-muted))] transition hover:bg-[rgb(var(--color-card))] hover:text-[rgb(var(--color-foreground))]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="pr-10 text-2xl font-semibold text-[rgb(var(--color-foreground))]">
          {title}
        </h3>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
