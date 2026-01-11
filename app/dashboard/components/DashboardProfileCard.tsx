// app/dashboard/components/DashboardProfileCard.tsx
"use client";

import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";

type Profile = {
  name: string;
  email: string;
  location: string;
  reviewStatus: string;
};

// 先用一份假数据，当作当前用户资料
const INITIAL_PROFILE: Profile = {
  name: "Chen Xiaoke",
  email: "chen@example.com",
  location: "Adelaide, Australia",
  reviewStatus: "Approved",
};

export default function DashboardProfileCard() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);

  // 编辑状态 & 表单数据
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Profile>(profile);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Profile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(profile);      // 还原成原来的数据
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // TODO：以后在这里调用后端 API / Supabase 真正保存
      // await fetch("/api/account/profile", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });

      // 现在先本地更新，刷新页面就会丢失（demo 版本）
      setProfile(form);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Save failed, please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
      {/* 左侧：My profile（可编辑） */}
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold">My profile</h2>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs sm:text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-foreground))] transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1 rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs sm:text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--color-primary))] px-3 py-1 text-xs sm:text-sm text-[rgb(var(--color-primary-foreground))] hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                <Check className="w-3 h-3" />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <dl className="space-y-3 text-sm">
          {/* Name */}
          <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-x-4 gap-y-1">
            <dt className="text-[rgb(var(--color-muted))]">Name</dt>
            <dd className="text-[rgb(var(--color-foreground))]">
              {isEditing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                />
              ) : (
                profile.name
              )}
            </dd>
          </div>

          {/* Email */}
          <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-x-4 gap-y-1">
            <dt className="text-[rgb(var(--color-muted))]">Email</dt>
            <dd className="text-[rgb(var(--color-foreground))]">
              {isEditing ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                />
              ) : (
                profile.email
              )}
            </dd>
          </div>

          {/* Location */}
          <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-x-4 gap-y-1">
            <dt className="text-[rgb(var(--color-muted))]">Location</dt>
            <dd className="text-[rgb(var(--color-foreground))]">
              {isEditing ? (
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                />
              ) : (
                profile.location
              )}
            </dd>
          </div>

          {/* Review / 审核状态：一般不给用户改，这里只读 */}
          <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-x-4 gap-y-1">
            <dt className="text-[rgb(var(--color-muted))]">Review</dt>
            <dd className="text-[rgb(var(--color-foreground))]">
              {profile.reviewStatus}
            </dd>
          </div>
        </dl>
      </div>

      {/* 右侧 Referral 卡片：保持原来静态即可 */}
      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-xs font-medium tracking-wide text-[rgb(var(--color-muted))] uppercase mb-1">
          Referral
        </p>
        <p className="text-sm text-[rgb(var(--color-foreground))] mb-2">
          Invite friends and earn points when they complete verification.
        </p>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-[rgb(var(--color-secondary))] px-4 py-3 text-sm">
          <span className="font-mono text-[rgb(var(--color-foreground))]">
            GLX–123ABC
          </span>
          <button
            type="button"
            className="rounded-full bg-[rgb(var(--color-primary))] px-3 py-1 text-xs text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition-opacity"
            onClick={() => {
              navigator.clipboard
                .writeText("GLX-123ABC")
                .catch(() => alert("Failed to copy"));
            }}
          >
            Copy link
          </button>
        </div>
      </div>
    </section>
  );
}