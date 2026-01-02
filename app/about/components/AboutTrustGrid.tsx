// app/about/components/AboutTrustGrid.tsx
"use client";

import { TrustFeatureCard } from "./TrustFeatureCard";

export function AboutTrustGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TrustFeatureCard
        step="1"
        title="Strict verification"
        description="Every member undergoes thorough identity and home-ownership verification before joining."
        imageSrc="/images/trust/verification.jpg"
        imageAlt="Member verification"
      />
      <TrustFeatureCard
        step="2"
        title="Curated community"
        description="Our invite-only model ensures a trusted network of quality homeowners and respectful guests."
        imageSrc="/images/trust/community.jpg"
        imageAlt="Curated community"
      />
      <TrustFeatureCard
        step="3"
        title="Human support"
        description="Real people help match homes and resolve issues, no automated responses."
        imageSrc="/images/trust/support.jpg"
        imageAlt="Human support"
      />
      <TrustFeatureCard
        step="4"
        title="Quality guarantee"
        description="Every home is inspected and must meet our standards before going live."
        imageSrc="/images/trust/quality.jpg"
        imageAlt="Quality guarantee"
      />
    </div>
  );
}