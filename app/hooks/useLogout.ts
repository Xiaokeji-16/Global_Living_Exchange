// app/hooks/useLogout.ts
"use client";

import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export function useLogout() {
  const router = useRouter();
  const { signOut } = useClerk();

  return async () => {
    await signOut(); // 调用 Clerk 的 signOut 方法
    
    router.push("/"); // 登出后重定向到首页
  };
}
