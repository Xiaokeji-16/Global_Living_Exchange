// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// Clerk 中间件配置，指定哪些路径需要进行身份验证和授权检查
export const config = {
  matcher: [
    "/dashboard/:path*",      // 用户个人控制台
    "/upload-home/:path*",    // 上传房源
    "/admin/:path*",          // 管理端页面
    "/api/profile/:path*",    // profile API
    "/api/admin/:path*",      // 管理端 API (新增这行！)
    
    // 包含所有 API 和 trpc 路由
    "/(api|trpc)(.*)",
  ],
};