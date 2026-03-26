// app/dashboard/components/YourHomes.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

type Property = {
  id: number;
  title: string;
  city: string;
  country: string;
  property_type: string;
  guests: number;
  photos: string[];
  verification_status: string;
};

export default function DashboardHomes() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setProperties([]);
      setLoading(false);
      return;
    }

    loadProperties();
  }, [isLoaded, isSignedIn]);

  const loadProperties = async () => {
    try {
      const res = await fetch("/api/properties/my-homes");
      if (!res.ok) throw new Error("Failed to load properties");
      const data = await res.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { text: "Draft", color: "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200" },
      pending: { text: "Pending review", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200" },
      approved: { text: "Active", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" },
      rejected: { text: "Rejected", color: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200" },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const displayed = properties.slice(0, 3);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-[rgb(var(--color-muted))]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">My homes</h2>
        <button
          onClick={() => router.push("/upload-home")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-primary))] hover:underline"
        >
          + Upload new home
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[rgb(var(--color-muted))] mb-4">
            You haven&apos;t uploaded any homes yet.
          </p>
          <button
            onClick={() => router.push("/upload-home")}
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition"
          >
            + Upload your first home
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayed.map((property) => (
              <div
                key={property.id}
                className="flex gap-4 p-4 rounded-xl border border-[rgb(var(--color-border))] hover:shadow-md transition cursor-pointer"
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                  {property.photos && property.photos.length > 0 ? (
                    <Image
                      src={property.photos[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[rgb(var(--color-secondary))]">
                      <span className="text-xs text-[rgb(var(--color-muted))]">No photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                      <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
                        {property.city}, {property.country}
                      </p>
                      <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
                        {property.property_type} • {property.guests} Guests
                      </p>
                    </div>
                    {getStatusBadge(property.verification_status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {properties.length > 3 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => router.push("/dashboard/my-homes")}
                className="rounded-full border border-[rgb(var(--color-border))] px-6 py-2 text-sm text-[rgb(var(--color-muted))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition"
              >
                Show all {properties.length} homes →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
