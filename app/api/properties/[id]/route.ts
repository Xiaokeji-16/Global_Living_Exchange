// app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = createServerSupabaseClient();

    // 确认是自己的房产才能删除
    const { data: property } = await supabase
      .from("properties")
      .select("host_id, verification_status")
      .eq("id", id)
      .single();

    if (!property || property.host_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 只允许删除 rejected 和 draft
    if (!["rejected", "draft"].includes(property.verification_status)) {
      return NextResponse.json(
        { error: "Cannot delete active or pending properties" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}