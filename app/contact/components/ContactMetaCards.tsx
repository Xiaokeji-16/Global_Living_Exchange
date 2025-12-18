// app/contact/components/ContactMetaCards.tsx
"use client";

export function ContactMetaCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 mt-4">
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-3">
        <p className="text-xs text-[rgb(var(--color-muted))]">Response time</p>
        <p className="text-sm font-medium mt-1">
          We typically reply within 1–3 business days.
        </p>
      </div>
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-4 py-3">
        <p className="text-xs text-[rgb(var(--color-muted))]">Email us directly</p>
        <p className="text-sm font-medium mt-1 text-[rgb(var(--color-primary))]">
          hello@globalliving.exchange
        </p>
      </div>
    </div>
  );
}