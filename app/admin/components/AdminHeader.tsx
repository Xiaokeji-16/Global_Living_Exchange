// app/admin/components/AdminHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import CustomFieldsPage from "@/app/components/CustomFieldsPage";
import { Menu, X, Moon, Sun, Inbox, Sparkles, LayoutDashboard } from "lucide-react";

interface AdminHeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  onLogoutClick?: () => void;
}

export default function AdminHeader({
  theme,
  toggleTheme,
  onLogoutClick,
}: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const adminNavLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={16} className="mr-1.5" />,
    },
    {
      label: "Inbox",
      href: "/admin/inbox",
      icon: <Inbox size={16} className="mr-1.5" />,
    },
  ];

  const renderThemeIcon = () => {
    if (!mounted) return <Moon size={18} />;
    return theme === "light" ? <Moon size={18} /> : <Sun size={18} />;
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgb(var(--color-background))]/95 backdrop-blur border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
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
            {adminNavLinks.map((item) => (
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

            <div className="flex items-center space-x-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
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

              <span className="text-xs font-semibold tracking-wide text-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))]/40 rounded-full px-3 py-1">
                ADMIN
              </span>

              <button
                type="button"
                onClick={onLogoutClick}
                className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                Logout
              </button>
            </div>
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
              {adminNavLinks.map((item) => (
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

              <div className="pt-3 flex items-center justify-between border-t border-[rgb(var(--color-border))]">
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
                    onLogoutClick?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}