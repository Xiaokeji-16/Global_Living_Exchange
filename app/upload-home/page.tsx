// app/upload-home/page.tsx
"use client";

import { Header } from "../components/Header";
import { useTheme } from "../hooks/useTheme";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";

export default function UploadHomePage() {
  const { theme, toggleTheme } = useTheme();
  const handleLogout = useLogout();

  // 先简单放几个受控状态，后面接 Supabase 再整理
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [beds, setBeds] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [referencePoints, setReferencePoints] = useState<number | "">("");

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save draft payload:", {
      title,
      description,
      country,
      city,
      guests,
      bedrooms,
      beds,
      bathrooms,
      referencePoints,
    });
    alert("Mock: saved as draft (以后接 Supabase).");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit for review payload:", {
      title,
      description,
      country,
      city,
      guests,
      bedrooms,
      beds,
      bathrooms,
      referencePoints,
    });
    alert("Mock: submitted for review (以后接 Supabase + 审核流程).");
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        variant="authed"
        onLogoutClick={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 标题区 */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Upload your home
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-2xl">
            Share your home with verified members. Fill in the details below and
            submit for review. Once approved, your home will appear in the
            community listings.
          </p>
        </header>

        <form
          className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
          onSubmit={handleSubmit}
        >
          {/* 左侧：表单主体 */}
          <div className="space-y-6">
            {/* 基本信息 */}
            <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
              <h2 className="text-base sm:text-lg font-semibold">
                Basic information
              </h2>

              <div className="space-y-3">
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
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

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
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* 位置 & 容量 */}
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
                    onChange={(e) => setCountry(e.target.value)}
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
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <NumberField
                  id="guests"
                  label="Guests"
                  value={guests}
                  onChange={setGuests}
                />
                <NumberField
                  id="bedrooms"
                  label="Bedrooms"
                  value={bedrooms}
                  onChange={setBedrooms}
                />
                <NumberField
                  id="beds"
                  label="Beds"
                  value={beds}
                  onChange={setBeds}
                />
                <NumberField
                  id="bathrooms"
                  label="Bathrooms"
                  value={bathrooms}
                  onChange={setBathrooms}
                />
              </div>
            </section>

            {/* 积分参考价 */}
            <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
              <h2 className="text-base sm:text-lg font-semibold">
                Reference points
              </h2>
              <p className="text-xs sm:text-sm text-[rgb(var(--color-muted))]">
                Set a reference points value per night. You can adjust this
                later based on demand. For example, similar homes are around{" "}
                <span className="font-medium">520–800 pts / night</span>.
              </p>
              <div className="max-w-xs">
                <label className="block text-sm mb-1" htmlFor="referencePoints">
                  Points per night
                </label>
                <input
                  id="referencePoints"
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                  placeholder="e.g. 650"
                  value={referencePoints}
                  onChange={(e) =>
                    setReferencePoints(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
            </section>

            {/* House rules */}
            <section className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 space-y-4">
              <h2 className="text-base sm:text-lg font-semibold">
                House rules & notes
              </h2>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                placeholder="Quiet hours, smoking policy, pets, special notes for guests..."
              />
            </section>

            {/* 按钮 */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition"
              >
                Save as draft
              </button>
              <button
                type="submit"
                className="rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition"
              >
                Submit for review
              </button>
            </div>
          </div>

          {/* 右侧：小提示卡片 / 流程说明 */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 text-sm space-y-3">
              <h2 className="text-base font-semibold">How it works</h2>
              <ol className="list-decimal list-inside space-y-1 text-[rgb(var(--color-muted))]">
                <li>Upload your home details and photos.</li>
                <li>Our team reviews your submission.</li>
                <li>Once approved, your home becomes bookable by members.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 sm:p-6 text-sm text-[rgb(var(--color-muted))] space-y-2">
              <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                Tips for a great listing
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Use bright, clear photos of each room.</li>
                <li>Mention unique features and nearby highlights.</li>
                <li>Be honest about any limitations (stairs, noise, etc.).</li>
              </ul>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}

// 小的数字输入组件，减少重复代码
type NumberFieldProps = {
  id: string;
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
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