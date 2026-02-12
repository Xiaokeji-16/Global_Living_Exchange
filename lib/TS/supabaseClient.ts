// lib/TS/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 客户端使用的 Supabase client（浏览器中使用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 服务端使用的 Supabase client（API 路由中使用）
// 仅在服务端环境中可用
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
    )
  : supabase; // 浏览器环境返回普通 client