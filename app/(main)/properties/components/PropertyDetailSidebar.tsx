// app/properties/components/PropertyDetailSidebar.tsx
import { ShieldCheck, Calendar, Users, Home, ArrowRight } from "lucide-react";
import {
  type PropertyDetail,
  formatPropertyLabel,
} from "../lib/propertyData";

type Props = {
  property: PropertyDetail;
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
          <span>{property.verified ? "Verified" : "Pending review"}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-left">
              <p className="text-xs text-[rgb(var(--color-muted))]">Stay category</p>
              <p>
                {property.stayCategory
                  ? formatPropertyLabel(property.stayCategory)
                  : "Exchange stay"}
              </p>
            </div>
            <Calendar className="w-4 h-4 text-[rgb(var(--color-muted))]" />
          </div>
        </div>

        <div className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-left">
              <p className="text-xs text-[rgb(var(--color-muted))]">Guest capacity</p>
              <p>Up to {property.guests} guest{property.guests === 1 ? "" : "s"}</p>
            </div>
            <Users className="w-4 h-4 text-[rgb(var(--color-muted))]" />
          </div>
        </div>

        <div className="w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-left">
              <p className="text-xs text-[rgb(var(--color-muted))]">Home type</p>
              <p>
                {property.propertyType
                  ? formatPropertyLabel(property.propertyType)
                  : "Private home"}
              </p>
            </div>
            <Home className="w-4 h-4 text-[rgb(var(--color-muted))]" />
          </div>
        </div>
      </div>

      <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-3 text-sm font-medium hover:opacity-90 transition">
        Contact platform to request
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
        Submit your request through the platform and our team will help confirm
        dates, fit, and exchange terms directly with the host.
      </p>
    </aside>
  );
}
