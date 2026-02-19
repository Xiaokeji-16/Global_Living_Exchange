// app/api/admin/inbox/route.ts
// 修复版本 - 包含完整房产详情

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type InboxItem = {
  id: string;
  category: "user" | "property" | "feedback";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  title: string;
  subtitle?: string;
  userName?: string;
  userEmail?: string;
  propertyName?: string;
  propertyLocation?: string;
  feedbackMessage?: string;
  raw?: any;
  // ✅ 添加完整的房产详情
  propertyDetails?: {
    description?: string;
    property_type?: string;
    stay_category?: string;
    guests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    house_rules?: string;
    photos?: string[];
    country?: string;
    city?: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data: inboxItems, error: inboxError } = await supabase
      .from("inbox_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (inboxError) {
      console.error("Fetch inbox error:", inboxError);
      return NextResponse.json(
        { error: "Failed to fetch inbox items" },
        { status: 500 }
      );
    }

    const items: InboxItem[] = await Promise.all(
      (inboxItems || []).map(async (item) => {
        const baseItem = {
          id: item.id,
          createdAt: item.created_at,
          raw: item,
        };

        // 映射状态
        const status = 
          item.status === "approve" ? "approved" as const :
          item.status === "deny" ? "rejected" as const :
          "pending" as const;

        // 根据类型处理
        if (item.type === "property_verification") {
          // ✅ 获取完整的房产详情
          const { data: property } = await supabase
            .from("properties")
            .select("*")
            .eq("id", item.reference_id)
            .single();

          return {
            ...baseItem,
            category: "property" as const,
            status,
            title: property?.title || "Untitled Property",
            subtitle: item.user_email || undefined,
            propertyName: property?.title || "Untitled",
            propertyLocation: property?.city && property?.country 
              ? `${property.city}, ${property.country}`
              : undefined,
            userName: item.user_name || undefined,
            userEmail: item.user_email || undefined,
            // ✅ 添加完整的房产详情
            propertyDetails: property ? {
              description: property.description,
              property_type: property.property_type,
              stay_category: property.stay_category,
              guests: property.guests,
              bedrooms: property.bedrooms,
              beds: property.beds,
              bathrooms: property.bathrooms,
              house_rules: property.house_rules,
              photos: property.photos,
              country: property.country,
              city: property.city,
            } : undefined,
          };
        } 
        
        if (item.type === "user_verification") {
          // ✅ 获取完整的用户验证详情
          const { data: verification } = await supabase
            .from("user_verifications")
            .select("*")
            .eq("id", item.reference_id)
            .single();

          return {
            ...baseItem,
            category: "user" as const,
            status,
            title: item.user_name || verification?.full_name || "User Verification",
            subtitle: item.user_email || undefined,
            userName: item.user_name || verification?.full_name || undefined,
            userEmail: item.user_email || undefined,
            // ✅ 添加完整的验证详情 (使用正确的字段名)
            verificationDetails: verification ? {
              full_name: verification.full_name,
              country: verification.country,
              document_type: verification.document_type,
              document_number: verification.document_number,
              note: verification.note,
            } : undefined,
          };
        } 
        
        if (item.type === "feedback") {
          const { data: feedback } = await supabase
            .from("contact_requests")
            .select("*")
            .eq("id", item.reference_id)
            .single();

          return {
            ...baseItem,
            category: "feedback" as const,
            status,
            title: feedback?.name || "User Feedback",
            subtitle: item.user_email || feedback?.email || undefined,
            userName: feedback?.name || undefined,
            userEmail: feedback?.email || undefined,
            feedbackMessage: feedback?.message || undefined,
            // ✅ 添加完整的 feedback 详情
            feedbackDetails: feedback ? {
              name: feedback.name,
              email: feedback.email,
              message_type: feedback.message_type,
              message: feedback.message,
            } : undefined,
          };
        }

        return {
          ...baseItem,
          category: "property" as const,
          status,
          title: "Unknown Item",
        };
      })
    );

    console.log("✅ Returning", items.length, "inbox items");
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching inbox:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    if (!type || !event_type || !reference_id || !reference_table) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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