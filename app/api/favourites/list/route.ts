// app/api/favourites/list/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/TS/supabaseClient";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Fetching favourites for user:", userId);

    // 获取用户收藏的房源 ID 列表
    const { data: favourites, error: favouritesError } = await supabaseAdmin
      .from("user_favourites")
      .select("property_id")
      .eq("clerk_user_id", userId);

    if (favouritesError) {
      console.error("Error fetching favourites:", favouritesError);
      return NextResponse.json(
        { error: "Failed to fetch favourites" },
        { status: 500 }
      );
    }

    if (!favourites || favourites.length === 0) {
      console.log("No favourites found");
      return NextResponse.json({ favourites: [], properties: [] });
    }

    const propertyIds = favourites.map((f) => f.property_id);
    console.log("Favourite property IDs:", propertyIds);

    // 获取房源详细信息（只查询 properties 表的基本字段）
    const { data: properties, error: propertiesError } = await supabaseAdmin
      .from("properties")
      .select("id, city, country, title, guests, beds, reference_points, tags, image_url, verified")
      .in("id", propertyIds);

    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError);
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    console.log("Found properties:", properties?.length || 0);

    return NextResponse.json({
      favourites: propertyIds,
      properties: properties || [],
    });
  } catch (error) {
    console.error("Error in list favourites API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}