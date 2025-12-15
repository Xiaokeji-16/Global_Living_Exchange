// app/properties/components/PropertyDetailHero.tsx
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Property } from "../lib/propertyData";

type Props = {
  property: Property;
};

export function PropertyDetailHero({ property }: Props) {
  const tags = property.tags ?? [];

  return (
    <>
      {/* 标题 + 位置 */}
      <header className="space-y-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {property.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]">
          <MapPin className="w-4 h-4" />
          <span>
            {property.city}, {property.country}
          </span>
        </div>
      </header>

      {/* 顶部图片：左大图 + 右两张小图 */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.1fr)]">
        {/* 左：主图 */}
        <div className="relative h-64 sm:h-80 lg:h-[360px] rounded-3xl overflow-hidden">
          <Image
            src={property.imageSrc}
            alt={property.title}
            fill
            className="object-cover"
          />
          {tags.includes("Luxury") && (
            <span className="absolute left-4 top-4 rounded-full bg-[rgb(var(--color-primary))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-primary-foreground))] shadow">
              Featured
            </span>
          )}
        </div>

        {/* 右：两张小图 + Show all photos 按钮（先复用同一张图） */}
        <div className="grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src={property.imageSrc}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src={property.imageSrc}
              alt={property.title}
              fill
              className="object-cover brightness-75"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-black/70 px-4 py-2 text-sm text-white">
                Show all photos
              </span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}