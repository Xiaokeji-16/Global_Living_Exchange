// app/about/components/AboutTrustGrid.tsx
"use client";

import {
  ShieldCheck,
  Users,
  Headphones,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    title: "Strict verification",
    description:
      "Every member undergoes thorough identity and home-ownership verification before joining.",
    icon: ShieldCheck,
  },
  {
    title: "Curated community",
    description:
      "Our invite-only model ensures a trusted network of quality homeowners and respectful guests.",
    icon: Users,
  },
  {
    title: "Human support",
    description:
      "Real people help match homes and resolve any issues. No automated responses, just care.",
    icon: Headphones,
  },
  {
    title: "Quality guarantee",
    description:
      "All properties meet our standards, and member reviews keep our community accountable.",
    icon: BadgeCheck,
  },
];

export function AboutTrustGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgb(var(--color-secondary))] text-[rgb(var(--color-primary))]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                {item.title}
              </h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--color-muted))]">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}