// app/api/properties/submit/route.ts
// 适配 INTEGER 类型 ID 的版本

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    console.log("=== API: 开始处理房产提交 ===");
    
    const { userId } = await auth();
    console.log("用户ID:", userId);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const userName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "Unknown User";
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || null;

    const body = await request.json();
    console.log("接收到的数据:", body);

    const {
      title,
      description,
      propertyType,
      stayCategory,
      country,
      city,
      guests,
      bedrooms,
      beds,
      bathrooms,
      houseRules,
      photos,
      isDraft = false,
    } = body;

    // 验证必填字段
    if (!isDraft) {
      if (!title || !description || !country || !city) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      if (guests === null || guests === undefined) {
        return NextResponse.json({ error: "Guests required" }, { status: 400 });
      }
      if (bedrooms === null || bedrooms === undefined) {
        return NextResponse.json({ error: "Bedrooms required" }, { status: 400 });
      }
      if (beds === null || beds === undefined) {
        return NextResponse.json({ error: "Beds required" }, { status: 400 });
      }
      if (bathrooms === null || bathrooms === undefined) {
        return NextResponse.json({ error: "Bathrooms required" }, { status: 400 });
      }
      
      if (!photos || photos.length === 0) {
        return NextResponse.json(
          { error: "At least one photo required" },
          { status: 400 }
        );
      }
    }

    const supabase = createServerSupabaseClient();

    // ✅ 重要: 不要手动设置 id,让数据库自动生成
    const insertData = {
      // 不包含 id 字段!
      host_id: userId,
      title: title || null,
      description: description || null,
      property_type: propertyType || null,
      stay_category: stayCategory || null,
      country: country || null,
      city: city || null,
      guests: guests !== null && guests !== undefined ? Number(guests) : null,
      bedrooms: bedrooms !== null && bedrooms !== undefined ? Number(bedrooms) : null,
      beds: beds !== null && beds !== undefined ? Number(beds) : null,
      bathrooms: bathrooms !== null && bathrooms !== undefined ? Number(bathrooms) : null,
      house_rules: houseRules || null,
      photos: photos || [],
      verification_status: isDraft ? "draft" : "pending",
      // 不设置 created_at,使用数据库默认值
    };

    console.log("准备插入的数据:", insertData);

    // 创建房产记录
    const { data: property, error: insertError } = await supabase
      .from("properties")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error("插入房产错误:", insertError);
      return NextResponse.json(
        { error: "Failed to submit property", details: insertError.message },
        { status: 500 }
      );
    }

    console.log("房产创建成功, ID:", property.id);

    // 如果不是草稿,创建 inbox 条目
    if (!isDraft) {
      console.log("创建inbox条目...");
      const { error: inboxError } = await supabase
        .from("inbox_items")
        .insert({
          type: "property_verification",
          status: "unread",
          event_type: "verify",
          reference_id: property.id.toString(), // 转换为字符串
          reference_table: "properties",
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
        });

      if (inboxError) {
        console.error("创建inbox条目错误:", inboxError);
      } else {
        console.log("inbox条目创建成功");
      }
    }

    console.log("=== API: 处理完成 ===");

    return NextResponse.json({
      ok: true,
      property,
      message: isDraft 
        ? "Property saved as draft" 
        : "Property submitted for review",
    });
  } catch (error) {
    console.error("API错误:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET 方法
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("host_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get properties error:", error);
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      properties: properties || [],
    });
  } catch (error) {
    console.error("Get properties error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}