// app/dashboard/components/DashboardWelcome.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/TS/supabaseClient";
import { CheckCircle2, Clock, AlertCircle, Crown, Shield, Sparkles } from "lucide-react";

type VerificationStatus = "approved" | "pending" | "rejected" | null;

export default function DashboardWelcome() {
  const { user } = useUser();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [loading, setLoading] = useState(true);

  const displayName = user?.firstName || user?.fullName || user?.username || "there";

  useEffect(() => {
    async function fetchVerificationStatus() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_verifications")
          .select("status")
          .eq("clerk_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error) {
          setVerificationStatus(data?.status || null);
        }
      } catch (err) {
        console.error("Error fetching verification:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVerificationStatus();
  }, [user?.id]);

  // 根据认证状态确定会员信息
  const getMembershipInfo = () => {
    if (loading) {
      return {
        status: "Loading...",
        note: "Please wait...",
        icon: Clock,
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
        iconColor: "text-gray-600 dark:text-gray-400",
        borderColor: "border-gray-200 dark:border-gray-800",
      };
    }

    switch (verificationStatus) {
      case "approved":
        return {
          status: "Verified Member",
          note: "You have full access to all platform features and the curated community.",
          icon: CheckCircle2,
          bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          borderColor: "border-emerald-200 dark:border-emerald-800",
        };
      case "pending":
        return {
          status: "Verification Pending",
          note: "Your verification is being reviewed. You'll have full access once approved.",
          icon: Clock,
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          iconColor: "text-amber-600 dark:text-amber-400",
          borderColor: "border-amber-200 dark:border-amber-800",
        };
      case "rejected":
        return {
          status: "Pre-launch Beta Member",
          note: "Please resubmit your verification to gain full access to the platform.",
          icon: AlertCircle,
          bgColor: "bg-red-50 dark:bg-red-900/20",
          iconColor: "text-red-600 dark:text-red-400",
          borderColor: "border-red-200 dark:border-red-800",
        };
      default:
        return {
          status: "Pre-launch Beta Member",
          note: "Complete your identity verification to unlock full platform access and join our curated community.",
          icon: Sparkles,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          borderColor: "border-blue-200 dark:border-blue-800",
        };
    }
  };

  const membershipInfo = getMembershipInfo();
  const MembershipIcon = membershipInfo.icon;

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
      {/* 左：Welcome 文案 */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3">
          Welcome back{displayName !== "there" ? `, ${displayName}` : ""}
        </h1>
        <p className="text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-xl">
          Here you can see your upcoming stays, listed homes, and the
          steps to complete your verification for Global Living Exchange.
        </p>
      </div>

      {/* 右：会员信息卡片 - 带图标和渐变背景 */}
      <div className={`rounded-2xl border ${membershipInfo.borderColor} ${membershipInfo.bgColor} px-5 py-4 sm:px-6 sm:py-5`}>
        <div className="flex items-start gap-3">
          {/* 图标 */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${membershipInfo.bgColor} border ${membershipInfo.borderColor} flex items-center justify-center`}>
            <MembershipIcon className={`w-5 h-5 ${membershipInfo.iconColor}`} />
          </div>

          {/* 文字内容 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))] uppercase mb-1">
              Membership status
            </p>
            <p className={`text-base sm:text-lg font-semibold mb-1.5 ${membershipInfo.iconColor}`}>
              {membershipInfo.status}
            </p>
            <p className="text-xs text-[rgb(var(--color-muted))] leading-relaxed">
              {membershipInfo.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}