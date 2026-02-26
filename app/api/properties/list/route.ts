// app/api/properties/list/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const propertyType = searchParams.get("type");

    let query = supabase
      .from("properties")
      .select(`
        id,
        title,
        description,
        city,
        country,
        property_type,
        stay_category,
        guests,
        bedrooms,
        beds,
        bathrooms,
        photos,
        verification_status,
        created_at
      `)
      .eq("verification_status", "approved")
      .order("created_at", { ascending: false });

    if (city) query = query.ilike("city", `%${city}%`);
    if (country) query = query.ilike("country", `%${country}%`);
    if (propertyType) query = query.eq("property_type", propertyType);

    const { data: properties, error } = await query;

    if (error) {
      console.error("Fetch properties error:", error);
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      properties: properties || [],
      count: (properties || []).length,
    });

  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}