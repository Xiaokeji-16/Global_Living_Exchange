/// app/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import AdminHeader from "./components/AdminHeader";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";
import { useInboxStats } from "../hooks/useInbox";

function isAdmin(user: ReturnType<typeof useUser>["user"]) {
  return user?.publicMetadata?.role === "admin";
}

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { stats, loading: statsLoading } = useInboxStats();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !isAdmin(user)) {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <AdminHeader
        theme={theme}
        toggleTheme={toggleTheme}
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* 标题 */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">Admin overview</h1>
          <p className="text-sm md:text-base text-[rgb(var(--color-muted))]">
            Review identity verification and property listings submitted by members.
          </p>
        </section>

        {/* 统计卡片 */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))]">
              PENDING IDENTITY CHECKS
            </p>
            <p className="mt-4 text-3xl font-semibold">
              {statsLoading ? "..." : stats.userVerifications}
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              New members waiting for manual review.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))]">
              LISTINGS AWAITING APPROVAL
            </p>
            <p className="mt-4 text-3xl font-semibold">
              {statsLoading ? "..." : stats.propertyVerifications}
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              Homes submitted but not live yet.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))]">
              TODAY&apos;S ACTIONS
            </p>
            <p className="mt-4 text-3xl font-semibold">
              {statsLoading ? "..." : stats.todayActions}
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              Approvals / rejections completed today.
            </p>
          </div>
        </section>

        {/* 提示跳转到 Inbox */}
        <section className="mt-4">
          <p className="text-sm text-[rgb(var(--color-muted))]">
            All pending identity checks and listing approvals are handled in{" "}
            <a 
              href="/admin/inbox" 
              className="font-medium text-[rgb(var(--color-primary))] hover:underline"
            >
              Inbox
            </a>.
          </p>
        </section>

        {/* 统计表格 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Activity snapshot
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[rgb(var(--color-muted))]">
                Current inbox statistics and review metrics.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-muted))/5] text-xs uppercase tracking-wide text-[rgb(var(--color-muted))]">
                <tr>
                  <th className="px-4 py-3">Metric</th>
                  <th className="px-4 py-3">Count</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                <tr>
                  <td className="px-4 py-3 font-medium">Unread Items</td>
                  <td className="px-4 py-3">{statsLoading ? "..." : stats.unread}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-600">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Approved Items</td>
                  <td className="px-4 py-3">{statsLoading ? "..." : stats.approved}</td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-500">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Denied Items</td>
                  <td className="px-4 py-3">{statsLoading ? "..." : stats.denied}</td>
                  <td className="px-4 py-3">
                    <span className="text-rose-500">Rejected</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">User Verifications</td>
                  <td className="px-4 py-3">{statsLoading ? "..." : stats.userVerifications}</td>
                  <td className="px-4 py-3">
                    <span className="text-[rgb(var(--color-muted))]">Total</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Property Verifications</td>
                  <td className="px-4 py-3">{statsLoading ? "..." : stats.propertyVerifications}</td>
                  <td className="px-4 py-3">
                    <span className="text-[rgb(var(--color-muted))]">Total</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Feedbacks</td>
                  <td className="px-4 py-3">{statsLoading ? "..." : stats.feedbacks}</td>
                  <td className="px-4 py-3">
                    <span className="text-[rgb(var(--color-muted))]">Total</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}