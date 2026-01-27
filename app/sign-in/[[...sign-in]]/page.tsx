// app/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn
        // 登录成功后，统一跳到 /post-auth 中转页面
        afterSignInUrl="/post-auth"
        afterSignUpUrl="/post-auth"
      />
    </div>
  );
}