// app/api/contact/route.ts
import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server"; // 如果没有 @ 别名，就用相对路径

export async function POST(req: NextRequest) {
  // 1. 解析 body
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, email, messageType, message } = body;

  // 2. 基础校验
  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 3. 写入 Supabase
  const { data, error } = await supabaseServer
    .from("contact_requests")      // 👈 你的表名
    .insert([
      {
        name,
        email,
        message_type: messageType || "other", // 👈 对应表里的列名
        message,
      },
    ])
    .select()
    .single();

  // 4. 处理错误
  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  // 5. 成功返回
  return NextResponse.json(
    { ok: true, data },
    { status: 200 }
  );
}