/// app/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";

function isAdmin(user: ReturnType<typeof useUser>["user"]) {
  return user?.publicMetadata?.role === "admin";
}

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !isAdmin(user)) {
      router.replace("/"); // 非管理员踢回首页或 dashboard
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="admin"
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

        {/* 这里保持你原来的三张统计卡片结构（我用占位示意，如果你已有就直接保留原来的） */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))]">
              PENDING IDENTITY CHECKS
            </p>
            <p className="mt-4 text-3xl font-semibold">0</p>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              New members waiting for manual review.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))]">
              LISTINGS AWAITING APPROVAL
            </p>
            <p className="mt-4 text-3xl font-semibold">0</p>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              Homes submitted but not live yet.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))]">
              TODAY&apos;S ACTIONS
            </p>
            <p className="mt-4 text-3xl font-semibold">0</p>
            <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
              Approvals / rejections completed today.
            </p>
          </div>
        </section>

        {/* 提示跳转到 Inbox */}
        <section className="mt-4">
          <p className="text-sm text-[rgb(var(--color-muted))]">
            All pending identity checks and listing approvals are handled in{" "}
            <span className="font-medium">Inbox</span>.
          </p>
        </section>

        {/* 👇 新增：模拟数据分析表 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Activity snapshot (mock data)
              </h2>
              <p className="mt-1 text-xs md:text-sm text-[rgb(var(--color-muted))]">
                This table uses sample numbers to illustrate how admin analytics could look.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-muted))/5] text-xs uppercase tracking-wide text-[rgb(var(--color-muted))]">
                <tr>
                  <th className="px-4 py-3">Metric</th>
                  <th className="px-4 py-3">Today</th>
                  <th className="px-4 py-3">Last 7 days</th>
                  <th className="px-4 py-3">Approval rate</th>
                  <th className="px-4 py-3">Avg. review time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Identity verification requests
                  </td>
                  <td className="px-4 py-3">3</td>
                  <td className="px-4 py-3">21</td>
                  <td className="px-4 py-3 text-emerald-500">86%</td>
                  <td className="px-4 py-3">2.4 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">
                    New listings submitted
                  </td>
                  <td className="px-4 py-3">5</td>
                  <td className="px-4 py-3">32</td>
                  <td className="px-4 py-3 text-emerald-500">91%</td>
                  <td className="px-4 py-3">3.1 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Listings rejected
                  </td>
                  <td className="px-4 py-3 text-rose-500">1</td>
                  <td className="px-4 py-3 text-rose-500">4</td>
                  <td className="px-4 py-3 text-rose-500">–</td>
                  <td className="px-4 py-3">1.7 hours</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">
                    Members verified
                  </td>
                  <td className="px-4 py-3">2</td>
                  <td className="px-4 py-3">18</td>
                  <td className="px-4 py-3 text-emerald-500">100%</td>
                  <td className="px-4 py-3">2.0 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}