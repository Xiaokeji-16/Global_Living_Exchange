// app/stay-requests/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { ArrowLeft, Calendar, Users, MessageSquare, CheckCircle, XCircle } from "lucide-react";

type StayRequest = {
  id: string;
  property_id: number;
  guest_user_id: string;
  host_user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  status: string;
  reviewed_at?: string;
  review_note?: string;
  created_at: string;
  property: {
    id: number;
    title: string;
    description: string;
    city: string;
    country: string;
    photos: string[];
    property_type: string;
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
};

export default function StayRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const [request, setRequest] = useState<StayRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    if (params.id) {
      loadRequest();
    }
  }, [params.id]);

  const loadRequest = async () => {
    try {
      const res = await fetch(`/api/stay-requests/${params.id}`);
      if (!res.ok) throw new Error("Failed to load request");
      const data = await res.json();
      setRequest(data.request);
    } catch (error) {
      console.error("Error loading request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: "approve" | "reject") => {
    if (!request) return;
    
    setReviewing(true);
    try {
      const res = await fetch(`/api/stay-requests/${request.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: reviewNote }),
      });

      if (!res.ok) throw new Error("Failed to review request");

      const data = await res.json();
      setRequest(data.request);
      alert(`Request ${action === "approve" ? "approved" : "rejected"} successfully!`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error reviewing request:", error);
      alert("Failed to review request");
    } finally {
      setReviewing(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
      <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center">
        <div className="text-[rgb(var(--color-muted))]">Loading...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[rgb(var(--color-muted))] mb-4">Request not found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[rgb(var(--color-primary))] hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isHost = user?.id === request.host_user_id;
  const canReview = isHost && request.status === "pending";

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      {/* Header */}
      <header className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Badge */}
        <div className="mb-6">
          {getStatusBadge(request.status)}
        </div>

        {/* Property Info */}
        <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] overflow-hidden mb-6">
          {/* Property Image */}
          {request.property.photos && request.property.photos.length > 0 && (
            <div className="relative h-64 w-full">
              <Image
                src={request.property.photos[0]}
                alt={request.property.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-2">
              {request.property.title}
            </h1>
            <p className="text-[rgb(var(--color-muted))] mb-4">
              {request.property.city}, {request.property.country}
            </p>
            <p className="text-sm text-[rgb(var(--color-muted))] mb-4">
              {request.property.property_type} • {request.property.guests} guests • {request.property.bedrooms} bedrooms • {request.property.beds} beds • {request.property.bathrooms} bathrooms
            </p>
            <p className="text-sm text-[rgb(var(--color-muted))]">
              {request.property.description}
            </p>
          </div>
        </div>

        {/* Request Details */}
        <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Stay details</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-[rgb(var(--color-muted))] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Check-in</p>
                <p className="text-sm text-[rgb(var(--color-muted))]">
                  {formatDate(request.check_in)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-[rgb(var(--color-muted))] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Check-out</p>
                <p className="text-sm text-[rgb(var(--color-muted))]">
                  {formatDate(request.check_out)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users size={20} className="text-[rgb(var(--color-muted))] mt-0.5" />
              <div>
                <p className="text-sm font-medium">Guests</p>
                <p className="text-sm text-[rgb(var(--color-muted))]">
                  {request.guests} {request.guests === 1 ? 'guest' : 'guests'}
                </p>
              </div>
            </div>

            {request.message && (
              <div className="flex items-start gap-3">
                <MessageSquare size={20} className="text-[rgb(var(--color-muted))] mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Message from guest</p>
                  <p className="text-sm text-[rgb(var(--color-muted))] whitespace-pre-wrap">
                    {request.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Section (for hosts) */}
        {canReview && (
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <h2 className="text-lg font-semibold mb-4">Review this request</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Response message (optional)
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Add a personal note for the guest..."
                rows={4}
                className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReview("reject")}
                disabled={reviewing}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-medium text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
              >
                <XCircle size={18} />
                Decline
              </button>
              <button
                onClick={() => handleReview("approve")}
                disabled={reviewing}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition disabled:opacity-50"
              >
                <CheckCircle size={18} />
                Approve
              </button>
            </div>
          </div>
        )}

        {/* Review Result (for reviewed requests) */}
        {request.status !== "pending" && (
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <h2 className="text-lg font-semibold mb-2">
              {request.status === "approved" ? "Request approved" : "Request declined"}
            </h2>
            {request.reviewed_at && (
              <p className="text-sm text-[rgb(var(--color-muted))] mb-4">
                Reviewed on {formatDate(request.reviewed_at)}
              </p>
            )}
            {request.review_note && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Host's message</p>
                <p className="text-sm text-[rgb(var(--color-muted))] whitespace-pre-wrap">
                  {request.review_note}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}