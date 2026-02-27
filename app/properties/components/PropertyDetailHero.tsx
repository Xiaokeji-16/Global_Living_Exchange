// app/properties/components/PropertyDetailHero.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Property } from "../lib/propertyData";

type Props = {
  property: Property;
};

export function PropertyDetailHero({ property }: Props) {
  const tags = property.tags ?? [];
  const allPhotos = (property.photos && property.photos.length > 0)
    ? property.photos
    : [property.imageSrc];

  const mainPhoto = allPhotos[0];
  const secondPhoto = allPhotos[1] || allPhotos[0];
  const thirdPhoto = allPhotos[2] || allPhotos[0];

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index = 0) => {
    setCurrentIndex(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);

  const prev = () => setCurrentIndex(i => (i - 1 + allPhotos.length) % allPhotos.length);
  const next = () => setCurrentIndex(i => (i + 1) % allPhotos.length);

  return (
    <>
      <header className="space-y-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{property.title}</h1>
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-muted))]">
          <MapPin className="w-4 h-4" />
          <span>{property.city}, {property.country}</span>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.1fr)]">
        {/* 左：主图 */}
        <div
          className="relative h-64 sm:h-80 lg:h-[360px] rounded-3xl overflow-hidden cursor-pointer"
          onClick={() => openGallery(0)}
        >
          <Image src={mainPhoto} alt={property.title} fill className="object-cover" />
          {tags.includes("Luxury") && (
            <span className="absolute left-4 top-4 rounded-full bg-[rgb(var(--color-primary))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-primary-foreground))] shadow">
              Featured
            </span>
          )}
        </div>

        {/* 右：小图 */}
        <div className="grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => openGallery(1)}
          >
            <Image src={secondPhoto} alt={`${property.title} - photo 2`} fill className="object-cover" />
          </div>
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => openGallery(2)}
          >
            <Image src={thirdPhoto} alt={`${property.title} - photo 3`} fill className="object-cover brightness-75" />
            <button
              className="absolute inset-0 flex items-center justify-center"
              onClick={e => { e.stopPropagation(); openGallery(0); }}
            >
              <span className="rounded-full bg-black/70 px-4 py-2 text-sm text-white">
                Show all photos {allPhotos.length > 1 && `(${allPhotos.length})`}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 全屏画廊弹窗 */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          {/* 顶部栏 */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-white text-sm">
              {currentIndex + 1} / {allPhotos.length}
            </span>
            <button
              onClick={closeGallery}
              className="text-white hover:text-gray-300 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 主图区 */}
          <div className="flex-1 relative flex items-center justify-center px-16">
            <Image
              src={allPhotos[currentIndex]}
              alt={`${property.title} - ${currentIndex + 1}`}
              fill
              className="object-contain"
            />

            {/* 左右切换 */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* 底部缩略图 */}
          {allPhotos.length > 1 && (
            <div className="flex gap-2 px-6 py-4 overflow-x-auto">
              {allPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden transition ${
                    idx === currentIndex ? "ring-2 ring-white" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={photo} alt={`thumb ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}