"use client";

import * as React from "react";
import { UserButton, useUser } from "@clerk/nextjs";

function CustomFieldsPage() {
  const { user, isLoaded } = useUser();
  const [gender, setGender] = React.useState("");

  React.useEffect(() => {
    if (!isLoaded || !user) return;
    setGender((user.unsafeMetadata?.gender as string) ?? "");
  }, [isLoaded, user]);

  if (!isLoaded) return null;
  if (!user) return <div style={{ padding: 16 }}>未登录</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 8 }}>Gender</div>

      <input
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        placeholder="male / female / other"
      />

      <button
        style={{ marginLeft: 8 }}
        onClick={async () => {
          await user.update({
            // 关键：unsafeMetadata 更新会覆盖旧对象，不会 merge，所以要手动合并
            unsafeMetadata: { ...(user.unsafeMetadata ?? {}), gender },
          });
        }}
      >
        保存
      </button>
    </div>
  );
}

export function UserMenu() {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="自定义字段"
        url="custom-fields"
        labelIcon={<span>⚙️</span>}
      >
        <CustomFieldsPage />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}
