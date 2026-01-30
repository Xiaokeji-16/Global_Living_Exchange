// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/TS/supabase-server";

export async function GET() {
  // 1. 从 Supabase 取 profiles 表
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[admin/users] profiles select error:", error);
    return NextResponse.json(
      { error: "Failed to load profiles" },
      { status: 500 }
    );
  }

  // 2. 抽出所有 clerk_user_id
  const clerkIds = data
    .map((row) => row.clerk_user_id as string | null)
    .filter((id): id is string => !!id);

  let clerkUsers: any[] = [];

  if (clerkIds.length > 0) {
    // ⭐ 关键修改：先 await clerkClient() 拿到真正的 client 实例
    const client = await clerkClient();

    const { data: usersFromClerk } = await client.users.getUserList({
      userId: clerkIds,
      limit: 100,
    });

    clerkUsers = usersFromClerk as any[];
  }

  // 3. 用 Map 按 id 快速查 Clerk 用户
  const clerkMap = new Map<string, any>(
    clerkUsers.map((u: any) => [u.id, u])
  );

  // 4. 合并 Supabase + Clerk 数据
  const rows = data.map((p) => {
    const cu: any = clerkMap.get(p.clerk_user_id);

    const email: string | null =
      cu?.primaryEmailAddress?.emailAddress ??
      cu?.emailAddresses?.[0]?.emailAddress ??
      null;

    const role: string =
      (cu?.publicMetadata?.role as string | undefined) ?? "member";

    return {
      id: p.id,
      clerkUserId: p.clerk_user_id,
      displayName: p.display_name ?? cu?.fullName ?? null,
      email,
      avatarUrl: p.avatar_url ?? cu?.imageUrl ?? null,
      role,
      location: p.location ?? null,
      createdAt: p.created_at ?? null,
    };
  });

  return NextResponse.json({ items: rows });
}