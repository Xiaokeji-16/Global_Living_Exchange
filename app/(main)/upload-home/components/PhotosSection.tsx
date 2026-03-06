// app/upload-home/components/PhotosSection.tsx
import Image from "next/image";

type Props = {
  photos: File[];
  photoUrls: string[];
  onPhotosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
};

export function PhotosSection({ photos, photoUrls, onPhotosChange, onRemovePhoto }: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold">Photos</h2>
      <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
        Upload bright, clear photos of your home. Start with the living room,
        kitchen, bedrooms and view. You can upload up to 10 images.
      </p>

      {/* 上传区域 */}
      {photos.length < 10 && (
        <label className="block cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-8 text-center hover:border-[rgb(var(--color-primary))] transition">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">
              Click to upload or drag & drop
            </span>
            <span className="text-xs text-[rgb(var(--color-muted))]">
              JPG, PNG up to 10MB each · {photos.length}/10 uploaded
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPhotosChange}
          />
        </label>
      )}

      {/* 图片预览网格 */}
      {photoUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {photoUrls.map((url, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-[rgb(var(--color-border))]">
              <Image
                src={url}
                alt={`Photo ${idx + 1}`}
                fill
                className="object-cover"
              />
              {/* 删除按钮 */}
              <button
                type="button"
                onClick={() => onRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition hover:bg-black/80"
              >
                ✕
              </button>
              {/* 序号 */}
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}