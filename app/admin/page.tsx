// app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";

import AdminHeader from "./components/AdminHeader";
import AdminUserVerificationList from "./components/AdminUserVerificationList";
import AdminPropertyVerificationList from "./components/AdminPropertyVerificationList";

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
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || !isAdmin(user)) {
    return null;
  }

  const displayName =
    user.fullName ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    user.primaryEmailAddress?.emailAddress ||
    null;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <AdminHeader
        theme={theme}
        toggleTheme={toggleTheme}
        onLogoutClick={handleLogout}
        userName={displayName}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 顶部标题 + 说明 */}
        <section className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Admin overview
              </h1>
              <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
                Review identity verification and property listings submitted by
                members.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-3 py-1 text-xs text-[rgb(var(--color-muted))]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Signed in as admin</span>
            </div>
          </div>
        </section>

        {/* 概览卡片 */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[rgb(var(--color-muted))]">
              Pending identity checks
            </p>
            <p className="mt-3 text-2xl font-semibold">0</p>
            <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
              New members waiting for manual review.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[rgb(var(--color-muted))]">
              Listings awaiting approval
            </p>
            <p className="mt-3 text-2xl font-semibold">0</p>
            <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
              Homes submitted but not live yet.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[rgb(var(--color-muted))]">
              Today&apos;s actions
            </p>
            <p className="mt-3 text-2xl font-semibold">0</p>
            <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
              Approvals / rejections completed today.
            </p>
          </div>
        </section>

        {/* 主体：左 = 用户认证，右 = Inbox（先用房源审核占位） */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* 用户认证区，对应顶部 User verification 链接 */}
          <div id="identity">
            <AdminUserVerificationList />
          </div>

          {/* Inbox 区：目前先用房源审核组件，将来可以换成消息列表 */}
          <div id="inbox">
            <AdminPropertyVerificationList />
          </div>
        </section>
      </main>
    </div>
  );
}