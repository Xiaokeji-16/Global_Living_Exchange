// app/contact/components/ContactForm.tsx
"use client";

import { useState, FormEvent } from "react";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      alert("Message sent! (demo)");
      setSubmitting(false);
    }, 800);
  };

  return (
    <section
      aria-label="Send us a message"
      className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-4">Send us a message</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="space-y-1">
          <label
            htmlFor="fullName"
            className="text-xs font-medium text-[rgb(var(--color-muted))]"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="e.g. Alex Johnson"
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-xs font-medium text-[rgb(var(--color-muted))]"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
          />
        </div>

        {/* Message type */}
        <div className="space-y-1">
          <label
            htmlFor="topic"
            className="text-xs font-medium text-[rgb(var(--color-muted))]"
          >
            Message type
          </label>
          <select
            id="topic"
            name="topic"
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
            defaultValue=""
          >
            <option value="" disabled>
              Select a topic
            </option>
            <option value="membership">Membership question</option>
            <option value="match">Help with a match</option>
            <option value="partnership">Partnership / collaboration</option>
            <option value="other">Something else</option>
          </select>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label
            htmlFor="message"
            className="text-xs font-medium text-[rgb(var(--color-muted))]"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us more about your needs..."
            className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm outline-none focus:border-[rgb(var(--color-primary))] focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </section>
  );
}