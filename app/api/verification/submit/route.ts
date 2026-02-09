// app/api/verification/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * POST /api/verification/submit
 * 提交用户身份验证
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { docUrl, note } = body;

    // 验证必填字段
    if (!docUrl) {
      return NextResponse.json(
        { error: "Document URL is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 检查是否已经提交过
    const { data: existing } = await supabase
      .from("user_verifications")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (existing) {
      // 如果已存在，更新记录
      const { data: updated, error: updateError } = await supabase
        .from("user_verifications")
        .update({
          doc_url: docUrl,
          note: note || null,
          status: "pending",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId)
        .select()
        .single();

      if (updateError) {
        console.error("Update verification error:", updateError);
        return NextResponse.json(
          { error: "Failed to update verification" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
        verification: updated,
        message: "Verification updated successfully",
      });
    }

    // 如果不存在，创建新记录
    const { data: created, error: insertError } = await supabase
      .from("user_verifications")
      .insert({
        clerk_user_id: userId,
        status: "pending",
        doc_url: docUrl,
        note: note || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert verification error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit verification" },
        { status: 500 }
      );
    }

    // 注意：inbox_items 会通过 Supabase 触发器自动创建

    return NextResponse.json({
      ok: true,
      verification: created,
      message: "Verification submitted successfully",
    });
  } catch (error) {
    console.error("Verification submission error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/verification/submit
 * 获取当前用户的验证状态
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("user_verifications")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Get verification error:", error);
      return NextResponse.json(
        { error: "Failed to fetch verification status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      verification: data,
      hasSubmitted: !!data,
    });
  } catch (error) {
    console.error("Get verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}