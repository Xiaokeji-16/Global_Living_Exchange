// app/properties/[id]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { useTheme } from "../../hooks/useTheme";
import { type Property } from "../lib/propertyData";
import { PropertyDetailHero } from "../components/PropertyDetailHero";
import { PropertyDetailMainInfo } from "../components/PropertyDetailMainInfo";
import { PropertyDetailSidebar } from "../components/PropertyDetailSidebar";

type RouteParams = { id?: string };

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams() as RouteParams | null;
  const { theme, toggleTheme } = useTheme();

  const id = params?.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadProperty() {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          setNotFound(true);
          return;
        }
        const data = await response.json();
        const prop = data.property;

        // 转换为前端 Property 格式
        setProperty({
          id: prop.id,
          city: prop.city || "Unknown",
          country: prop.country || "",
          title: prop.title || "Untitled Property",
          guests: prop.guests || 1,
          beds: prop.beds || 1,
          referencePoints: prop.reference_points ?? null,
          tags: prop.tags || [],
          imageSrc: prop.photos?.[0] || "/placeholder-property.jpg",
          verified: prop.verification_status === "approved",
          // 详情页额外字段
          description: prop.description,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          photos: prop.photos || [],
          propertyType: prop.property_type,
          stayCategory: prop.stay_category,
          houseRules: prop.house_rules,
        });
      } catch (error) {
        console.error("Error loading property:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  if (!id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <p>缺少房源 id 参数。</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <p>Loading...</p>
      </main>
    );
  }

  if (notFound || !property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
        <div className="text-center space-y-2">
          <p>找不到这个房源 id: {id}</p>
          <p className="text-sm text-[rgb(var(--color-muted))]">
            该房源不存在或已被删除。
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))]"
        >
          <span>←</span>
          <span>Back to search</span>
        </button>

        <PropertyDetailHero property={property} />

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
          <PropertyDetailMainInfo property={property} />
          <PropertyDetailSidebar property={property} />
        </section>
      </main>
    </div>
  );
}