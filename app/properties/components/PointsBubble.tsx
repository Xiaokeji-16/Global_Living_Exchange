// app/properties/components/PointsBubble.tsx
"use client";

import type { PointsBubble as PointsBubbleType } from "../lib/pointsMapData";

type Props = {
  bubble: PointsBubbleType;
};

export default function PointsBubble({ bubble }: Props) {
  const { label, caption, top, left } = bubble;

  return (
    <div
      className="absolute group"
      style={{ top, left }}
    >
      {/* 气泡本体 */}
      <div className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-foreground))] shadow-sm shadow-black/40 transition-transform duration-200 group-hover:scale-110 group-hover:border-[rgb(var(--color-primary))]">
        {label === "Est." ? (
          <span className="text-[rgb(var(--color-muted))]">Est.</span>
        ) : (
          <span>{label}</span>
        )}
      </div>

      {/* Hover 提示气泡 */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 hidden group-hover:block">
        <div className="rounded-md bg-black/80 px-2 py-1 text-[10px] text-white whitespace-nowrap shadow-lg shadow-black/60">
          {caption}
        </div>
      </div>
    </div>
  );
}