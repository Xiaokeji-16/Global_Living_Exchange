/// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginUser, LoginPayload } from "@/lib/TS/authService";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LoginPayload>;
    const { email, password } = body;

    // 基础校验
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    const result = await loginUser({ email, password });

    // ❌ 这里之前用了 result.error，现在删掉
    if (!result.ok || !result.user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 现在先不做 JWT / cookie，只是返回 user
    return NextResponse.json(
      {
        ok: true,
        user: result.user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[login] API error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}