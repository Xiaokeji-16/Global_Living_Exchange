// app/dashboard/components/DashboardWelcome.tsx
"use client";

import type { DashboardSummary } from "../lib/dashboardData";

type Props = {
  summary: DashboardSummary;
};

export default function DashboardWelcome({ summary }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
      {/* 左：Welcome 文案 */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3">
          Welcome back
        </h1>
        <p className="text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-xl">
          Here you can see your upcoming stays, listed homes, and the
          steps to complete your verification for Global Living Exchange.
        </p>
      </div>

      {/* 右：会员信息卡片 */}
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))] uppercase mb-1">
          Membership status
        </p>
        <p className="text-base sm:text-lg font-semibold mb-1">
          {summary.membershipStatus}
        </p>
        <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
          {summary.membershipNote}
        </p>
      </div>
    </section>
  );
}