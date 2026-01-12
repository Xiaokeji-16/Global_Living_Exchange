// app/upload-home/components/UploadHomeForm.tsx
"use client";

import { useState } from "react";
import { BasicInfoSection } from "./BasicInfoSection";
import { LocationCapacitySection } from "./LocationCapacitySection";
import { PhotosSection } from "./PhotosSection";
import { HouseRulesSection } from "./HouseRulesSection";
import { SidebarTips } from "./SidebarTips";

export function UploadHomeForm() {
  // 基本信息
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 分类
  const [propertyType, setPropertyType] = useState("apartment");
  const [stayCategory, setStayCategory] = useState("city-break");

  // 位置 & 容量
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [beds, setBeds] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");

  // 图片上传
  const [photos, setPhotos] = useState<File[]>([]);

  // House rules
  const [houseRules, setHouseRules] = useState("");

  const handlePhotosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    setPhotos(Array.from(files));
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Save draft payload:", {
      title,
      description,
      propertyType,
      stayCategory,
      country,
      city,
      guests,
      bedrooms,
      beds,
      bathrooms,
      houseRules,
      photosCount: photos.length,
    });
    alert("Mock: saved as draft（之后接 Supabase 再改成真保存）");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit for review payload:", {
      title,
      description,
      propertyType,
      stayCategory,
      country,
      city,
      guests,
      bedrooms,
      beds,
      bathrooms,
      houseRules,
      photosCount: photos.length,
    });
    alert("Mock: submitted for review（之后接 Supabase + 审核流程）");
  };

  return (
    <>
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
          <BasicInfoSection
            title={title}
            description={description}
            propertyType={propertyType}
            stayCategory={stayCategory}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPropertyTypeChange={setPropertyType}
            onStayCategoryChange={setStayCategory}
          />

          <LocationCapacitySection
            country={country}
            city={city}
            guests={guests}
            bedrooms={bedrooms}
            beds={beds}
            bathrooms={bathrooms}
            onCountryChange={setCountry}
            onCityChange={setCity}
            onGuestsChange={setGuests}
            onBedroomsChange={setBedrooms}
            onBedsChange={setBeds}
            onBathroomsChange={setBathrooms}
          />

          <PhotosSection
            photos={photos}
            onPhotosChange={handlePhotosChange}
          />

          <HouseRulesSection
            value={houseRules}
            onChange={setHouseRules}
          />

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

        {/* 右侧：提示区 */}
        <SidebarTips />
      </form>
    </>
  );
}