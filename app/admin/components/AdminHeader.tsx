// app/admin/components/AdminHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, ShieldCheck, Inbox } from "lucide-react";

type AdminHeaderProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  onLogoutClick: () => void;
  userName?: string | null;
};

export default function AdminHeader({
  theme,
  toggleTheme,
  onLogoutClick,
  userName,
}: AdminHeaderProps) {
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/95 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 左侧：Logo + 顶部导航 */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon/home_app_logo.svg"
              alt="Global Living Exchange Logo"
              width={28}
              height={28}
            />
            <span className="text-sm font-medium text-[rgb(var(--color-muted))]">
              Global Living Exchange
            </span>
          </Link>

          <span className="hidden h-4 w-px bg-[rgb(var(--color-border))] sm:block" />

          {/* 顶部导航：User verification + Inbox */}
          <div className="hidden items-center gap-3 md:flex text-xs font-medium">
            <a
              href="#identity"
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-[rgb(var(--color-muted))] hover:border-[rgb(var(--color-primary))]/40 hover:bg-[rgb(var(--color-primary))]/5 hover:text-[rgb(var(--color-foreground))] transition-colors"
            >
              {/* 这里把原来的 Admin console 图标放到 User verification 前面 */}
              <ShieldCheck className="h-3.5 w-3.5 text-[rgb(var(--color-primary))]" />
              <span>User verification</span>
            </a>

            <a
              href="#inbox"
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-[rgb(var(--color-muted))] hover:border-[rgb(var(--color-primary))]/40 hover:bg-[rgb(var(--color-primary))]/5 hover:text-[rgb(var(--color-foreground))] transition-colors"
            >
              <Inbox className="h-3.5 w-3.5" />
              <span>Inbox</span>
            </a>
          </div>
        </div>

        {/* 右侧：主题切换 + 当前用户 + Admin badge + 登出 */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-1.5 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="max-w-[140px] truncate text-sm text-[rgb(var(--color-muted))]">
              {userName ?? "Admin user"}
            </span>
            <span className="inline-flex items-center rounded-full bg-[rgb(var(--color-primary))/10] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">
              Admin
            </span>
          </div>

          <button
            type="button"
            onClick={onLogoutClick}
            className="rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}