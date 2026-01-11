// app/dashboard/page.tsx
"use client";

import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";

import DashboardWelcome from "./components/DashboardWelcome";
import DashboardStatsRow from "./components/DashboardStatsRow";
import DashboardUpcomingStays from "./components/DashboardUpcomingStays";
import DashboardHomes from "./components/DashboardHomes";
import DashboardTasks from "./components/DashboardTasks";

// 新增的 My Account 相关区块
import DashboardProfileCard from "./components/DashboardProfileCard";
import DashboardFavourites from "./components/DashboardFavourites";
import DashboardPointsHistory from "./components/DashboardPointsHistory";

import {
  DASHBOARD_SUMMARY,
  UPCOMING_STAYS,
  DASHBOARD_HOMES,
  NEXT_STEP_TASKS,
} from "./lib/dashboardData";

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 顶部导航：登录后的版本（= My Account 顶部导航） */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 1. Welcome + Membership card */}
        <DashboardWelcome summary={DASHBOARD_SUMMARY} />

        {/* 2. 三张统计卡片（积分 / 房源数 / 收藏数） */}
        <DashboardStatsRow summary={DASHBOARD_SUMMARY} />

        {/* 3. 资料 + 审核状态 + 推荐码 */}
        <DashboardProfileCard />

        {/* 4. 左：我的房源   右：我的收藏 */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardHomes homes={DASHBOARD_HOMES} />
          <DashboardFavourites />
        </section>

        {/* 5. 积分流水（简单列表，先用假数据） */}
        <DashboardPointsHistory />

        {/* 6. 行程 & 下一步任务（可以当成“即将出行 + To-do”） */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardUpcomingStays stays={UPCOMING_STAYS} />
          <DashboardTasks tasks={NEXT_STEP_TASKS} />
        </section>
      </main>
    </div>
  );
}