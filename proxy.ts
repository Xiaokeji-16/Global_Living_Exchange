import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/dashboard/:path*", // 保护 /dashboard 下的所有路由
    "/upload-home/:path*", // "/properties/:path*", // 保护 /properties 下的所有路由
    "/admin/:path*", // 保护 /admin 下的所有路由
    "/(api|trpc)(.*)", // 保护所有 API 路由
  ],
};