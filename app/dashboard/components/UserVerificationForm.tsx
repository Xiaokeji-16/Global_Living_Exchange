// app/dashboard/account/components/UserVerificationForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/TS/supabaseClient";
import { useUser } from "@clerk/nextjs";

type Props = {
  /** 如果已经有一条记录，可以传进来决定是否显示“已提交/已通过”状态 */
  existingStatus?: "pending" | "approved" | "rejected" | null;
};

export default function UserVerificationForm({ existingStatus = null }: Props) {
  const { user } = useUser();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [documentType, setDocumentType] = useState("passport");
  const [documentNumber, setDocumentNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 如果已经通过 / 已提交，可以在这里直接 return 一段状态 UI
  if (existingStatus === "approved") {
    return (
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
        <h2 className="text-lg font-semibold">Identity verification</h2>
        <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
          Your identity has been <span className="font-medium text-emerald-600">verified</span>.
        </p>
      </div>
    );
  }

  if (existingStatus === "pending") {
    return (
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
        <h2 className="text-lg font-semibold">Identity verification</h2>
        <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
          Your verification request is <span className="font-medium">pending</span>. Our team will review it soon.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError("You need to be logged in to submit verification.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!country.trim()) {
      setError("Please enter your country or region.");
      return;
    }
    if (!documentNumber.trim()) {
      setError("Please enter your document number.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from("user_verifications")
        .insert({
          user_id: user.id,            // Clerk user id
          full_name: fullName.trim(),
          country: country.trim(),
          document_type: documentType, // 'passport' | 'id_card' | ...
          document_number: documentNumber.trim(),
          // extra note 给 reviewer
          review_comment: null,        // 审核时再写
        });

      if (insertError) throw insertError;

      setSuccess("Verification submitted. We’ll review your information soon.");
      // 清掉表单
      setFullName("");
      setCountry("");
      setDocumentType("passport");
      setDocumentNumber("");
      setNotes("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
      <h2 className="text-lg font-semibold">Identity verification</h2>
      <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
        Submit your details so an admin can verify your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Full name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
            placeholder="e.g. Coulson Chen"
          />
        </div>

        {/* Country / Region */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Country / Region</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
            placeholder="e.g. Australia"
          />
        </div>

        {/* Document type */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Document type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
          >
            <option value="passport">Passport</option>
            <option value="id_card">National ID card</option>
            <option value="driver_license">Driver licence</option>
            <option value="other">Other document</option>
          </select>
        </div>

        {/* Document number */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">Document number</label>
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
            placeholder="e.g. passport / ID number"
          />
        </div>

        {/* Optional note 给审核员看的说明，这里我们暂时存到 extra_message，或者你已经有相应字段就改成那个 */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Notes for reviewer (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-input))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
            rows={3}
            placeholder="Anything we should pay attention to when reviewing your documents."
          />
        </div>

        {/* 错误 / 成功提示 */}
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-emerald-600">
            {success}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {submitting ? "Submitting…" : "Submit for verification"}
          </button>
        </div>
      </form>
    </section>
  );
}