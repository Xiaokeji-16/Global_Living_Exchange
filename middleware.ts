// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// 这里配置哪些路径要经过 Clerk（也就是可以在里面用 currentUser、auth）
export const config = {
  matcher: [
    "/dashboard/:path*",      // 用户个人控制台
    "/upload-home/:path*",    // 上传房源
    "/admin/:path*",          // 管理端
    "/api/profile/:path*",    // 我们刚刚写的 profile ensure API
  ],
};