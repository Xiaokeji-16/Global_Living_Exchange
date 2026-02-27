// app/upload-home/components/UploadHomeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BasicInfoSection } from "./BasicInfoSection";
import { LocationCapacitySection } from "./LocationCapacitySection";
import { PhotosSection } from "./PhotosSection";
import { HouseRulesSection } from "./HouseRulesSection";
import { SidebarTips } from "./SidebarTips";

export function UploadHomeForm() {
  const router = useRouter();
  const { userId } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [stayCategory, setStayCategory] = useState("city-break");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [beds, setBeds] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [houseRules, setHouseRules] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    setPhotos(prev => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 10);
    });

    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => {
      const combined = [...prev, ...newUrls];
      return combined.slice(0, 10);
    });

    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadPhotos = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });

    const response = await fetch("/api/upload/photos", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await response.json();
    return data.urls;
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
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
      if (!response.ok) throw new Error(data.error || "Failed to save draft");

      alert("draft saved successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Save draft error:", err);
      setError(err instanceof Error ? err.message : "save draft failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!title || !description || !country || !city) {
        throw new Error("please fill in all required fields (title, description, country, city)");
      }
      if (guests === null || guests === undefined || guests === "") {
        throw new Error("please fill in the number of guests");
      }
      if (bedrooms === null || bedrooms === undefined || bedrooms === "") {
        throw new Error("please fill in the number of bedrooms");
      }
      if (beds === null || beds === undefined || beds === "") {
        throw new Error("please fill in the number of beds");
      }
      if (bathrooms === null || bathrooms === undefined || bathrooms === "") {
        throw new Error("please fill in the number of bathrooms");
      }
      if (photos.length === 0) {
        throw new Error("please upload at least one photo");
      }

      const uploadedPhotoUrls = await uploadPhotos(photos);

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
          guests: Number(guests),
          bedrooms: Number(bedrooms),
          beds: Number(beds),
          bathrooms: Number(bathrooms),
          houseRules,
          photos: uploadedPhotoUrls,
          isDraft: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit property");

      alert("property submitted successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Upload your home</h1>
        <p className="mt-2 text-sm sm:text-base text-[rgb(var(--color-muted))] max-w-2xl">
          Share your home with verified members. Fill in the details below and
          submit for review. Once approved, your home will appear in the
          community listings.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form
        className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
        onSubmit={handleSubmit}
      >
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
            photoUrls={photoUrls}
            onPhotosChange={handlePhotosChange}
            onRemovePhoto={handleRemovePhoto}
          />

          <HouseRulesSection
            value={houseRules}
            onChange={setHouseRules}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] hover:border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-card-foreground))/5] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save as draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-[rgb(var(--color-primary-foreground))] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit for review"}
            </button>
          </div>
        </div>

        <SidebarTips />
      </form>
    </>
  );
}