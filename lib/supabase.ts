// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 创建 Supabase 客户端（客户端使用）- 不指定 Database 类型
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 创建服务端 Supabase 客户端（用于 API 路由）- 使用 service_role_key
export function createServerSupabaseClient() {
  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not set!');
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server operations');
  }
  
  return createClient(
    supabaseUrl,
    supabaseServiceKey,  // 使用 service_role_key，绕过 RLS
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}