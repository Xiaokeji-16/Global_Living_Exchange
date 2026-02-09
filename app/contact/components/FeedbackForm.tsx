// app/contact/components/FeedbackForm.tsx
"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { useUser } from "@clerk/nextjs";

import FeedbackIdentitySection from "./FeedbackIdentitySection";
import FeedbackTopicField from "./FeedbackTopicField";
import FeedbackMessageField from "./FeedbackMessageField";
import FeedbackStatusBar from "./FeedbackStatusBar";

// ✅ 组件 props：public = 游客版 /contact，authed = 登录版 /dashboard/contact
type FeedbackFormProps = {
  mode?: "public" | "authed";
};

export default function FeedbackForm({ mode = "public" }: FeedbackFormProps) {
  const isPublic = mode === "public";

  // 从 Clerk 读当前用户
  const { user } = useUser();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Feature request");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ---------- 登录版：自动从 Clerk 填入姓名 / 邮箱 ----------
  useEffect(() => {
    if (mode !== "authed") return;
    if (!user) return; // Clerk 还没加载好

    const nameFromClerk =
      user.fullName ||
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    const emailFromClerk =
      user.primaryEmailAddress?.emailAddress ?? "";

    if (nameFromClerk) setFullName(nameFromClerk);
    if (emailFromClerk) setEmail(emailFromClerk);
  }, [mode, user]);

  // ---------- 提交 ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 只有游客版才强制要求填 name / email
    if (isPublic) {
      if (!fullName.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }
    }

    if (!message.trim()) {
      setError("Please tell us what you'd like to share.");
      return;
    }

    setSubmitting(true);

    try {
      // ✅ 使用 contact API（统一处理，有触发器和邮件通知）
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          messageType: topic,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to send feedback");
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || "Failed to send feedback");
      }

      setSuccess("Thanks for your feedback!");
      setMessage("");

      // 游客版清空姓名 / 邮箱；登录版保留（因为来自 Clerk）
      if (isPublic) {
        setFullName("");
        setEmail("");
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 顶部：姓名 + 邮箱（登录版会自动填） */}
      <FeedbackIdentitySection
        mode={mode}
        fullName={fullName}
        email={email}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
      />

      {/* 中间：选择类型 */}
      <FeedbackTopicField value={topic} onChange={setTopic} />

      {/* 文本内容 */}
      <FeedbackMessageField value={message} onChange={setMessage} />

      {/* 状态提示 */}
      <FeedbackStatusBar error={error} success={success} />

      {/* 提交按钮 */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] py-3 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
        >
          {submitting ? "Sending…" : "Send feedback"}
        </button>
      </div>
    </form>
  );
}