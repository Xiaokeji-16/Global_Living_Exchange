"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Property", href: "/#properties" },
  { label: "Upload home", href: "/upload-home" }, // 先占位
  { label: "My account", href: "/account" },      // 先占位
  { label: "Contact us", href: "/#contact" },
];

export function DashboardHeader() {
  // 主题状态（和你其他页面一致）
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 暂时的登出处理（先用 alert，占位）
  const handleLogout = () => {
    // 以后这里可以清除 localStorage / token，然后跳转
    alert("Logout (TODO: 接入真实登出逻辑)");
    // 例如以后可以：
    // localStorage.removeItem("gle_is_logged_in");
    // window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgb(var(--color-background))]/95 backdrop-blur border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon/home_app_logo.svg" // 你的图标路径
                alt="Global Living Exchange logo"
                width={28}
                height={28}
              />
              <span className="text-[rgb(var(--color-primary))] font-semibold text-xl md:text-2xl">
                Global Living Exchange
              </span>
            </Link>
          </div>

          {/* 中间导航（已登录版） */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* 右侧操作：主题切换 + Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] shadow-sm transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}