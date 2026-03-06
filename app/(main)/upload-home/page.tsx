// app/upload-home/page.tsx
"use client";

import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";
import { UploadHomeForm } from "./components/UploadHomeForm";

export default function UploadHomePage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 登录版导航：从 dashboard 顶部过来的 Upload home */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <UploadHomeForm />
      </main>
    </div>
  );
}