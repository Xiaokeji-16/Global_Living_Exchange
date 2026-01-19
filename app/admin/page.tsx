// app/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";

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

  // 简单的前端守卫：不是管理员就踢回首页
  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !isAdmin(user)) {
      router.replace("/"); // 或者 /dashboard
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || !isAdmin(user)) {
    return null; // 或者一个 Loading / 无权限提示
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">Admin</h1>
          <p className="text-sm md:text-base text-[rgb(var(--color-muted))]">
            Review identity verification and property listings for Global
            Living Exchange.
          </p>
        </section>

        {/* 用户认证审核列表 */}
        <AdminUserVerificationList />

        {/* 房源审核列表 */}
        <AdminPropertyVerificationList />
      </main>
    </div>
  );
}