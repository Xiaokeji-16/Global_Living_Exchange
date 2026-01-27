// app/admin/components/AdminUserVerificationList.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/TS/supabaseClient";

// 审核状态类型（和你 Supabase 表里的约定保持一致）
type VerificationStatus = "pending" | "approved" | "rejected";

// 一条用户认证申请记录的类型（字段按你自己的表来改）
export type VerificationRecord = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;        // 如果表里没有就删掉
  message: string | null;        // 如果表里没有就删掉
  status: VerificationStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_comment: string | null;
};

export default function AdminUserVerificationList() {
  const [items, setItems] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // 加载待审核列表
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("user_verifications") // ✅ 这里只写表名
        .select("*")                // ✅ 不要再写 <VerificationRecord>
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load verification requests.");
      } else {
        // ✅ 在这里把返回的数据断言成 VerificationRecord[]
        setItems((data ?? []) as VerificationRecord[]);
      }

      setLoading(false);
    };

    load();
  }, []);

  // 通用的更新状态函数
  const updateStatus = async (
    id: string,
    status: VerificationStatus,
    comment?: string
  ) => {
    setSubmittingId(id);
    setError(null);

    const { error } = await supabase
      .from("user_verifications")
      .update({
        status,
        review_comment: comment ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSubmittingId(null);

    if (error) {
      console.error(error);
      setError("Failed to update request.");
      return;
    }

    // 审核完后，把这条记录从 pending 列表里移除
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApprove = (item: VerificationRecord) =>
    updateStatus(item.id, "approved");

  const handleReject = (item: VerificationRecord) =>
    updateStatus(item.id, "rejected");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Identity verifications</h2>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
        {/* Loading 状态 */}
        {loading && (
          <div className="px-6 py-4 text-sm text-[rgb(var(--color-muted))]">
            Loading requests…
          </div>
        )}

        {/* 错误提示 */}
        {!loading && error && (
          <div className="px-6 py-4 text-sm text-red-500">{error}</div>
        )}

        {/* 空列表 */}
        {!loading && !error && items.length === 0 && (
          <div className="px-6 py-4 text-sm text-[rgb(var(--color-muted))]">
            No pending identity verifications.
          </div>
        )}

        {/* 有数据时的列表 */}
        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-[rgb(var(--color-border))]">
            {items.map((item) => (
              <li
                key={item.id}
                className="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {item.full_name || "Unnamed user"}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-muted))]">
                    {item.email}
                    {item.country ? ` · ${item.country}` : ""}
                  </p>
                  {item.message && (
                    <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">
                      {item.message}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-[rgb(var(--color-muted))]">
                    Submitted at{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    type="button"
                    disabled={submittingId === item.id}
                    onClick={() => handleApprove(item)}
                    className="rounded-full px-3 py-1 text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {submittingId === item.id ? "Saving…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={submittingId === item.id}
                    onClick={() => handleReject(item)}
                    className="rounded-full px-3 py-1 text-xs font-medium border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-border))/20] disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}