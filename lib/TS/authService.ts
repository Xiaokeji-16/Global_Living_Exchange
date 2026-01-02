// lib/TS/authService.ts
import bcrypt from "bcryptjs";
import { supabase } from "./supabase-server";

// ---- 类型定义 ----

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// 统一把结果写成 success / failure 两种
export type SignupResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

// 你在 Supabase 里的用户表名（根据你自己的实际表名改）
const USERS_TABLE = "users";

// ---- 注册：插入 Supabase，并返回 AuthUser ----

export async function signupUser(payload: SignupPayload): Promise<SignupResult> {
  const { email, password, name } = payload;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  try {
    // 1. 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. 写入 Supabase
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .insert({
        email: normalizedEmail,
        name: name?.trim() || null,
        hashed_password: hashedPassword, // 注意：表里字段名要叫 hashed_password
      })
      .select("*")
      .single();

    if (error || !data) {
      // 23505 是 Postgres 唯一约束冲突（比如 email 已存在）
      if ((error as any)?.code === "23505") {
        return { ok: false, error: "Email is already registered" };
      }

      console.error("[signupUser] Supabase error:", error);
      return { ok: false, error: "Failed to sign up" };
    }

    const user: AuthUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      createdAt: data.created_at,
    };

    return { ok: true, user };
  } catch (err) {
    console.error("[signupUser] Unexpected error:", err);
    return { ok: false, error: "Failed to sign up" };
  }
}

// ---- 登录：校验密码，返回 AuthUser ----

export async function loginUser(payload: LoginPayload): Promise<LoginResult> {
  const { email, password } = payload;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { ok: false, error: "Email and password are required" };
  }

  try {
    // 1. 查找用户
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    if (error || !data) {
      console.warn("[loginUser] user not found:", error);
      return { ok: false, error: "Invalid email or password" };
    }

    // 2. 校验密码
    const passwordMatch = await bcrypt.compare(password, data.hashed_password);
    if (!passwordMatch) {
      return { ok: false, error: "Invalid email or password" };
    }

    const user: AuthUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      createdAt: data.created_at,
    };

    return { ok: true, user };
  } catch (err) {
    console.error("[loginUser] Unexpected error:", err);
    return { ok: false, error: "Failed to log in" };
  }
}