// app/properties/components/PropertyDetailSidebar.tsx
import { ShieldCheck, Calendar } from "lucide-react";
import type { Property } from "../lib/propertyData";

type Props = {
  property: Property;
};

export function PropertyDetailSidebar({ property }: Props) {
  return (
    <aside className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 h-fit space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[rgb(var(--color-muted))]">
            Reference value
          </p>
          {property.referencePoints ? (
            <p className="text-2xl font-semibold">
              {property.referencePoints}{" "}
              <span className="text-sm font-normal">points / night</span>
            </p>
          ) : (
            <p className="text-sm text-[rgb(var(--color-muted))] italic">
              Points estimation pending
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--color-secondary))] px-3 py-1 text-xs text-[rgb(var(--color-secondary-foreground))]">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified</span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <button className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-3 flex items-center justify-between hover:border-[rgb(var(--color-primary))] transition">
          <div className="text-left">
            <p className="text-xs text-[rgb(var(--color-muted))]">Dates</p>
            <p>Add your travel dates</p>
          </div>
          <Calendar className="w-4 h-4 text-[rgb(var(--color-muted))]" />
        </button>

        <button className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-3 flex items-center justify-between hover:border-[rgb(var(--color-primary))] transition">
          <div className="text-left">
            <p className="text-xs text-[rgb(var(--color-muted))]">Guests</p>
            <p>2 guests</p>
          </div>
        </button>
      </div>

      <button className="w-full rounded-xl bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-3 text-sm font-medium hover:opacity-90 transition">
        Contact platform to request
      </button>

      <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
        Points are for reference only. Actual exchange terms are facilitated by
        our team manually through a secure vetting process.
      </p>
    </aside>
  );
}