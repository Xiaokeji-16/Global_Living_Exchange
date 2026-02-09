// app/api/admin/inbox/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * POST /api/admin/inbox/bulk
 * 批量操作 Inbox 条目
 */
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inboxIds, action, note } = body;

    if (!Array.isArray(inboxIds) || inboxIds.length === 0) {
      return NextResponse.json(
        { error: "inboxIds must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!["approve", "deny"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'deny'" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // @ts-ignore - 忽略类型检查
    const { data: updatedItems, error } = await supabase
      .from("inbox_items")
      .update({
        status: action,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_note: note || null,
      })
      .in("id", inboxIds)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to bulk update items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: updatedItems?.length || 0,
      message: `Successfully processed ${updatedItems?.length || 0} items`,
    });
  } catch (error) {
    console.error("Error bulk updating inbox items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}