// app/components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import CustomFieldsPage from "@/app/components/CustomFieldsPage";
import { Menu, X, Moon, Sun, Inbox, Sparkles } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  /**
   * public  = 未登录
   * authed  = 普通用户登录后的导航
   * admin   = 管理端导航（Inbox 等）
   */
  variant?: "public" | "authed" | "admin";
  onLogoutClick?: () => void;
}

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export function Header({
  theme,
  toggleTheme,
  variant = "public",
  onLogoutClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 避免 hydration 问题
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 游客版导航
  const publicNavLinks: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Property", href: "/properties" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ];

  // 登录用户版导航
  const authedNavLinks: NavItem[] = [
    { label: "Home", href: "/dashboard" },
    { label: "Property", href: "/dashboard/properties" },
    { label: "Upload home", href: "/upload-home" },
    { label: "Account", href: "/dashboard/account" },
    { label: "Feedback", href: "/dashboard/contact" },
  ];

  // 管理端导航
  const adminNavLinks: NavItem[] = [
    {
      label: "Inbox",
      href: "/admin/inbox",
      icon: <Inbox size={16} className="mr-1.5" />,
    },
  ];

  const navLinks =
    variant === "admin"
      ? adminNavLinks
      : variant === "authed"
      ? authedNavLinks
      : publicNavLinks;

  const isPublic = variant === "public";
  const isAdmin = variant === "admin";

  const handleLogout = () => {
    onLogoutClick?.();
  };

  const renderThemeIcon = () => {
    if (!mounted) return <Moon size={18} />;
    return theme === "light" ? <Moon size={18} /> : <Sun size={18} />;
  };

  // 把带自定义 tab 的 UserButton 抽成一个小组件，桌面 / 手机都复用
  const RenderUserButton = () => (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8", // 桌面版大小，手机那边可以覆盖
          userButtonPopoverCard: "w-[480px]", // 让弹窗宽一点（可选）
        },
      }}
    >
      {/* 自定义 tab：自定义字段 */}
      <UserButton.UserProfilePage
        label="Preference"
        url="custom-fields"
        labelIcon={<Sparkles size={14} />}
      >
        <CustomFieldsPage />
      </UserButton.UserProfilePage>
    </UserButton>
  );

  return (
    <header className="sticky top-0 z-50 bg-[rgb(var(--color-background))]/95 backdrop-blur border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={isAdmin ? "/admin" : "/"}
            className="flex items-center gap-2"
          >
            <Image
              src="/icon/home_app_logo.svg"
              alt="Global Living Exchange Logo"
              width={45}
              height={45}
            />
            <span className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))]">
              Global Living Exchange
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                {item.icon}
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
                  href="/sign-in"
                  className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="px-6 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-full hover:opacity-90 transition-opacity text-base md:text-lg font-medium"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Clerk 用户头像 + 自定义字段 tab */}
                <RenderUserButton />

                {isAdmin && (
                  <span className="text-xs font-semibold tracking-wide text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/40 rounded-full px-3 py-1">
                    ADMIN
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Logout
                </button>
              </div>
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
              onClick={() => setMobileMenuOpen((open) => !open)}
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
                  className="flex items-center text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              <div className="pt-3 flex flex-col space-y-2 border-t border-[rgb(var(--color-border))]">
                {isPublic ? (
                  <>
                    <Link
                      href="/sign-in"
                      className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-6 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-full hover:opacity-90 transition-opacity text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    {/* 手机端也用同一个 UserButton（带自定义字段 tab） */}
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7",
                          userButtonPopoverCard: "w-[480px]",
                        },
                      }}
                    >
                      <UserButton.UserProfilePage
                        label="Preference"
                        url="custom-fields"
                        labelIcon={<Sparkles size={14} />}
                      >
                     <CustomFieldsPage />
                      </UserButton.UserProfilePage>
                    </UserButton>
                      

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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}