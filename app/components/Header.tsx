// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  /** 顶部导航是游客版还是登录版 */
  variant?: "public" | "authed";
  /** 点击 Logout 时的回调（以后可以在这里清理 token、跳转到 /login 等） */
  onLogoutClick?: () => void;
}

export function Header({
  theme,
  toggleTheme,
  variant = "public",
  onLogoutClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 只用来避免 hydration 问题
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 游客版导航
  const publicNavLinks = [
    { label: "Home", href: "/" },
    { label: "Property", href: "/properties" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ];

  // 登录版导航
  const authedNavLinks = [
    { label: "Home", href: "/dashboard" },
    { label: "Property", href: "/dashboard/properties" },
    { label: "Upload home", href: "/upload-home" }, // 以后可以改成 /dashboard/upload-home
    { label: "My account", href: "/dashboard/account" },       // 以后可以改成 /dashboard/account
    { label: "Feedback", href: "/dashboard/contact" },
  ];

  const navLinks = variant === "authed" ? authedNavLinks : publicNavLinks;
  const isPublic = variant === "public";

  const handleLogout = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
  };

  // 根据 mounted + theme 决定显示哪个图标
  const renderThemeIcon = () => {
    if (!mounted) return <Moon size={18} />; // 首屏统一显示 Moon
    return theme === "light" ? <Moon size={18} /> : <Sun size={18} />;
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgb(var(--color-background))]/95 backdrop-blur border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image
              src="/icon/home_app_logo.svg"
              alt="Global Living Exchange Logo"
              width={45}
              height={45}
            />
            <span className="flex-shrink-0 flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]">
              Global Living Exchange
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              aria-label="Toggle theme"
            >
              {renderThemeIcon()}
            </button>

            {isPublic ? (
              <>
                <Link
                  href="/login"
                  className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-full hover:opacity-90 transition-opacity text-base md:text-lg font-medium"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              aria-label="Toggle theme"
            >
              {renderThemeIcon()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-3 flex flex-col space-y-2 border-t border-[rgb(var(--color-border))]">
                {isPublic ? (
                  <>
                    <Link
                      href="/login"
                      className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="px-6 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-full hover:opacity-90 transition-opacity text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors text-left"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}