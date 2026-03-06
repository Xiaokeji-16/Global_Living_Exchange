// app/contact/components/ContactIntro.tsx
"use client";

export function ContactIntro() {
  return (
    <div className="space-y-4">
      <p className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] px-3 py-1 text-xs text-[rgb(var(--color-muted))]">
        Get in touch
      </p>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        We’d love to hear from you
      </h1>

      <p className="text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-xl">
        Whether you&apos;re curious about how the membership works, need help
        with a match, or want to partner with us, send us a message and our
        team will get back to you.
      </p>
    </div>
  );
}