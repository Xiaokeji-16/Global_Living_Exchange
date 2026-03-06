// app/about/components/AboutTrustSections.tsx
"use client";

import Image from "next/image";
import { AboutTrustGrid } from "./AboutTrustGrid";

export function AboutTrustSection() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* 标题 + 文案 */}
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight text-[rgb(var(--color-foreground))]">
          Built on trust, operated with care
        </h2>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-[rgb(var(--color-muted))]">
          Unlike traditional home exchanges or rental platforms, we prioritize safety
          and authenticity. Every member is verified, every home is inspected, and
          our team is here to ensure seamless exchanges.
        </p>
      </div>

      {/* 上方 3 个数字 */}
      <div className="mt-8 grid gap-6 text-[rgb(var(--color-foreground))] md:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold">100%</p>
          <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
            Verified members
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold">50+</p>
          <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
            Countries
          </p>
        </div>
        <div>
          <p className="text-2xl font-semibold">24/7</p>
          <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
            Support available
          </p>
        </div>
      </div>

      {/* 下方：左图 + 右侧卡片 */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
        {/* 左边大图 */}
        <div className="relative overflow-hidden rounded-3xl bg-[rgb(var(--color-secondary))]">
          <Image
            src="/icon/cozy_home.jpg"  // ⭐ 这里对应 public/icon/cozy_home.jpg
            alt="Happy members exchanging homes"
            width={800}
            height={480}
            className="h-full w-full object-cover"
          />
        </div>

        {/* 右侧卡片网格 */}
        <AboutTrustGrid />
      </div>
    </section>
  );
}