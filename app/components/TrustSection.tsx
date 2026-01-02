// app/components/TrustSection.tsx
"use client";

import Image from "next/image";
import { ShieldCheck, Users, Headphones, BadgeCheck } from "lucide-react";

export function TrustSection() {
  return (
    <section
      id="trust"
      className="py-16 sm:py-20 lg:py-24 bg-[rgb(var(--color-background))]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* 左侧：标题 + 文案 + 数据 + 大图 */}
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[rgb(var(--color-foreground))]">
            Built on trust, operated with care
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[rgb(var(--color-muted))] leading-relaxed">
            Unlike traditional home exchanges or rental platforms, we prioritize
            safety and authenticity. Every member is verified, every home is
            inspected, and our team is here to ensure seamless exchanges.
          </p>

          {/* 数据行 */}
          <dl className="mt-8 grid grid-cols-3 gap-4 sm:gap-6 text-sm">
            <div>
              <dt className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                100%
              </dt>
              <dd className="mt-1 text-[rgb(var(--color-muted))]">
                Verified members
              </dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                50+
              </dt>
              <dd className="mt-1 text-[rgb(var(--color-muted))]">
                Countries
              </dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                24/7
              </dt>
              <dd className="mt-1 text-[rgb(var(--color-muted))]">
                Support available
              </dd>
            </div>
          </dl>

          {/* 左下角大图 */}
          <div className="mt-10 flex-1">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-3xl bg-[rgba(148,163,184,0.12)]">
              <Image
                src="/icon/cozy_home.jpg"  // public/icon/cozy_home.jpg
                alt="Warm and inviting living room"
                fill
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 480px, 100vw"
              />
            </div>
          </div>
        </div>

        {/* 右侧：4 个 feature 卡片（保持原来的样式） */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2">
          {/* 1. Strict verification */}
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.06)]">
              <ShieldCheck className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-1.5">
              Strict verification
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
              Every member undergoes thorough identity and home-ownership
              verification before joining.
            </p>
          </div>

          {/* 2. Curated community */}
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.06)]">
              <Users className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-1.5">
              Curated community
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
              Our invite-only model ensures a trusted network of quality
              homeowners and respectful guests.
            </p>
          </div>

          {/* 3. Human support */}
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.06)]">
              <Headphones className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-1.5">
              Human support
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
              Real people help match homes and resolve any issues. No automated
              responses, just care.
            </p>
          </div>

          {/* 4. Quality guarantee */}
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.06)]">
              <BadgeCheck className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-[rgb(var(--color-foreground))] mb-1.5">
              Quality guarantee
            </h3>
            <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
              All properties meet our standards, and member reviews keep our
              community accountable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;