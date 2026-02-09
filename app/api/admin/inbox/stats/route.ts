// app/api/admin/inbox/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * GET /api/admin/inbox/stats
 * 获取 Inbox 统计数据
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // 手动查询统计数据
    const [
      unreadResult,
      approvedResult,
      deniedResult,
      userVerificationsResult,
      propertyVerificationsResult,
      feedbacksResult,
      todayActionsResult,
    ] = await Promise.all([
      supabase.from("inbox_items").select("*", { count: "exact", head: true }).eq("status", "unread"),
      supabase.from("inbox_items").select("*", { count: "exact", head: true }).eq("status", "approve"),
      supabase.from("inbox_items").select("*", { count: "exact", head: true }).eq("status", "deny"),
      supabase.from("inbox_items").select("*", { count: "exact", head: true }).eq("type", "user_verification"),
      supabase.from("inbox_items").select("*", { count: "exact", head: true }).eq("type", "property_verification"),
      supabase.from("inbox_items").select("*", { count: "exact", head: true }).eq("type", "feedback"),
      supabase
        .from("inbox_items")
        .select("*", { count: "exact", head: true })
        .in("status", ["approve", "deny"])
        .gte("reviewed_at", new Date().toISOString().split("T")[0]),
    ]);

    return NextResponse.json({
      unread: unreadResult.count || 0,
      approved: approvedResult.count || 0,
      denied: deniedResult.count || 0,
      userVerifications: userVerificationsResult.count || 0,
      propertyVerifications: propertyVerificationsResult.count || 0,
      feedbacks: feedbacksResult.count || 0,
      todayActions: todayActionsResult.count || 0,
    });
  } catch (error) {
    console.error("Error fetching inbox stats:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}