// app/api/favourites/check/route.ts
// 检查指定房产是否已被收藏

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("property_id");

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("favourites")
      .select("id")
      .eq("user_id", userId)
      .eq("property_id", parseInt(propertyId))
      .maybeSingle();

    if (error) {
      console.error("Check favourite error:", error);
      return NextResponse.json(
        { error: "Failed to check favourite status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      isFavourited: !!data,
    });

  } catch (error) {
    console.error("Error checking favourite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}