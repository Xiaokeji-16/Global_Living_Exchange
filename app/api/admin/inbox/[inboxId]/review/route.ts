// app/api/admin/inbox/[inboxId]/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * POST /api/admin/inbox/[inboxId]/review
 * 审核 Inbox 条目（批准或拒绝）
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ inboxId: string }> }  // params 是 Promise
) {
  try {
    // 验证管理员权限
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 重要：await params
    const { inboxId } = await context.params;
    
    const body = await request.json();
    const { action, note } = body;

    if (!["approve", "deny"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'deny'" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: updatedInbox, error } = await supabase
      .from("inbox_items")
      .update({
        status: action,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_note: note || null,
      })
      .eq("id", inboxId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to review item" },
        { status: 500 }
      );
    }

    if (!updatedInbox) {
      return NextResponse.json(
        { error: "Inbox item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inbox: updatedInbox,
      message: `Successfully ${action}d the item`,
    });
  } catch (error) {
    console.error("Error reviewing inbox item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/inbox/[inboxId]/review
 * 获取单个 Inbox 条目的详细信息（包含关联数据）
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ inboxId: string }> }  // params 是 Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 重要：await params
    const { inboxId } = await context.params;
    const supabase = createServerSupabaseClient();

    const { data: inbox, error: inboxError } = await supabase
      .from("inbox_items")
      .select("*")
      .eq("id", inboxId)
      .single();

    if (inboxError || !inbox) {
      return NextResponse.json(
        { error: "Inbox item not found" },
        { status: 404 }
      );
    }

    // 根据类型获取详细数据
    let detailedData = null;

    switch (inbox.type) {
      case "user_verification":
        const { data: uvData } = await supabase
          .from("user_verifications")
          .select("*")
          .eq("id", inbox.reference_id)
          .single();
        detailedData = uvData;
        break;

      case "property_verification":
        const { data: pvData } = await supabase
          .from("properties")
          .select("*")
          .eq("id", inbox.reference_id)
          .single();
        detailedData = pvData;
        break;

      case "feedback":
        const { data: fbData } = await supabase
          .from("feedbacks")
          .select("*")
          .eq("id", inbox.reference_id)
          .single();
        detailedData = fbData;
        break;
    }

    return NextResponse.json({
      inbox,
      details: detailedData,
    });
  } catch (error) {
    console.error("Error fetching inbox item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}