// app/api/properties/submit/route.ts
// 适配 INTEGER 类型 ID 的版本

import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

const DUPLICATE_SUBMISSION_WINDOW_MS = 2 * 60 * 1000;

async function ensurePropertyInboxItem({
  supabase,
  propertyId,
  userId,
  userName,
  userEmail,
}: {
  supabase: ReturnType<typeof createServerSupabaseClient>;
  propertyId: string | number;
  userId: string;
  userName: string;
  userEmail: string | null;
}) {
  const referenceId = String(propertyId);

  const { data: existingInboxItem, error: existingInboxError } = await supabase
    .from("inbox_items")
    .select("id")
    .eq("type", "property_verification")
    .eq("reference_table", "properties")
    .eq("reference_id", referenceId)
    .limit(1)
    .maybeSingle();

  if (existingInboxError) {
    console.error("检查现有 inbox 条目错误:", existingInboxError);
    return;
  }

  if (existingInboxItem) {
    console.log("已存在对应的 inbox 条目, 跳过创建");
    return;
  }

  const { error: inboxError } = await supabase
    .from("inbox_items")
    .insert({
      type: "property_verification",
      status: "unread",
      event_type: "verify",
      reference_id: referenceId,
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
      streetAddress,
      stateRegion,
      postcode,
      guests,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      houseRules,
      photos,
      isDraft = false,
    } = body;

    // 验证必填字段
    if (!isDraft) {
      if (!title || !description || !streetAddress || !country || !city) {
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
    const normalizedTitle = title?.trim() || null;
    const normalizedDescription = description?.trim() || null;
    const normalizedStreetAddress = streetAddress?.trim() || null;
    const normalizedCountry = country?.trim() || null;
    const normalizedCity = city?.trim() || null;
    const normalizedStateRegion = stateRegion?.trim() || null;
    const normalizedPostcode = postcode?.trim() || null;
    const normalizedHouseRules = houseRules?.trim() || null;
    const normalizedAmenities = Array.isArray(amenities) ? amenities : [];
    const normalizedPhotos = Array.isArray(photos) ? photos : [];
    const normalizedGuests = guests !== null && guests !== undefined ? Number(guests) : null;
    const normalizedBedrooms = bedrooms !== null && bedrooms !== undefined ? Number(bedrooms) : null;
    const normalizedBeds = beds !== null && beds !== undefined ? Number(beds) : null;
    const normalizedBathrooms = bathrooms !== null && bathrooms !== undefined ? Number(bathrooms) : null;

    if (!isDraft) {
      const duplicateThreshold = new Date(Date.now() - DUPLICATE_SUBMISSION_WINDOW_MS).toISOString();

      const { data: existingProperty, error: existingPropertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("host_id", userId)
        .eq("verification_status", "pending")
        .eq("title", normalizedTitle)
        .eq("description", normalizedDescription)
        .eq("street_address", normalizedStreetAddress)
        .eq("country", normalizedCountry)
        .eq("city", normalizedCity)
        .gte("created_at", duplicateThreshold)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingPropertyError) {
        console.error("检查重复房产提交错误:", existingPropertyError);
      }

      if (existingProperty) {
        console.log("检测到重复房产提交, 返回最近一次提交结果:", existingProperty.id);
        await ensurePropertyInboxItem({
          supabase,
          propertyId: existingProperty.id,
          userId,
          userName,
          userEmail,
        });

        return NextResponse.json({
          ok: true,
          property: existingProperty,
          deduplicated: true,
          message: "Duplicate property submission ignored",
        });
      }
    }

    // ✅ 重要: 不要手动设置 id,让数据库自动生成
    const insertData = {
      // 不包含 id 字段!
      host_id: userId,
      title: normalizedTitle,
      description: normalizedDescription,
      property_type: propertyType || null,
      stay_category: stayCategory || null,
      street_address: normalizedStreetAddress,
      country: normalizedCountry,
      city: normalizedCity,
      state_region: normalizedStateRegion,
      postcode: normalizedPostcode,
      guests: normalizedGuests,
      bedrooms: normalizedBedrooms,
      beds: normalizedBeds,
      bathrooms: normalizedBathrooms,
      tags: normalizedAmenities,
      house_rules: normalizedHouseRules,
      photos: normalizedPhotos,
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
      await ensurePropertyInboxItem({
        supabase,
        propertyId: property.id,
        userId,
        userName,
        userEmail,
      });
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
export async function GET() {
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
