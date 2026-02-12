// app/api/favourites/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/TS/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // 删除收藏
    const { error } = await supabase
      .from("user_favourites")
      .delete()
      .eq("clerk_user_id", userId)
      .eq("property_id", propertyId);

    if (error) {
      console.error("Error removing favourite:", error);
      return NextResponse.json(
        { error: "Failed to remove favourite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in remove favourite API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}