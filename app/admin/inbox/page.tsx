// app/admin/inbox/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useLogout";

import AdminUserVerificationList from "../components/AdminUserVerificationList";
import AdminPropertyVerificationList from "../components/AdminPropertyVerificationList";

function isAdmin(user: ReturnType<typeof useUser>["user"]) {
  return user?.publicMetadata?.role === "admin";
}

export default function AdminInboxPage() {
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

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="admin"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 标题 */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">Inbox</h1>
          <p className="text-sm md:text-base text-[rgb(var(--color-muted))]">
            Handle member identity verifications and approve new property listings.
          </p>
        </section>

        {/* 两个审核列表放到 Inbox 里 */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* 左边：用户身份认证 */}
          <AdminUserVerificationList />

          {/* 右边：房源审核 */}
          <AdminPropertyVerificationList />
        </section>
      </main>
    </div>
  );
}