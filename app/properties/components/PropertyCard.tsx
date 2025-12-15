import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Users as UsersIcon } from "lucide-react";
import type { Property } from "../lib/propertyData";

type PropertyCardProps = {
  property: Property;
  // 如果传了 href，就用 <Link> 包起来，用于跳转到详情页
  href?: string;
};

export default function PropertyCard({ property, href }: PropertyCardProps) {
  const {
    city,
    country,
    title,
    guests,
    beds,
    referencePoints,
    tags,
    imageSrc,
    verified,
  } = property;

  // 纯粹的卡片内容（不带 Link）
  const content = (
    <article className="group overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] shadow-sm hover:shadow-md hover:border-[rgb(var(--color-primary))]/60 transition">
      {/* 图片区域 */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 收藏心形（目前只是 UI） */}
        <button
          type="button"
          className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/70"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* VERIFIED 徽标 */}
        {verified && (
          <span className="absolute right-3 top-3 rounded-full bg-[rgb(var(--color-primary))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-primary-foreground))] shadow">
            VERIFIED
          </span>
        )}
      </div>

      {/* 文本区域 */}
      <div className="p-4 space-y-2">
        {/* 地点 */}
        <div className="flex items-center gap-1 text-xs text-[rgb(var(--color-muted))]">
          <MapPin className="w-3 h-3" />
          <span>
            {city}, {country}
          </span>
        </div>

        {/* 标题 */}
        <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))]">
          {title}
        </h3>

        {/* guests / beds */}
        <div className="mt-1 flex items-center gap-4 text-xs text-[rgb(var(--color-muted))]">
          <span className="inline-flex items-center gap-1">
            <UsersIcon className="w-3 h-3" />
            {guests} guests
          </span>
          <span className="inline-flex items-center gap-1">
            <BedDouble className="w-3 h-3" />
            {beds} beds
          </span>
        </div>

        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[rgb(var(--color-secondary))] px-2 py-1 text-xs text-[rgb(var(--color-secondary-foreground))]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 底部参考积分 */}
        <div className="mt-3 border-t border-[rgb(var(--color-border))] pt-3 text-xs text-[rgb(var(--color-muted))] flex items-baseline gap-1">
          <span className="mr-1">Reference</span>
          {referencePoints ? (
            <>
              <span className="font-semibold text-[rgb(var(--color-foreground))]">
                {referencePoints} pts
              </span>
              <span>/night</span>
            </>
          ) : (
            <span className="italic">Points estimation pending</span>
          )}
        </div>
      </div>
    </article>
  );

  // 没有 href 的情况：直接渲染卡片（比如将来在 dashboard 上复用）
  if (!href) return content;

  // 有 href：外面包一层 Link，用于跳转到详情页
  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
