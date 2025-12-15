// app/properties/[id]/page.tsx

import Link from "next/link";
import { getPropertyById } from "../lib/propertyData";

type PageProps = {
  // Next.js 16 里 params 在 Server Component 中是 Promise，需要 await 一下
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;          // ✅ 这里正确解包 Promise
  const property = getPropertyById(id); // 用我们刚才统一好的函数

  // 找不到就给一个友好的提示（也可以改成 notFound()）
  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">找不到这个房源 id: {id}</p>
          <p className="text-sm text-[rgb(var(--color-muted))]">
            请确认 MOCK_PROPERTIES 中是否存在对应 id。
          </p>
          <Link
            href="/properties"
            className="inline-flex mt-2 text-sm text-[rgb(var(--color-primary))] hover:underline"
          >
            ← Back to properties
          </Link>
        </div>
      </main>
    );
  }

  const tags = property.tags ?? [];  // ✅ 这里就不会再“tags 可能为 undefined”了

  return (
    <main className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 返回列表 */}
        <Link
          href="/properties"
          className="mb-4 inline-block text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))]"
        >
          ← Back to search
        </Link>

        {/* 标题 & 基本信息 */}
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
          {property.title}
        </h1>
        <p className="text-sm text-[rgb(var(--color-muted))] mb-4">
          {property.city}, {property.country}
        </p>

        {/* 主图，先用背景图简单实现 */}
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-6">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${property.imageSrc})` }}
          />
        </div>

        {/* 文本信息 */}
        <div className="space-y-3 text-sm">
          <div>
            Guests: {property.guests} · Beds: {property.beds}
          </div>

          {property.referencePoints && (
            <div>
              Reference value:{" "}
              <span className="font-semibold">
                {property.referencePoints} pts
              </span>{" "}
              / night
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[rgb(var(--color-secondary))] px-3 py-1 text-xs text-[rgb(var(--color-secondary-foreground))]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}