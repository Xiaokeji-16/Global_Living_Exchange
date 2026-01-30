import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/TS/supabase-server";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const clerkId = user.id;

  // 你 profiles 里的字段
  const displayName =
    user.fullName ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    null;
  const avatarUrl = user.imageUrl ?? null;

  // 1. 先查 profiles 表
  const { data, error } = await supabase
    .from("profiles")              // ✅ 这里是 profiles
    .select("*")
    .eq("clerk_user_id", clerkId)
    .maybeSingle();

  if (error) {
    console.error("[ensureProfile] select error:", error);
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }

  if (data) {
    return NextResponse.json({ profile: data }, { status: 200 });
  }

  // 2. 没有就插入
  const payload = {
    clerk_user_id: clerkId,
    display_name: displayName,
    avatar_url: avatarUrl,
    location: null,
    bio: null,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")              // ✅ 这里也是 profiles
    .insert(payload)
    .select("*")
    .single();

  if (insertError) {
    console.error("[ensureProfile] insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile: inserted }, { status: 201 });
}