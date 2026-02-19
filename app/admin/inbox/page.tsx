// app/admin/inbox/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useLogout";

import {
  Mail,
  UserCheck,
  Home,
  MessageCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Category = "user" | "property" | "feedback";
type Status = "pending" | "approved" | "rejected";

export type InboxItem = {
  id: string;
  category: Category;
  status: Status;
  createdAt: string;
  title: string;
  subtitle?: string;
  userName?: string;
  userEmail?: string;
  propertyName?: string;
  propertyLocation?: string;
  feedbackMessage?: string;
  raw?: any;
  propertyDetails?: {
    description?: string;
    property_type?: string;
    stay_category?: string;
    guests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    house_rules?: string;
    photos?: string[];
    country?: string;
    city?: string;
  };
  feedbackDetails?: {
    name?: string;
    email?: string;
    message_type?: string;
    message?: string;
  };
  verificationDetails?: {
    full_name?: string;
    country?: string;
    document_type?: string;
    document_number?: string;
    note?: string;
  };
};

type InboxResponse = {
  items: InboxItem[];
};

export default function AdminInboxPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<Category>("property");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inbox");
      if (!res.ok) throw new Error("Failed to load inbox items");
      const json = (await res.json()) as InboxResponse;
      setItems(json.items || []);

      if (!selectedId && json.items && json.items.length > 0) {
        const first = json.items.find((it) => it.category === category);
        if (first) setSelectedId(first.id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = useMemo(
    () => items.filter((it) => it.category === category),
    [items, category]
  );

  const selectedItem = useMemo(
    () => filteredItems.find((it) => it.id === selectedId) ?? filteredItems[0],
    [filteredItems, selectedId]
  );

  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.some((i) => i.id === selectedId)) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  const handleDecision = async (item: InboxItem, decision: "approved" | "rejected") => {
    try {
      const inboxId = item.raw?.id || item.id;
      
      if (!inboxId) {
        throw new Error("Invalid inbox item ID");
      }

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: decision } : it
        )
      );

      const action = decision === "approved" ? "approve" : "deny";
      const url = `/api/admin/inbox/${inboxId}/review`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to review item");
      }
      
    } catch (e) {
      console.error("Review error:", e);
      alert(`Failed to ${decision === "approved" ? "approve" : "deny"} item`);
      await loadItems();
    }
  };

  const statusPill = (status: Status) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    switch (status) {
      case "pending":
        return (
          <span className={`${base} bg-yellow-50 text-yellow-700`}>
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className={`${base} bg-emerald-50 text-emerald-700`}>
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className={`${base} bg-rose-50 text-rose-700`}>
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
    }
  };

  const categoryButtonClasses = (c: Category) =>
    `inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
      c === category
        ? "bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]"
        : "text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-border))]/40"
    }`;

  const categoryIcon = (c: Category, size = 16) => {
    const props = { size, className: "shrink-0" };
    if (c === "user") return <UserCheck {...props} />;
    if (c === "property") return <Home {...props} />;
    return <MessageCircle {...props} />;
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="admin"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold">
              <Mail size={22} className="text-[rgb(var(--color-primary))]" />
              Inbox
            </h1>
            <p className="text-sm text-[rgb(var(--color-muted))]">
              Review identity checks, new listings and user feedback.
            </p>
          </div>

          <button
            onClick={loadItems}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--color-border))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-muted))] hover:bg-[rgb(var(--color-border))]/40 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Refreshing
              </>
            ) : (
              <>Refresh</>
            )}
          </button>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("property")}
            className={categoryButtonClasses("property")}
          >
            {categoryIcon("property")}
            Property verifications
          </button>
          <button
            type="button"
            onClick={() => setCategory("user")}
            className={categoryButtonClasses("user")}
          >
            {categoryIcon("user")}
            User verification
          </button>
          <button
            type="button"
            onClick={() => setCategory("feedback")}
            className={categoryButtonClasses("feedback")}
          >
            {categoryIcon("feedback")}
            User feedback
          </button>
        </div>

        <div className="mt-4 flex min-h-[420px] rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm overflow-hidden">
          <aside className="w-full max-w-xs border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]">
            {error && (
              <div className="px-4 py-3 text-xs text-rose-600 bg-rose-50 border-b border-rose-100">
                {error}
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="flex h-full items-center justify-center px-4 py-10 text-sm text-[rgb(var(--color-muted))]">
                No items to review at the moment.
              </div>
            ) : (
              <ul className="divide-y divide-[rgb(var(--color-border))]/70">
                {filteredItems.map((item) => {
                  const isActive = selectedItem?.id === item.id;
                  return (
                    <li
                      key={item.id}
                      className={`relative cursor-pointer px-4 py-3 text-sm transition ${
                        isActive
                          ? "bg-[rgb(var(--color-primary))]/5"
                          : "hover:bg-[rgb(var(--color-border))]/30"
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {categoryIcon(item.category, 18)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[rgb(var(--color-foreground))]">
                              {item.title}
                            </p>
                            {statusPill(item.status)}
                          </div>
                          {item.subtitle && (
                            <p className="mt-0.5 truncate text-xs text-[rgb(var(--color-muted))]">
                              {item.subtitle}
                            </p>
                          )}
                          <p className="mt-1 text-[10px] text-[rgb(var(--color-muted))]">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <section className="flex-1 flex flex-col">
            {!selectedItem ? (
              <div className="flex flex-1 items-center justify-center text-sm text-[rgb(var(--color-muted))]">
                Select an item on the left to see details.
              </div>
            ) : (
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-muted))]">
                      {selectedItem.category === "user"
                        ? "User verification"
                        : selectedItem.category === "property"
                        ? "Property verification"
                        : "User feedback"}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {selectedItem.title}
                    </h2>
                    {selectedItem.subtitle && (
                      <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
                        {selectedItem.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {statusPill(selectedItem.status)}
                    <p className="text-[10px] text-[rgb(var(--color-muted))]">
                      Created at{" "}
                      {new Date(selectedItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] px-4 py-3 text-sm">
                  {selectedItem.category === "property" && (
                    <>
                      <DetailRow label="Listing">
                        {selectedItem.propertyName ?? "-"}
                      </DetailRow>
                      <DetailRow label="Location">
                        {selectedItem.propertyLocation ?? "-"}
                      </DetailRow>
                      <DetailRow label="Host">
                        {selectedItem.userName ?? "-"}
                      </DetailRow>
                      <DetailRow label="Host email">
                        {selectedItem.userEmail ?? "-"}
                      </DetailRow>
                      
                      {selectedItem.propertyDetails && (
                        <>
                          <DetailRow label="Description">
                            <div className="text-sm max-h-24 overflow-y-auto whitespace-pre-wrap">
                              {selectedItem.propertyDetails.description || "-"}
                            </div>
                          </DetailRow>
                          
                          <DetailRow label="Property type">
                            {selectedItem.propertyDetails.property_type || "-"}
                          </DetailRow>
                          
                          <DetailRow label="Stay category">
                            {selectedItem.propertyDetails.stay_category || "-"}
                          </DetailRow>
                          
                          <DetailRow label="Capacity">
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                👥 {selectedItem.propertyDetails.guests} guests
                              </span>
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                🛏️ {selectedItem.propertyDetails.bedrooms} bedrooms
                              </span>
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                🛌 {selectedItem.propertyDetails.beds} beds
                              </span>
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                🚿 {selectedItem.propertyDetails.bathrooms} bathrooms
                              </span>
                            </div>
                          </DetailRow>
                          
                          <DetailRow label="House rules">
                            <div className="text-sm max-h-20 overflow-y-auto whitespace-pre-wrap">
                              {selectedItem.propertyDetails.house_rules || "-"}
                            </div>
                          </DetailRow>
                          
                          {selectedItem.propertyDetails.photos && selectedItem.propertyDetails.photos.length > 0 && (
                            <DetailRow label="Photos">
                              <div className="grid grid-cols-3 gap-2">
                                {selectedItem.propertyDetails.photos.slice(0, 6).map((photo: string, idx: number) => (
                                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                                    <img 
                                      src={photo} 
                                      alt={`Property photo ${idx + 1}`}
                                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition"
                                      onClick={() => window.open(photo, '_blank')}
                                    />
                                  </div>
                                ))}
                              </div>
                              {selectedItem.propertyDetails.photos.length > 6 && (
                                <p className="text-xs text-[rgb(var(--color-muted))] mt-2">
                                  +{selectedItem.propertyDetails.photos.length - 6} more photos
                                </p>
                              )}
                            </DetailRow>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {selectedItem.category === "user" && (
                    <>
                      <DetailRow label="Full name">
                        {selectedItem.verificationDetails?.full_name || selectedItem.userName || "-"}
                      </DetailRow>
                      <DetailRow label="Country">
                        {selectedItem.verificationDetails?.country || "-"}
                      </DetailRow>
                      <DetailRow label="Document type">
                        {selectedItem.verificationDetails?.document_type || "-"}
                      </DetailRow>
                      <DetailRow label="Document number">
                        {selectedItem.verificationDetails?.document_number || "-"}
                      </DetailRow>
                      {selectedItem.verificationDetails?.note && (
                        <DetailRow label="Notes">
                          <div className="text-sm max-h-20 overflow-y-auto whitespace-pre-wrap">
                            {selectedItem.verificationDetails.note}
                          </div>
                        </DetailRow>
                      )}
                    </>
                  )}

                  {selectedItem.category === "feedback" && (
                    <>
                      <DetailRow label="Full name">
                        {selectedItem.feedbackDetails?.name || selectedItem.userName || "-"}
                      </DetailRow>
                      <DetailRow label="Email">
                        {selectedItem.feedbackDetails?.email || selectedItem.userEmail || "-"}
                      </DetailRow>
                      <DetailRow label="Message type">
                        {selectedItem.feedbackDetails?.message_type || "-"}
                      </DetailRow>
                      <DetailRow label="Message">
                        <div className="text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                          {selectedItem.feedbackDetails?.message || selectedItem.feedbackMessage || "-"}
                        </div>
                      </DetailRow>
                    </>
                  )}
                </div>

                {selectedItem.status === "pending" && (
                  <div className="mt-auto flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecision(selectedItem, "rejected")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-100 transition"
                    >
                      <XCircle size={16} />
                      Deny
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(selectedItem, "approved")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500 bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 transition"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                  </div>
                )}

                {selectedItem.status !== "pending" && (
                  <div className="mt-auto text-right text-xs text-[rgb(var(--color-muted))]">
                    This request has been{" "}
                    <span className="font-medium">
                      {selectedItem.status === "approved" ? "approved" : "rejected"}
                    </span>
                    .
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="w-32 shrink-0 text-[rgb(var(--color-muted))]">
        {label}
      </div>
      <div className="flex-1 text-[rgb(var(--color-foreground))]">
        {children}
      </div>
    </div>
  );
}