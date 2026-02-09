// app/api/admin/inbox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { InboxFilterOptions } from "@/app/types/inbox";

/**
 * GET /api/admin/inbox
 * 获取 Inbox 列表（支持过滤、排序、分页）
 */
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: 验证用户是否是管理员
    // const user = await checkUserRole(userId);
    // if (user.role !== 'admin') {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const supabase = createServerSupabaseClient();

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const sortField = searchParams.get("sortField") || "created_at";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    // 构建查询
    let query = supabase
      .from("inbox_items")
      .select("*", { count: "exact" });

    // 添加过滤条件
    if (type) {
      query = query.eq("type", type);
    }
    if (status) {
      query = query.eq("status", status);
    }

    // 添加排序
    query = query.order(sortField, { ascending: sortDirection === "asc" });

    // 添加分页
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // 执行查询
    const { data: items, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch inbox items" },
        { status: 500 }
      );
    }

    const total = count || 0;

    return NextResponse.json({
      items: items || [],
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    });
  } catch (error) {
    console.error("Error fetching inbox items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/inbox
 * 创建新的 Inbox 条目（通常由系统自动触发，但也可以手动创建）
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      type,
      event_type,
      reference_id,
      reference_table,
      user_id,
      user_name,
      user_email,
    } = body;

    // 验证必填字段
    if (!type || !event_type || !reference_id || !reference_table) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 创建 Inbox 条目
    const { data: inboxItem, error } = await supabase
      .from("inbox_items")
      .insert({
        type,
        status: "unread",
        event_type,
        reference_id,
        reference_table,
        user_id,
        user_name,
        user_email,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create inbox item" },
        { status: 500 }
      );
    }

    return NextResponse.json(inboxItem, { status: 201 });
  } catch (error) {
    console.error("Error creating inbox item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}