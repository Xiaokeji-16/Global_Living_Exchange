// app/admin/components/AdminPropertyVerificationList.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/TS/supabaseClient";

type Property = {
  id: string;
  title: string;
  city: string | null;
  country: string | null;
  verification_status: string;
  created_at: string;
};

export default function AdminPropertyVerificationList() {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, city, country, verification_status, created_at")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: true });

    if (!error && data) setItems(data as Property[]);
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleDecision = async (
    id: string,
    decision: "approved" | "rejected"
  ) => {
    const { error } = await supabase
      .from("properties")
      .update({ verification_status: decision })
      .eq("id", id);

    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert("Failed to update property status");
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
        <h2 className="text-lg font-semibold mb-2">Listings</h2>
        <p className="text-sm text-[rgb(var(--color-muted))]">Loading…</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
      <h2 className="text-lg font-semibold mb-3">
        Listings pending review
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-[rgb(var(--color-muted))]">
          No listings waiting for approval.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-3"
            >
              <div className="space-y-1 text-sm">
                <p className="font-medium">{item.title}</p>
                <p className="text-[rgb(var(--color-muted))]">
                  {item.city}, {item.country}
                </p>
                <p className="text-[rgb(var(--color-muted))] text-xs">
                  Submitted at:{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(item.id, "rejected")}
                  className="px-3 py-1 rounded-full border border-[rgb(var(--color-border))] text-xs"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDecision(item.id, "approved")}
                  className="px-3 py-1 rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-xs"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}