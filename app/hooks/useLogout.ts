// app/hooks/useLogout.ts
"use client";

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("gle_mock_user"); // 跟你登录时用的 key 对上
    }
    router.push("/");
  };

  return logout;
}