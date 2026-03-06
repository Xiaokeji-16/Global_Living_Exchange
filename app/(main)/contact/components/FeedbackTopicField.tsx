// app/dashboard/contact/components/FeedbackTopicField.tsx
"use client";

export const MESSAGE_TYPES = [
  { value: "bug", label: "Bug or technical issue" },
  { value: "feature", label: "Feature request" },
  { value: "host", label: "Hosting / listing" },
  { value: "guest", label: "Stay as guest" },
  { value: "other", label: "Other" },
];

type Props = {
  value: string;
  onChange: (v: string) => void;
  options?: typeof MESSAGE_TYPES;
};

export default function FeedbackTopicField({
  value,
  onChange,
  options = MESSAGE_TYPES,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Message type</label>
      <select
        className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a topic</option>
        {options.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}