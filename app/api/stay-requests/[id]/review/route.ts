// app/api/stay-requests/[id]/review/route.ts
// 房主审核住宿请求 (批准/拒绝)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
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

    const body = await request.json();
    const { action, note } = body; // action: "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 1. 验证这是房主的请求
    const { data: stayRequest, error: fetchError } = await supabase
      .from("stay_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !stayRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (stayRequest.host_user_id !== userId) {
      return NextResponse.json(
        { error: "Not authorized to review this request" },
        { status: 403 }
      );
    }

    if (stayRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Request already reviewed" },
        { status: 400 }
      );
    }

    // 2. 更新请求状态
    const newStatus = action === "approve" ? "approved" : "rejected";
    
    const { data: updated, error: updateError } = await supabase
      .from("stay_requests")
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        review_note: note || null,
      })
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) {
      console.error("Update request error:", updateError);
      return NextResponse.json(
        { error: "Failed to update request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request: updated,
      message: `Request ${newStatus} successfully`,
    });

  } catch (error) {
    console.error("Error reviewing stay request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}