// app/dashboard/components/VerificationStatusBanner.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/TS/supabaseClient";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

type VerificationStatus = "approved" | "pending" | "rejected" | null;

export default function VerificationStatusBanner() {
  const { user } = useUser();
  const [status, setStatus] = useState<VerificationStatus>(null);
  const [loading, setLoading] = useState(true);

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

        if (error) {
          console.error("Error fetching verification status:", error);
          setStatus(null);
        } else {
          setStatus(data?.status || null);
        }
      } catch (err) {
        console.error("Error:", err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    }

    fetchVerificationStatus();
  }, [user?.id]);

  if (loading) {
    return null;
  }

  // 已验证通过 - 不显示横幅，因为名字旁边已经有绿色图标了
  if (status === "approved") {
    return null;
  }

  // 审核中
  if (status === "pending") {
    return (
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Verification Pending
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Your verification request is being reviewed. We'll notify you once it's complete.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 被拒绝
  if (status === "rejected") {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Verification Rejected
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Unfortunately, we couldn't verify your identity. Please submit again with correct information.
            </p>
            <Link
              href="/dashboard/verify"
              className="inline-block mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Submit verification again →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 未提交验证
  return (
    <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Verification Required
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Complete your identity verification to unlock full platform features and start exchanging homes.
          </p>
          <Link
            href="/dashboard/verify"
            className="inline-block mt-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Complete verification
          </Link>
        </div>
      </div>
    </div>
  );
}