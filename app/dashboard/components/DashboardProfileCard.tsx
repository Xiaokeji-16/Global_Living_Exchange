// app/dashboard/components/DashboardProfileCard.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/TS/supabaseClient";

// ... 这里保留你原来的 props / 其它代码，如果有的话

export default function DashboardProfileCard() {
  const { user } = useUser();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("clerk_user_id", user.id)
        .maybeSingle();

      if (!error && data?.is_verified) {
        setIsVerified(true);
      }
    };

    load();
  }, [user]);

  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* 名字 + 已认证标识 */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">
              {user?.fullName ?? "Member"}
            </h2>
            {isVerified && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                Verified
              </span>
            )}
          </div>

          {/* 下面保留你原来 profile card 里的其他字段，如 Email / Location / Review 状态等 */}
          {/* ... */}
        </div>

        {/* 右上角如果有 Edit profile 按钮的话，保持不变 */}
        {/* ... */}
      </div>
    </section>
  );
}