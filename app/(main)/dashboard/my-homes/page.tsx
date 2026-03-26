"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Header } from "../../../components/Header";
import { AuthedShell } from "../../../components/AuthedShell";
import { useTheme } from "../../../hooks/useTheme";
import { useLogout } from "../../../hooks/useLogout";

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

export default function MyHomesPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/properties/my-homes");
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
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

  return (
    <AuthedShell>
      <Header theme={theme} toggleTheme={toggleTheme} variant="authed" onLogoutClick={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-2 inline-flex items-center gap-1 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))]"
            >
              ← Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-semibold">My homes</h1>
            <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
              {properties.length} {properties.length === 1 ? "home" : "homes"} listed
            </p>
          </div>
          <button
            onClick={() => router.push("/upload-home")}
            className="rounded-full bg-[rgb(var(--color-primary))] px-5 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition"
          >
            + Upload new home
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[rgb(var(--color-muted))]">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[rgb(var(--color-muted))] mb-4">You have not uploaded any homes yet.</p>
            <button
              onClick={() => router.push("/upload-home")}
              className="rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition"
            >
              + Upload your first home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="group relative">
                <div
                  className="flex gap-4 p-4 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:shadow-md transition cursor-pointer"
                  onClick={() => confirmId !== property.id && router.push(`/properties/${property.id}`)}
                >
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden flex-shrink-0">
                    {property.photos?.length > 0 ? (
                      <Image src={property.photos[0]} alt={property.title} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[rgb(var(--color-secondary))]">
                        <span className="text-xs text-[rgb(var(--color-muted))]">No photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                      <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
                        {property.city}, {property.country}
                      </p>
                      <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
                        {property.property_type} · {property.guests} Guests
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {getStatusBadge(property.verification_status)}

                      {(property.verification_status === "rejected" || property.verification_status === "draft") && (
                        confirmId === property.id ? (
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <span className="text-xs text-[rgb(var(--color-muted))]">Delete?</span>
                            <button
                              onClick={() => handleDelete(property.id)}
                              disabled={deletingId === property.id}
                              className="rounded-full bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 transition disabled:opacity-50"
                            >
                              {deletingId === property.id ? "..." : "Yes"}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs hover:border-[rgb(var(--color-primary))] transition"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmId(property.id); }}
                            className="rounded-lg p-1.5 text-[rgb(var(--color-muted))] opacity-0 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AuthedShell>
  );
}
