"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
 
export default function LoginPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    // Check system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

    useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };    

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 暂时只做前端校验 + 提示，不接后端
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // 这里先做一个假的提示，后面再接后端 API
    alert(`Mock login success for: ${email}`);
  };

  return (
    <>
    {/* 右上角深浅色切换按钮 */}
        <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-card-foreground))] shadow-sm p-6 md:p-8">
        {/* 标题 */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Log in
          </h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">
            Log in to your Global Living Exchange account.
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            className="w-full mt-2 rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Log in
          </button>
        </form>

        {/* 底部：跳转到 Sign up */}
        <div className="mt-6 text-center text-sm">
          <span className="text-[rgb(var(--color-muted))]">
            Don&apos;t have an account?
          </span>{" "}
          <Link
            href="/signup"
            className="text-[rgb(var(--color-primary))] hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  </>
  );
}