// app/components/hooks/useTheme.ts
"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  // 始终以 "light" 作为初始值（服务端和客户端一致）
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 标记是否已挂载
  const [mounted, setMounted] = useState(false);

  // 客户端挂载后，从 localStorage 读取真实主题
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  // 主题变化时更新 DOM 和 localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // 只在挂载后才写入 localStorage，避免覆盖用户设置
    if (mounted) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme, mounted };
}