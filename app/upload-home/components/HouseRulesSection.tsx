// app/upload-home/components/HouseRulesSection.tsx

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function HouseRulesSection({ value, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold">
        House rules & notes
      </h2>
      <textarea
        rows={4}
        className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        placeholder="Quiet hours, smoking policy, pets, special notes for guests..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </section>
  );
}