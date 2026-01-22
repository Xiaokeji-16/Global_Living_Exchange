// app/dashboard/components/UserVerificationForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/TS/supabaseClient";
import { useUser } from "@clerk/nextjs";

export default function UserVerificationForm() {
  const { user } = useUser();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [country, setCountry] = useState("");
  const [docType, setDocType] = useState("Passport");
  const [docNumber, setDocNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.from("user_verifications").insert({
        user_id: user.id,
        full_name: fullName || null,
        country: country || null,
        document_type: docType || null,
        document_number: docNumber || null,
      });

      if (error) throw error;

      setMessage("Verification submitted. Our team will review it soon.");
      setDocNumber("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 space-y-4">
      <h2 className="text-lg font-semibold">Identity verification</h2>
      <p className="text-sm text-[rgb(var(--color-muted))]">
        Submit your details for identity verification. This helps us keep the community safe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input
            className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Document type</label>
            <select
              className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="Passport">Passport</option>
              <option value="ID card">ID card</option>
              <option value="Driver licence">Driver licence</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Document number</label>
            <input
              className="w-full rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
            />
          </div>
        </div>

        {message && (
          <p className="text-xs text-[rgb(var(--color-muted))]">{message}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[rgb(var(--color-primary))] px-5 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit for review"}
        </button>
      </form>
    </div>
  );
}