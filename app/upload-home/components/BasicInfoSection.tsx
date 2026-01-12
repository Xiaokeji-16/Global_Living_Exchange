// app/upload-home/components/BasicInfoSection.tsx

type Props = {
  title: string;
  description: string;
  propertyType: string;
  stayCategory: string;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onPropertyTypeChange: (v: string) => void;
  onStayCategoryChange: (v: string) => void;
};

export function BasicInfoSection({
  title,
  description,
  propertyType,
  stayCategory,
  onTitleChange,
  onDescriptionChange,
  onPropertyTypeChange,
  onStayCategoryChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold">
        Basic information
      </h2>

      <div className="space-y-3">
        {/* Title */}
        <div>
          <label className="block text-sm mb-1" htmlFor="title">
            Home title
          </label>
          <input
            id="title"
            type="text"
            className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            placeholder="Cozy canal-side loft"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1" htmlFor="description">
            Short description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            placeholder="Describe your home, view, neighborhood and what makes it special."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>

        {/* 分类：房源类型 + 体验类型 */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm mb-1" htmlFor="propertyType">
              Property type
            </label>
            <select
              id="propertyType"
              className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              value={propertyType}
              onChange={(e) => onPropertyTypeChange(e.target.value)}
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="stayCategory">
              Stay category
            </label>
            <select
              id="stayCategory"
              className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              value={stayCategory}
              onChange={(e) => onStayCategoryChange(e.target.value)}
            >
              <option value="city-break">City break</option>
              <option value="beach">Beach escape</option>
              <option value="nature">Nature / countryside</option>
              <option value="family">Family-friendly</option>
              <option value="workation">Workation</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}