// lib/supabase-server.ts
// lib/TS/supabase-server.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[supabase-server] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// ⭐ 服务器端使用的 Supabase 客户端
// 其它地方统一这样导入：import { supabase } from "./supabase-server";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);