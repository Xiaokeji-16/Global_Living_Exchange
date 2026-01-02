// app/about/components/TrustFeatureCard.tsx
"use client";

import Image from "next/image";

interface TrustFeatureCardProps {
  step: string;            // "1" / "2" / ...
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function TrustFeatureCard({
  step,
  title,
  description,
  imageSrc,
  imageAlt = "",
}: TrustFeatureCardProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
      {/* 顶部图片区域 */}
      <div className="mb-4 h-28 w-full overflow-hidden rounded-2xl bg-[rgb(var(--color-secondary))]">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={400}
            height={200}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* 数字 + 标题 */}
      <div className="flex items-baseline gap-3">
        <span className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--color-primary))]/10 px-3 py-1 text-xs font-semibold text-[rgb(var(--color-primary))]">
          {step}
        </span>
        <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))]">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--color-muted))]">
        {description}
      </p>
    </article>
  );
}