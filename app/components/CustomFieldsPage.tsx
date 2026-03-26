"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

type Gender = "male" | "female" | "other" | "";

export default function CustomFieldsPage() {
  const { user, isLoaded } = useUser();

  const [gender, setGender] = useState<Gender>(
    ((user?.unsafeMetadata?.gender as string) || "") as Gender
  );

  const [birthday, setBirthday] = useState<string>(
    (user?.unsafeMetadata?.birthday as string) || ""
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setMessage("");

      const unsafeMetadata: Record<string, string> = {};

      if (gender) {
        unsafeMetadata.gender = gender;
      }

      if (birthday) {
        unsafeMetadata.birthday = birthday;
      }

      await user.update({
        unsafeMetadata,
      });

      setMessage("已保存 ✅");
    } catch (error) {
      console.error("Save failed:", error);
      setMessage("保存失败 ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4">Please sign in first.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4 border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold">Custom Profile Fields</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full rounded-lg px-4 py-2 border bg-black text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}