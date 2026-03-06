// app/upload-home/components/LocationCapacitySection.tsx

type NumberLike = number | "";

type Props = {
  country: string;
  city: string;
  guests: NumberLike;
  bedrooms: NumberLike;
  beds: NumberLike;
  bathrooms: NumberLike;
  onCountryChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onGuestsChange: (v: NumberLike) => void;
  onBedroomsChange: (v: NumberLike) => void;
  onBedsChange: (v: NumberLike) => void;
  onBathroomsChange: (v: NumberLike) => void;
};

export function LocationCapacitySection({
  country,
  city,
  guests,
  bedrooms,
  beds,
  bathrooms,
  onCountryChange,
  onCityChange,
  onGuestsChange,
  onBedroomsChange,
  onBedsChange,
  onBathroomsChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold">
        Location & capacity
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm mb-1" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            type="text"
            className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            placeholder="e.g. Australia"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="city">
            City
          </label>
          <input
            id="city"
            type="text"
            className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
            placeholder="e.g. Adelaide"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <NumberField
          id="guests"
          label="Guests"
          value={guests}
          onChange={onGuestsChange}
        />
        <NumberField
          id="bedrooms"
          label="Bedrooms"
          value={bedrooms}
          onChange={onBedroomsChange}
        />
        <NumberField
          id="beds"
          label="Beds"
          value={beds}
          onChange={onBedsChange}
        />
        <NumberField
          id="bathrooms"
          label="Bathrooms"
          value={bathrooms}
          onChange={onBathroomsChange}
        />
      </div>
    </section>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  value: NumberLike;
  onChange: (v: NumberLike) => void;
};

function NumberField({ id, label, value, onChange }: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        value={value}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
    </div>
  );
}