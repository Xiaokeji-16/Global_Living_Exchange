// app/api/stay-requests/my-requests/route.ts
// 获取当前用户的所有住宿请求和预订

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // 获取作为 guest 的请求
    const { data: asGuest, error: guestError } = await supabase
      .from("stay_requests")
      .select(`
        *,
        property:properties (
          id,
          title,
          description,
          city,
          country,
          photos,
          clerk_user_id
        )
      `)
      .eq("guest_user_id", userId)
      .order("created_at", { ascending: false });

    if (guestError) {
      console.error("Fetch guest requests error:", guestError);
      return NextResponse.json(
        { error: "Failed to fetch requests" },
        { status: 500 }
      );
    }

    // 获取作为 host 的请求
    const { data: asHost, error: hostError } = await supabase
      .from("stay_requests")
      .select(`
        *,
        property:properties (
          id,
          title,
          description,
          city,
          country,
          photos,
          clerk_user_id
        )
      `)
      .eq("host_user_id", userId)
      .order("created_at", { ascending: false });

    if (hostError) {
      console.error("Fetch host requests error:", hostError);
      return NextResponse.json(
        { error: "Failed to fetch requests" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      asGuest: asGuest || [],
      asHost: asHost || [],
    });

  } catch (error) {
    console.error("Error fetching stay requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}