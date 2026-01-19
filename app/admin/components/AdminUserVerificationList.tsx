// app/admin/components/AdminUserVerificationList.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/TS/supabaseClient";

type UserVerification = {
  id: string;
  clerk_user_id: string;
  created_at: string;
  status: string;
  doc_url: string | null;
  note: string | null;
};

export default function AdminUserVerificationList() {
  const [items, setItems] = useState<UserVerification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_verifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (!error && data) setItems(data as UserVerification[]);
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleDecision = async (
    id: string,
    decision: "approved" | "rejected"
  ) => {
    // 简单版：直接在前端改，之后可以换成 /api/admin route
    const { error } = await supabase
      .from("user_verifications")
      .update({ status: decision })
      .eq("id", id);

    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
        <h2 className="text-lg font-semibold mb-2">
          Identity verifications
        </h2>
        <p className="text-sm text-[rgb(var(--color-muted))]">Loading…</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
      <h2 className="text-lg font-semibold mb-3">
        Identity verifications
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-[rgb(var(--color-muted))]">
          No pending identity verifications.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-3"
            >
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  User ID:{" "}
                  <span className="text-[rgb(var(--color-muted))]">
                    {item.clerk_user_id}
                  </span>
                </p>
                <p className="text-[rgb(var(--color-muted))]">
                  Submitted at:{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
                {item.note && (
                  <p className="text-[rgb(var(--color-muted))]">
                    Note: {item.note}
                  </p>
                )}
                {item.doc_url && (
                  <a
                    href={item.doc_url}
                    target="_blank"
                    className="text-xs text-[rgb(var(--color-primary))] underline"
                  >
                    View document
                  </a>
                )}
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