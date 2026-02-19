// app/dashboard/components/DashboardUpcomingStays.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type StayRequest = {
  id: string;
  property_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  message?: string;
  created_at: string;
  property: {
    id: number;
    title: string;
    description: string;
    city: string;
    country: string;
    photos: string[];
  };
};

export default function DashboardUpcomingStays() {
  const router = useRouter();
  const [asGuest, setAsGuest] = useState<StayRequest[]>([]);
  const [asHost, setAsHost] = useState<StayRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/stay-requests/my-requests");
      if (!res.ok) throw new Error("Failed to load requests");
      const data = await res.json();
      
      setAsGuest(data.asGuest || []);
      setAsHost(data.asHost || []);
    } catch (error) {
      console.error("Error loading stay requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: "Pending review", color: "bg-yellow-100 text-yellow-700" },
      approved: { text: "Confirmed", color: "bg-emerald-100 text-emerald-700" },
      rejected: { text: "Declined", color: "bg-rose-100 text-rose-700" },
      cancelled: { text: "Cancelled", color: "bg-gray-100 text-gray-700" },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatDateRange = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // 只显示即将到来的和待审核的请求
  const upcomingAsGuest = asGuest.filter(r => 
    r.status === 'approved' || r.status === 'pending'
  );

  const pendingAsHost = asHost.filter(r => r.status === 'pending');

  if (loading) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming stays & requests</h2>
        <div className="text-center py-8 text-[rgb(var(--color-muted))]">
          Loading...
        </div>
      </section>
    );
  }

  if (upcomingAsGuest.length === 0 && pendingAsHost.length === 0) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming stays & requests</h2>
        <div className="text-center py-8 text-[rgb(var(--color-muted))]">
          <p className="mb-4">No upcoming stays or pending requests.</p>
          <button
            onClick={() => router.push("/properties")}
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Browse homes
          </button>
        </div>
      </section>
    );
  }

  const allRequests = [...upcomingAsGuest, ...pendingAsHost];

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
      <h2 className="text-xl font-semibold mb-4">Upcoming stays & requests</h2>
      
      <div className="space-y-4">
        {allRequests.map((request) => (
          <div
            key={request.id}
            className="flex gap-4 p-4 rounded-xl border border-[rgb(var(--color-border))] hover:shadow-md transition cursor-pointer"
            onClick={() => router.push(`/stay-requests/${request.id}`)}
          >
            {/* 房产图片 */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              {request.property.photos && request.property.photos.length > 0 ? (
                <Image
                  src={request.property.photos[0]}
                  alt={request.property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No photo</span>
                </div>
              )}
            </div>

            {/* 请求信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">
                    {request.property.city}, {request.property.country}
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-muted))]">
                    {formatDateRange(request.check_in, request.check_out)}
                  </p>
                </div>
                {getStatusBadge(request.status)}
              </div>
              
              <p className="text-sm text-[rgb(var(--color-muted))] line-clamp-2">
                {request.property.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}