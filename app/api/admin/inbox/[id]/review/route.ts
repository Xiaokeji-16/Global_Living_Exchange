// app/api/admin/inbox/[inboxId]/review/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// ✅ 修改类型定义为 id (匹配实际运行时)
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    console.log("=== Review API: POST 开始 ===");
    
    const { userId } = await auth();
    console.log("1. User ID:", userId);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 获取 params
    const params = await context.params;
    console.log("2a. Params object:", params);
    
    const inboxId = params.id;  // ✅ 现在类型匹配了
    console.log("2b. Inbox ID:", inboxId);

    if (!inboxId || inboxId === "undefined") {
      console.error("2d. Invalid inbox ID:", inboxId);
      return NextResponse.json(
        { error: "Invalid inbox ID" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log("3. Request body:", body);
    
    const { action, note } = body;

    if (!["approve", "deny"].includes(action)) {
      console.error("4. Invalid action:", action);
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'deny'" },
        { status: 400 }
      );
    }

    console.log("5. Action validated:", action);

    const supabase = createServerSupabaseClient();

    // 更新 inbox_items
    console.log("6. Updating inbox_items with ID:", inboxId);
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
      console.error("7. Supabase update error:", error);
      return NextResponse.json(
        { 
          error: "Failed to review item",
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    if (!updatedInbox) {
      console.error("8. Inbox item not found");
      return NextResponse.json(
        { error: "Inbox item not found" },
        { status: 404 }
      );
    }

    console.log("9. Inbox updated successfully");

    // 同时更新 properties 表
    if (updatedInbox.type === "property_verification") {
      console.log("10. Updating property with reference_id:", updatedInbox.reference_id);
      const propertyStatus = action === "approve" ? "approved" : "rejected";
      
      const { error: propertyError } = await supabase
        .from("properties")
        .update({
          verification_status: propertyStatus,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
          review_comment: note || null,
        })
        .eq("id", parseInt(updatedInbox.reference_id));

      if (propertyError) {
        console.error("11. Property update error:", propertyError);
      } else {
        console.log("11. Property updated successfully");
      }
    }

    console.log("=== Review API: 成功完成 ===");

    return NextResponse.json({
      success: true,
      inbox: updatedInbox,
      message: `Successfully ${action}d the item`,
    });
  } catch (error) {
    console.error("=== Review API: 发生错误 ===");
    console.error("Error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const inboxId = params.id;  // ✅ 也改成 id
    
    if (!inboxId) {
      return NextResponse.json({ error: "Invalid inbox ID" }, { status: 400 });
    }

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