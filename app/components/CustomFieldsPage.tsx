// app/components/CustomFieldsPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Gender = "" | "male" | "female" | "other";

export default function CustomFieldsPage() {
  const { user, isLoaded } = useUser();

  const [gender, setGender] = useState<Gender>("");
  const [birthday, setBirthday] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");

  const [hostAcceptsKids, setHostAcceptsKids] = useState(false);
  const [hostAcceptsPets, setHostAcceptsPets] = useState(false);
  const [hostAllowsSmoking, setHostAllowsSmoking] = useState(false);
  const [hostAllowsParties, setHostAllowsParties] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------- 初始值：从 publicMetadata 读 ----------
  useEffect(() => {
    if (!isLoaded || !user) return;

    const pm = (user.publicMetadata || {}) as any;

    setGender((pm.gender as Gender) || "");
    setBirthday((pm.birthday as string) || "");

    if (Array.isArray(pm.languages)) {
      setLanguages(pm.languages.join(", "));
    } else {
      setLanguages((pm.languages as string) || "");
    }

    setHostAcceptsKids(!!pm.hostAcceptsKids);
    setHostAcceptsPets(!!pm.hostAcceptsPets);
    setHostAllowsSmoking(!!pm.hostAllowsSmoking);
    setHostAllowsParties(!!pm.hostAllowsParties);
  }, [isLoaded, user]);

  // ---------- 保存到 publicMetadata ----------
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // 保留原来的 publicMetadata 其他字段
      const current = (user.publicMetadata || {}) as any;

      const langsArray =
        languages.trim().length === 0
          ? null
          : languages
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

      // 构造 payload，用 any 绕过 Clerk 的 TS 限制
      const updatePayload: any = {
        publicMetadata: {
          ...current,
          gender: gender || null,
          birthday: birthday || null,
          languages: langsArray,
          hostAcceptsKids,
          hostAcceptsPets,
          hostAllowsSmoking,
          hostAllowsParties,
        },
      };

      await (user as any).update(updatePayload);

      setMessage("已保存 ✅");
    } catch (e) {
      console.error("Update publicMetadata failed:", e);
      setError("保存失败，请稍后再试。");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-sm text-slate-900">
      {/* 性别 */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Gender</h3>
        <div className="flex gap-2">
          {(["male", "female", "other"] as Gender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`px-3 py-1 rounded-full border text-xs capitalize ${
                gender === g
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* 生日 */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">
          Birthday
          <span className="ml-1 text-xs text-slate-400">(YYYY-MM-DD)</span>
        </h3>
        <input
          type="date"
          value={birthday || ""}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </section>

      {/* 语言 */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Languages you can host in</h3>
        <input
          type="text"
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          placeholder="例如: English, 中文, 日本語"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-slate-400">
          Multiple languages ​are separated by commas, for example: <code>English, Chinese, Japanese</code>
        </p>
      </section>

      {/* Hosting 偏好 */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Hosting preferences</h3>
        <div className="space-y-1 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hostAcceptsKids}
              onChange={(e) => setHostAcceptsKids(e.target.checked)}
            />
            <span>Accept guests with children</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hostAcceptsPets}
              onChange={(e) => setHostAcceptsPets(e.target.checked)}
            />
            <span>Accept guests with pets</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hostAllowsSmoking}
              onChange={(e) => setHostAllowsSmoking(e.target.checked)}
            />
            <span>Allow smoking in the home</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hostAllowsParties}
              onChange={(e) => setHostAllowsParties(e.target.checked)}
            />
            <span>Allow parties / gatherings</span>
          </label>
        </div>
      </section>

      {/* 操作 & 提示信息 */}
      <section className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "保存"}
        </button>

        {message && (
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            {message}
          </span>
        )}
        {error && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
            {error}
          </span>
        )}
      </section>
    </div>
  );
}