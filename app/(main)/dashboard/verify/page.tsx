// app/dashboard/verify/page.tsx
"use client";

import { Header } from "../../../components/Header";
import { AuthedShell } from "../../../components/AuthedShell";
import { useTheme } from "../../../hooks/useTheme";
import { useLogout } from "../../../hooks/useLogout";
import { useUser } from "@clerk/nextjs";
import UserVerificationForm from "../components/UserVerificationForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  fetchVerificationStatus,
  type VerificationStatus,
} from "../lib/verificationStatus";

export default function VerifyPage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();
  const { user } = useUser();
  const [status, setStatus] = useState<VerificationStatus>(null);
  const [loading, setLoading] = useState(true);

  const displayName =
    user?.firstName || user?.fullName || user?.username || "there";

  useEffect(() => {
    async function loadVerificationStatus() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setStatus(await fetchVerificationStatus());
      } catch (err) {
        console.error("Error fetching verification status:", err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }

    loadVerificationStatus();
  }, [user?.id]);

  return (
    <AuthedShell>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* 返回链接 */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* 页面标题 */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Identity Verification
          </h1>
          <p className="text-sm md:text-base text-[rgb(var(--color-muted))]">
            Hi {displayName}, verify your identity to unlock full platform access and start exchanging homes.
          </p>
        </section>

        {/* 验证表单 */}
        {!loading && <UserVerificationForm existingStatus={status} />}
      </main>
    </AuthedShell>
  );
}
