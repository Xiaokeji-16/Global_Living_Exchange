// app/dashboard/components/DashboardProfileCard.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/TS/supabaseClient";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

type VerificationStatus = "approved" | "pending" | "rejected" | null;

export default function DashboardProfileCard() {
  const { user } = useUser();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadVerificationStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("user_verifications")
          .select("status")
          .eq("clerk_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching verification status:", error);
          setVerificationStatus(null);
        } else {
          setVerificationStatus(data?.status || null);
        }
      } catch (err) {
        console.error("Error:", err);
        setVerificationStatus(null);
      } finally {
        setLoading(false);
      }
    };

    loadVerificationStatus();
  }, [user]);

  // 渲染认证状态图标和按钮
  const renderVerificationBadge = () => {
    if (loading) {
      return null;
    }

    // 已认证 - 绿色图标
    if (verificationStatus === "approved") {
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Verified
          </span>
        </div>
      );
    }

    // 认证中 - 黄色图标
    if (verificationStatus === "pending") {
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
            Pending
          </span>
        </div>
      );
    }

    // 未认证或被拒绝 - 红色图标 + 进行认证按钮
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Not verified
          </span>
        </div>
        <Link
          href="/dashboard/verify"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Verify now
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          {/* 名字 + 认证状态图标 */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {user?.fullName ?? "Member"}
            </h2>
            {renderVerificationBadge()}
          </div>

          {/* 用户邮箱（可选） */}
          {user?.primaryEmailAddress?.emailAddress && (
            <p className="text-sm text-[rgb(var(--color-muted))]">
              {user.primaryEmailAddress.emailAddress}
            </p>
          )}

          {/* 下面可以添加其他信息，比如推荐码、积分等 */}
          {/* 
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[rgb(var(--color-muted))]">Referral code:</span>
              <code className="px-2 py-0.5 rounded bg-[rgb(var(--color-muted))]/10 font-mono">
                COULSON2024
              </code>
            </div>
          </div>
          */}
        </div>

        {/* 右上角编辑按钮（可选） */}
        {/*
        <button className="text-sm text-[rgb(var(--color-primary))] hover:underline">
          Edit profile
        </button>
        */}
      </div>
    </section>
  );
}