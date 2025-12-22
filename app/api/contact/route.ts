// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[CONTACT API] body =", body);

    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const messageType = (body.messageType ?? "other").toString();
    const message = (body.message ?? "").toString().trim();

    // 只要求 name / email / message 不为空
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: 这里以后可以接 DB、发邮件等
    console.log("[CONTACT API] valid payload:", {
      name,
      email,
      messageType,
      message,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT API] JSON parse error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}