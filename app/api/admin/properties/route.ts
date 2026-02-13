// app/api/admin/properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * GET /api/admin/properties
 * 获取待审核的房产列表
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: 验证管理员权限
    // const user = await checkUserRole(userId);
    // if (user.role !== 'admin') {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const supabase = createServerSupabaseClient();

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    // 构建查询
    let query = supabase
      .from("properties")
      .select("*", { count: "exact" });

    // 过滤状态
    if (status !== "all") {
      query = query.eq("verification_status", status);
    }

    // 排序和分页
    query = query
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data: properties, error, count } = await query;

    if (error) {
      console.error("Fetch properties error:", error);
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      properties: properties || [],
      total: count || 0,
      page,
      pageSize,
      hasMore: count ? page * pageSize < count : false,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/properties/review
 * 审核房产（批准或拒绝）
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: 验证管理员权限

    const body = await request.json();
    const { propertyId, action, reviewNote } = body;

    if (!propertyId || !action) {
      return NextResponse.json(
        { error: "Property ID and action are required" },
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

    // 获取房产信息
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (fetchError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // 更新房产状态
    const newStatus = action === "approve" ? "approved" : "rejected";
    const { data: updated, error: updateError } = await supabase
      .from("properties")
      .update({
        verification_status: newStatus,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_comment: reviewNote || null,
      })
      .eq("id", propertyId)
      .select()
      .single();

    if (updateError) {
      console.error("Update property error:", updateError);
      return NextResponse.json(
        { error: "Failed to update property" },
        { status: 500 }
      );
    }

    // 更新相关的 inbox 条目
    const { error: inboxError } = await supabase
      .from("inbox_items")
      .update({
        status: action === "approve" ? "approve" : "deny",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        review_note: reviewNote || null,
      })
      .eq("reference_id", propertyId)
      .eq("type", "property_verification");

    if (inboxError) {
      console.error("Update inbox error:", inboxError);
      // 不返回错误,因为主要操作已成功
    }

    return NextResponse.json({
      ok: true,
      property: updated,
      message: `Property ${action === "approve" ? "approved" : "rejected"} successfully`,
    });
  } catch (error) {
    console.error("Property review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}