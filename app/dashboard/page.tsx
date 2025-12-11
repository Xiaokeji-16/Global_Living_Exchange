"use client";

import { DashboardHeader } from "../components/dashboardHeader";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 这里先写一点占位内容，比如“Welcome to your dashboard” */}
      </main>
    </div>
  );
}