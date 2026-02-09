// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";

import DashboardWelcome from "./components/DashboardWelcome";
import DashboardUpcomingStays from "./components/DashboardUpcomingStays";
import DashboardHomes from "./components/DashboardHomes";
import DashboardTasks from "./components/DashboardTasks";

// ✅ 整合 Account 页面的组件
import DashboardProfileCard from "./components/DashboardProfileCard";
import DashboardFavourites from "./components/DashboardFavourites";
import DashboardPointsHistory from "./components/DashboardPointsHistory";

// ✅ 新增：认证状态横幅
import VerificationStatusBanner from "./components/VerificationStatusBanner";

import {
  UPCOMING_STAYS,
  DASHBOARD_HOMES,
} from "./lib/dashboardData";

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  // 确保 Supabase 里有一条 user_profile
  useEffect(() => {
    fetch("/api/profile/ensure", {
      method: "POST",
    }).catch((err) => {
      console.error("ensure profile failed:", err);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 顶部导航 */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* ✅ 1. 认证状态横幅 - 显示在最顶部 */}
        <VerificationStatusBanner />

        {/* 2. Welcome + Membership card */}
        <DashboardWelcome />

        {/* ✅ 4. 资料卡片 + 审核状态 + 推荐码 (从 Account 页面整合过来) */}
        <DashboardProfileCard />

        {/* 5. 左：我的房源   右：我的收藏 */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardHomes homes={DASHBOARD_HOMES} />
          <DashboardFavourites />
        </section>

        {/* ✅ 6. 积分流水 (从 Account 页面整合过来) */}
        <DashboardPointsHistory />

        {/* 7. 行程 & 下一步任务 */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardUpcomingStays stays={UPCOMING_STAYS} />
          <DashboardTasks />
        </section>
      </main>
    </div>
  );
}