// app/upload-home/components/PhotosSection.tsx

type Props = {
  photos: File[];
  onPhotosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PhotosSection({ photos, onPhotosChange }: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold">Photos</h2>
      <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
        Upload bright, clear photos of your home. Start with the living room,
        kitchen, bedrooms and view. You can upload up to 10 images.
      </p>

      <label className="block cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-8 text-center hover:border-[rgb(var(--color-primary))] transition">
          <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">
            Click to upload or drag & drop
          </span>
          <span className="text-xs text-[rgb(var(--color-muted))]">
            JPG, PNG up to 10MB each
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

      {photos.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-[rgb(var(--color-muted))]">
          {photos.slice(0, 5).map((file, idx) => (
            <li key={idx} className="truncate">
              • {file.name}
            </li>
          ))}
          {photos.length > 5 && (
            <li>+ {photos.length - 5} more…</li>
          )}
        </ul>
      )}
    </section>
  );
}