// app/api/stay-requests/create/route.ts
// 创建住宿请求

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // 1. 认证当前用户
    const { userId } = await auth();   // 新版 Clerk 这里是同步的，不需要 await
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. 解析请求体
    const {
      property_id,
      check_in,
      check_out,
      guests,
      message,
    } = (await req.json()) as {
      property_id?: number;
      check_in?: string;
      check_out?: string;
      guests?: number;
      message?: string;
    };

    // 3. 验证必填字段
    if (!property_id || !check_in || !check_out || !guests) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 4. 获取房源信息（包括房主 ID）
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, clerk_user_id, title, city, country")
      .eq("id", property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // 5. 不能请求自己的房子
    if (property.clerk_user_id === userId) {
      return NextResponse.json(
        { error: "Cannot request your own property" },
        { status: 400 }
      );
    }

    // 6. 检查日期是否已被批准的请求占用
    const { data: conflicts, error: conflictError } = await supabase
      .from("stay_requests")
      .select("id")
      .eq("property_id", property_id)
      .eq("status", "approved")
      // 简单的区间重叠检查：已有入住日期 <= 这次退房，并且已有退房日期 >= 这次入住
      .or(`check_in.lte.${check_out},check_out.gte.${check_in}`);

    if (conflictError) {
      console.error("Check conflicts error:", conflictError);
      return NextResponse.json(
        { error: "Failed to check availability" },
        { status: 500 }
      );
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 409 }
      );
    }

    // 7. 创建住宿请求
    const { data: request, error: requestError } = await supabase
      .from("stay_requests")
      .insert({
        property_id,
        guest_user_id: userId,
        host_user_id: property.clerk_user_id,
        check_in,
        check_out,
        guests,
        message: message || null,
        status: "pending",
      })
      .select()
      .single();

    if (requestError) {
      console.error("Create request error:", requestError);
      return NextResponse.json(
        { error: "Failed to create stay request" },
        { status: 500 }
      );
    }

    // 8. 成功返回
    return NextResponse.json(
      {
        success: true,
        request,
        message: "Stay request sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating stay request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}