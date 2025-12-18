// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import DashboardWelcome from "./components/DashboardWelcome";
import DashboardStatsRow from "./components/DashboardStatsRow";
import DashboardUpcomingStays from "./components/DashboardUpcomingStays";
import DashboardHomes from "./components/DashboardHomes";
import DashboardTasks from "./components/DashboardTasks";

import {
  DASHBOARD_SUMMARY,
  UPCOMING_STAYS,
  DASHBOARD_HOMES,
  NEXT_STEP_TASKS,
} from "./lib/dashboardData";

export default function DashboardPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 顶部导航：登录后的版本 */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 第一块：Welcome + Membership card */}
        <DashboardWelcome summary={DASHBOARD_SUMMARY} />

        {/* 第二块：三张统计卡片 */}
        <DashboardStatsRow summary={DASHBOARD_SUMMARY} />

        {/* 第三块：左右两列 */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <DashboardUpcomingStays stays={UPCOMING_STAYS} />
          <DashboardHomes homes={DASHBOARD_HOMES} />
        </section>

        {/* 第四块：下一步任务 */}
        <DashboardTasks tasks={NEXT_STEP_TASKS} />
      </main>
    </div>
  );
}