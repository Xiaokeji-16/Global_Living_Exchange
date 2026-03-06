// app/dashboard/contact/components/FeedbackMessageField.tsx
"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function FeedbackMessageField({ value, onChange }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Message</label>
      <textarea
        className="min-h-[140px] w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        placeholder="Tell us more about your idea, issue, or experience..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}