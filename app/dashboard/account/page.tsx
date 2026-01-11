// app/dashboard/account/page.tsx
"use client";

import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useLogout";

// 复用你已经有的 dashboard 组件
import DashboardProfileCard from "../components/DashboardProfileCard";
import DashboardFavourites from "../components/DashboardFavourites";
import DashboardPointsHistory from "../components/DashboardPointsHistory";
import DashboardUpcomingStays from "../components/DashboardUpcomingStays";
import DashboardTasks from "../components/DashboardTasks";

import {
  UPCOMING_STAYS,
  NEXT_STEP_TASKS,
} from "../lib/dashboardData";

export default function DashboardAccountPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 顶部导航：登录版 */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 1. 个人资料 + 审核状态 + 推荐码等 */}
        <DashboardProfileCard />

        {/* 2. 左：我的房源收藏，右：积分流水 */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardFavourites />
          <DashboardPointsHistory />
        </section>

        {/* 3. 行程 & To-do（和 dashboard 页面可以共享同一套组件） */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardUpcomingStays stays={UPCOMING_STAYS} />
          <DashboardTasks tasks={NEXT_STEP_TASKS} />
        </section>
      </main>
    </div>
  );
}