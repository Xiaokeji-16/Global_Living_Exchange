// app/post-auth/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function PostAuthPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // 等 Clerk 加载好

    // 理论上不会走到这里，但防御一下
    if (!user) {
      router.replace("/sign-in");
      return;
    }

    // 从元数据里拿 role，没有的话默认普通会员
    const role =
      (user.publicMetadata?.role as string | undefined) ?? "member";

    if (role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  }, [isLoaded, user, router]);

  // 简单 loading（也可以返回一个 Spinner）
  return null;
}