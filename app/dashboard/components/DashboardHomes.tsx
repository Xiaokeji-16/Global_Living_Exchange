// app/dashboard/components/YourHomes.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function YourHomes() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

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
      pending: { text: "Pending", color: "bg-yellow-100 text-yellow-700" },
      approved: { text: "Active", color: "bg-emerald-100 text-emerald-700" },
      rejected: { text: "Draft", color: "bg-gray-100 text-gray-700" },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-white p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-[rgb(var(--color-muted))]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-white p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">Your homes</h2>
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
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            + Upload your first home
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex gap-4 p-4 rounded-xl border border-[rgb(var(--color-border))] hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/homes/${property.id}`)}
            >
              {/* 房产图片 */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                {property.photos && property.photos.length > 0 ? (
                  <Image
                    src={property.photos[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No photo</span>
                  </div>
                )}
              </div>

              {/* 房产信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">
                      {property.title}
                    </h3>
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
      )}
    </div>
  );
}