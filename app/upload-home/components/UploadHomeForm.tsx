// app/upload-home/components/UploadHomeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { BasicInfoSection } from "./BasicInfoSection";
import { LocationCapacitySection } from "./LocationCapacitySection";
import { PhotosSection } from "./PhotosSection";
import { HouseRulesSection } from "./HouseRulesSection";
import { SidebarTips } from "./SidebarTips";

export function UploadHomeForm() {
  const router = useRouter();
  const { userId } = useAuth();
  
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
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // House rules
  const [houseRules, setHouseRules] = useState("");

  // 加载状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;
    setPhotos(Array.from(files));
    
    // 预览图片（可选）
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotoUrls(urls);
  };

  /**
   * 上传图片到 Supabase Storage
   * @param files - 要上传的文件数组
   * @returns 上传后的公开URL数组
   */
  // 在 UploadHomeForm.tsx 中
  const uploadPhotos = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch('/api/upload/photos', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  const data = await response.json();
  return data.urls;
};

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 上传图片（如果有）
      let uploadedPhotoUrls: string[] = [];
      if (photos.length > 0) {
        uploadedPhotoUrls = await uploadPhotos(photos);
      }

      const response = await fetch("/api/properties/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          propertyType,
          stayCategory,
          country,
          city,
          guests: guests || null,
          bedrooms: bedrooms || null,
          beds: beds || null,
          bathrooms: bathrooms || null,
          houseRules,
          photos: uploadedPhotoUrls,
          isDraft: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft");
      }

      alert("草稿保存成功!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Save draft error:", err);
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 在 UploadHomeForm.tsx 中替换 handleSubmit 函数
// 添加详细的日志输出来调试

// 修复后的 handleSubmit 函数
// 在 UploadHomeForm.tsx 中替换

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    console.log("=== 开始提交 ===");
    console.log("表单数据:", {
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

    // ✅ 修复: 验证必填字段 - 允许 0 作为有效值
    if (!title || !description || !country || !city) {
      console.error("基本信息缺失:", { title, description, country, city });
      throw new Error("请填写所有必填字段 (标题、描述、国家、城市)");
    }
    
    // ✅ 修复: 检查是否为 null/undefined/空字符串,但允许数字 0
    if (guests === null || guests === undefined || guests === "") {
      throw new Error("请填写客人数量");
    }
    if (bedrooms === null || bedrooms === undefined || bedrooms === "") {
      throw new Error("请填写卧室数量");
    }
    if (beds === null || beds === undefined || beds === "") {
      throw new Error("请填写床位数量");
    }
    if (bathrooms === null || bathrooms === undefined || bathrooms === "") {
      throw new Error("请填写浴室数量");
    }
    
    if (photos.length === 0) {
      console.error("没有照片");
      throw new Error("请至少上传一张照片");
    }

    // 上传图片
    console.log("正在上传图片...");
    const uploadedPhotoUrls = await uploadPhotos(photos);
    console.log("图片上传成功:", uploadedPhotoUrls);

    // 准备提交数据 - 确保数字类型
    const submitData = {
      title,
      description,
      propertyType,
      stayCategory,
      country,
      city,
      guests: Number(guests),
      bedrooms: Number(bedrooms),
      beds: Number(beds),
      bathrooms: Number(bathrooms),
      houseRules,
      photos: uploadedPhotoUrls,
      isDraft: false,
    };

    console.log("提交数据:", submitData);

    // 提交房产信息
    console.log("正在提交房产信息...");
    const response = await fetch("/api/properties/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    console.log("API响应状态:", response.status);

    const data = await response.json();
    console.log("API响应数据:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit property");
    }

    console.log("提交成功!");
    alert("房产提交成功！我们会尽快审核。");
    router.push("/dashboard");
  } catch (err) {
    console.error("Submit error:", err);
    setError(err instanceof Error ? err.message : "提交失败");
  } finally {
    setIsSubmitting(false);
  }
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

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

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
              disabled={isSubmitting}
              className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "保存中..." : "Save as draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "提交中..." : "Submit for review"}
            </button>
          </div>
        </div>

        {/* 右侧：提示区 */}
        <SidebarTips />
      </form>
    </>
  );
}