// app/properties/[id]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";

import { getPropertyById, type Property } from "../lib/propertyData";
import { PropertyDetailHero } from "../components/PropertyDetailHero";
import { PropertyDetailMainInfo } from "../components/PropertyDetailMainInfo";
import { PropertyDetailSidebar } from "../components/PropertyDetailSidebar";

type RouteParams = { id?: string };

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams() as RouteParams | null;
  const { theme, toggleTheme } = useTheme(); // ✅ 统一用全局主题

  const id = params?.id;

  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <p>缺少房源 id 参数。</p>
      </main>
    );
  }

  const property: Property | undefined = getPropertyById(id);

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <div className="text-center space-y-2">
          <p>找不到这个房源 id: {id}</p>
          <p className="text-sm text-[rgb(var(--color-muted))]">
            请确认 MOCK_PROPERTIES 中是否存在对应 id。
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      {/* 顶部导航：这里的 Header 已经接好 Clerk 了 */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))]"
        >
          <span>←</span>
          <span>Back to search</span>
        </button>

        {/* 顶部标题 + 大图区域 */}
        <PropertyDetailHero property={property} />

        {/* 主体：左侧信息 + 右侧积分卡片 */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
          <PropertyDetailMainInfo property={property} />
          <PropertyDetailSidebar property={property} />
        </section>
      </main>
    </div>
  );
}