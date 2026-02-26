// app/api/favourites/toggle/route.ts
// 添加或删除收藏 (toggle)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json() as {
      property_id: number;
    };

    const { property_id } = requestBody;

    if (!property_id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 检查是否已收藏
    const { data: existing } = await supabase
      .from("favourites")
      .select("id")
      .eq("user_id", userId)
      .eq("property_id", property_id)
      .maybeSingle();

    if (existing) {
      // 已收藏 -> 删除
      const { error: deleteError } = await supabase
        .from("favourites")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Delete favourite error:", deleteError);
        return NextResponse.json(
          { error: "Failed to remove favourite" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        isFavourited: false,
        message: "Removed from favourites",
      });
    } else {
      // 未收藏 -> 添加
      const { error: insertError } = await supabase
        .from("favourites")
        .insert({
          user_id: userId,
          property_id: property_id,
        });

      if (insertError) {
        console.error("Insert favourite error:", insertError);
        return NextResponse.json(
          { error: "Failed to add favourite" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        isFavourited: true,
        message: "Added to favourites",
      });
    }

  } catch (error) {
    console.error("Error toggling favourite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}