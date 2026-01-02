// app/api/contact/route.ts
import { NextResponse } from "next/server";
import {
  saveContactRequest,
  ContactRequestPayload,
} from "@/lib/TS/contactService";
import { sendContactNotification } from "@/lib/TS/contactMailer";

export async function POST(req: Request) {
  try {
    // 1. 解析 body
    const body = (await req.json()) as Partial<ContactRequestPayload>;
    const { name, email, messageType, message } = body;

    // 2. 基础校验
    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload: ContactRequestPayload = {
      name,
      email,
      messageType,
      message,
    };

    // 3. 先写数据库（这一步出错就直接 500）
    await saveContactRequest(payload);

    // 4. 再发通知邮件 —— 如果这里失败，只记录日志，不影响用户体验
    try {
      await sendContactNotification(payload);
    } catch (mailErr) {
      console.error("Send contact email failed:", mailErr);
      // 这里故意不 return error，让前端仍然收到 ok: true
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}