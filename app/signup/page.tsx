// app/signup/page.tsx
"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../hooks/useTheme";

export default function SignupPage() {
  // 主题（和 login 一样）
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // 表单字段状态
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // 提交状态 & 错误提示
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Please fill in name, email and password.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          country,
          city,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        setError(
          data?.error || "Failed to sign up. Please check your details and try again."
        );
        return;
      }

      // 真实注册成功
      alert("Signup successful! You can now log in.");
      router.push("/login");
    } catch (err) {
      console.error("[signup] client error:", err);
      setError("Unexpected error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 右上角深浅色切换按钮：方形 */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* 页面主体 */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-card-foreground))] shadow-sm p-6 md:p-8">
          {/* 标题 */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              Sign up
            </h1>
            <p className="text-sm text-[rgb(var(--color-muted))]">
              Create your Global Living Exchange account.
            </p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

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
                autoComplete="new-password"
                className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1" htmlFor="country">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                  placeholder="e.g. Australia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                  placeholder="e.g. Adelaide"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="text-xs text-red-500 mt-1">
                {error}
              </p>
            )}

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting ? "Signing up..." : "Sign up"}
            </button>
          </form>

          {/* 底部：已有账号？去登录 */}
          <div className="mt-6 text-center text-sm">
            <span className="text-[rgb(var(--color-muted))]">
              Already have an account?
            </span>{" "}
            <Link
              href="/login"
              className="text-[rgb(var(--color-primary))] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}