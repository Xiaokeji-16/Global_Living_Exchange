// app/admin/inbox/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import AdminHeader from "../components/AdminHeader";
import InboxList from "../components/InboxList";
import { useTheme } from "../../hooks/useTheme";
import { useLogout } from "../../hooks/useLogout";

function isAdmin(user: ReturnType<typeof useUser>["user"]) {
  return user?.publicMetadata?.role === "admin";
}

export default function AdminInboxPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user || !isAdmin(user)) {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user || !isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <AdminHeader
        theme={theme}
        toggleTheme={toggleTheme}
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 标题 */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">Inbox</h1>
          <p className="text-sm md:text-base text-[rgb(var(--color-muted))]">
            Handle member identity verifications and approve new property listings.
          </p>
        </section>

        {/* Inbox 列表 - 使用卡片布局 */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* 用户身份验证 */}
          <InboxList
            type="user_verification"
            status="unread"
            title="User Verifications"
            description="Review identity documents and approve members"
          />

          {/* 房产审核 */}
          <InboxList
            type="property_verification"
            status="unread"
            title="Property Verifications"
            description="Review and approve new property listings"
          />
        </section>

        {/* 反馈（可选 - 如果需要的话） */}
        <section>
          <InboxList
            type="feedback"
            status="unread"
            title="User Feedback"
            description="Review and respond to user feedback"
          />
        </section>
      </main>
    </div>
  );
}