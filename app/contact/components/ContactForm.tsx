// app/contact/components/ContactForm.tsx
"use client";

import { useState, FormEvent } from "react";


export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    // 从表单 DOM 里拿数据（你已经有 name="fullName" 这些了）
    const form = e.currentTarget;
    
    const formData = new FormData(form);
    const fullName = (formData.get("fullName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const topic = (formData.get("topic") || "").toString() || "other";
    const message = (formData.get("message") || "").toString().trim();

    if (!fullName || !email || !message) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,       // 🔁 后端那边叫 name
          email,
          messageType: topic,   // 🔁 后端那边叫 messageType
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send message");
      }

      setSuccess("Thanks, we've received your message.");
      // 提交成功后清空表单
      form.reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      {success && (
        <p className="mt-3 text-sm text-emerald-400">
          {success}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}