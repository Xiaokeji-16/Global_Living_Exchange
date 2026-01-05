// app/dashboard/properties/page.tsx
"use client";

import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
import PropertiesPage from "../../properties/page"; 
// 👆 如果你已经把 /properties/page.tsx 写好了，可以直接复用里面的组件逻辑。
// 不想复用也可以复制那边的 main 内容到这里。

export default function DashboardPropertiesPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"                  // ✅ 同样是登录版导航
        onLogoutClick={() => {
          console.log("logout clicked");
        }}
      />

      {/* 这里可以用你在 /properties 的那套 UI  */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 如果直接 import 不太好用，也可以手动写：SearchBar + List + Map */}
        <PropertiesPage />
      </main>
    </div>
  );
}