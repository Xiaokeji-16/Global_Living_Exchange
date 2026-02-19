// app/api/stay-requests/[id]/route.ts
// 获取单个住宿请求的详情

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const requestId = params.id;

    const supabase = createServerSupabaseClient();

    // 获取请求详情
    const { data: stayRequest, error } = await supabase
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
          property_type,
          guests,
          bedrooms,
          beds,
          bathrooms,
          clerk_user_id
        )
      `)
      .eq("id", requestId)
      .single();

    if (error || !stayRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // 验证用户权限 (只有 guest 或 host 可以查看)
    if (stayRequest.guest_user_id !== userId && stayRequest.host_user_id !== userId) {
      return NextResponse.json(
        { error: "Not authorized to view this request" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      request: stayRequest,
    });

  } catch (error) {
    console.error("Error fetching stay request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}