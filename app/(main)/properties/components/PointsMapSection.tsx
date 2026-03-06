// app/properties/components/PointsMapSection.tsx
"use client";

import { MapPin } from "lucide-react";
import { POINTS_BUBBLES } from "../lib/pointsMapData";
import PointsBubble from "./PointsBubble";

export default function PointsMapSection() {
  return (
    <section
      aria-label="Points map"
      className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between text-sm font-medium text-[rgb(var(--color-foreground))]">
        <span>Points overview</span>
        <span className="text-xs text-[rgb(var(--color-muted))]">
          Hover a bubble to see details
        </span>
      </div>

      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top,_#020617,_#020617_40%,_#020617)]">
        {/* 背景弧线 / 网格 */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full border border-[rgb(var(--color-border))]/30" />
        <div className="pointer-events-none absolute -top-10 left-10 h-96 w-96 rounded-full border border-[rgb(var(--color-border))]/20" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full border border-[rgb(var(--color-border))]/15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(148,163,184,0.15)_1px,_transparent_1px)] bg-[length:22px_22px] opacity-20" />

        {/* ✅ 使用拆出来的 PointsBubble 组件 */}
        {POINTS_BUBBLES.map((b) => (
          <PointsBubble key={b.id} bubble={b} />
        ))}

        {/* 右下角定位按钮 */}
        <button
          type="button"
          className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-foreground))] shadow-md shadow-black/50 hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition"
        >
          <MapPin className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}