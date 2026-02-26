// app/api/properties/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ 加上 await
    const supabase = createServerSupabaseClient();

    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        id, title, description, city, country,
        property_type, stay_category, guests,
        bedrooms, beds, bathrooms, house_rules,
        photos, verification_status, reference_points,
        tags, created_at
      `)
      .eq("id", id)
      .single();

    if (error || !property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property });

  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}