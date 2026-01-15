// app/contact/components/FeedbackIdentitySection.tsx
"use client";

type FeedbackIdentitySectionProps = {
  /** public = 未登录 /contact, authed = 登录版 /dashboard/contact */
  mode: "public" | "authed";
  fullName: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
};

export default function FeedbackIdentitySection({
  mode,
  fullName,
  email,
  onFullNameChange,
  onEmailChange,
}: FeedbackIdentitySectionProps) {
  const isPublic = mode === "public";

  return (
    <div className="space-y-4">
      {/* Full name */}
      <div>
        <label className="block text-sm mb-1">Full name</label>
        <input
          type="text"
          className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          placeholder="e.g. Alex Johnson"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          // 登录版可以禁用编辑（因为我们已经从 Supabase 里带出来了）
          disabled={!isPublic}
        />
      </div>

      {/* Email address */}
      <div>
        <label className="block text-sm mb-1">Email address</label>
        <input
          type="email"
          className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={!isPublic}
        />
      </div>
    </div>
  );
}