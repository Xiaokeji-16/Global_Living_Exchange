import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Users as UsersIcon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { Property } from "../lib/propertyData";

type PropertyCardProps = {
  property: Property;
  // 如果传了 href，就用 <Link> 包起来，用于跳转到详情页
  href?: string;
  // 是否已收藏
  isFavourite?: boolean;
  // 收藏状态改变的回调
  onFavouriteChange?: (propertyId: number, isFavourite: boolean) => void;
};

export default function PropertyCard({ property, href, isFavourite = false, onFavouriteChange }: PropertyCardProps) {
  const {
    id,
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

  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(isFavourite);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止链接跳转
    e.stopPropagation();

    if (!user) {
      // 未登录，提示用户登录
      alert("Please sign in to save favourites");
      return;
    }

    // 调试：检查 property id
    console.log("Property ID:", id);
    console.log("Full property:", property);

    if (!id) {
      console.error("Property ID is missing!");
      alert("Error: Property ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLiked ? "/api/favourites/remove" : "/api/favourites/add";
      
      console.log("Calling endpoint:", endpoint);
      console.log("With property ID:", id);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId: id }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to update favourite");
      }

      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // 通知父组件状态变化
      if (onFavouriteChange) {
        onFavouriteChange(id, newLikedState);
      }
    } catch (error) {
      console.error("Error updating favourite:", error);
      alert(`Failed to update favourite: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* 收藏爱心 - 可交互 */}
        <button
          type="button"
          onClick={handleLikeClick}
          disabled={isLoading}
          className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/70 transition-colors disabled:opacity-50"
          aria-label={isLiked ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart 
            className={`w-4 h-4 transition-all ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* VERIFIED 徽标 - 绿色透明风格 + 图标 */}
        {verified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-900/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200 dark:border-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
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