// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { signupUser, SignupPayload } from "@/lib/TS/authService";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SignupPayload>;
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 调用 service 写数据库
    const user = await signupUser({
      email,
      password,
      name,
    });

    return NextResponse.json(
      {
        ok: true,
        user,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[SIGNUP_API_ERROR]", err);
    return NextResponse.json(
      { ok: false, error: err.message ?? "Signup failed." },
      { status: 500 }
    );
  }
}