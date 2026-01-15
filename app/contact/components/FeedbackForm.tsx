// app/contact/components/FeedbackForm.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/TS/supabaseClient";

import FeedbackIdentitySection from "./FeedbackIdentitySection";
import FeedbackTopicField from "./FeedbackTopicField";
import FeedbackMessageField from "./FeedbackMessageField";
import FeedbackStatusBar from "./FeedbackStatusBar";

type FeedbackFormProps = {
  /** public = 未登录 /contact, authed = 登录版 /dashboard/contact */
  mode?: "public" | "authed";
};

export default function FeedbackForm({ mode = "public" }: FeedbackFormProps) {
  const isPublic = mode === "public";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Feature request");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ---------- 登录版：自动从 Supabase 获取当前用户 ----------
  useEffect(() => {
    if (mode !== "authed") return;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;

      const user = data.user;
      const meta = (user.user_metadata || {}) as Record<string, unknown>;

      const nameFromMeta =
        (meta.full_name as string | undefined) ||
        (meta.name as string | undefined) ||
        "";

      setFullName(nameFromMeta);
      setEmail(user.email ?? "");
    };

    loadUser();
  }, [mode]);

  // ---------- 提交 ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 未登录版本才强制要求填 name / email
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
      setError("Please tell us what you’d like to share.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("feedback").insert({
        full_name: fullName || null,
        email: email || null,
        message_type: topic,
        message,
      });

      if (insertError) throw insertError;

      setSuccess("Thanks for your feedback!");
      setMessage("");

      // public 版再清空姓名/邮箱；登录版保留
      if (isPublic) {
        setFullName("");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 身份信息区域 */}
      <FeedbackIdentitySection
        mode={mode}
        fullName={fullName}
        email={email}
        onFullNameChange={setFullName}
        onEmailChange={setEmail}
      />

      {/* 主题 / 类型 */}
      <FeedbackTopicField value={topic} onChange={setTopic} />

      {/* 消息正文 */}
      <FeedbackMessageField value={message} onChange={setMessage} />

      {/* 成功 / 错误提示 */}
      <FeedbackStatusBar error={error} success={success} />

      {/* 提交按钮（如果你已经在某个组件里写了按钮，可以直接放那边） */}
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
