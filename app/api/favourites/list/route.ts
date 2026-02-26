// app/api/favourites/list/route.ts
// 获取用户的收藏列表

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    // 获取用户的所有收藏,包含房产详情
    const { data: favourites, error } = await supabase
      .from("favourites")
      .select(`
        id,
        created_at,
        property:properties (
          id,
          title,
          description,
          city,
          country,
          photos,
          property_type,
          guests,
          bedrooms,
          beds,
          bathrooms,
          verification_status
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch favourites error:", error);
      return NextResponse.json(
        { error: "Failed to fetch favourites" },
        { status: 500 }
      );
    }

    // 过滤掉房产已被删除的收藏
    const validFavourites = (favourites || []).filter(fav => fav.property !== null);

    return NextResponse.json({
      favourites: validFavourites,
      count: validFavourites.length,
    });

  } catch (error) {
    console.error("Error fetching favourites:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}