// app/properties/lib/propertyData.ts

export const MOCK_PROPERTIES = [
  {
    id: 1,
    city: "Lisbon",
    country: "Portugal",
    title: "Penthouse with Sea View",
    guests: 6,
    beds: 3,
    referencePoints: 800,
    tags: ["Luxury", "Family friendly"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
  {
    id: 2,
    city: "Amsterdam",
    country: "Netherlands",
    title: "Cozy Canal-side Loft",
    guests: 2,
    beds: 1,
    referencePoints: 520,
    tags: ["City center"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
  {
    id: 3,
    city: "Bali",
    country: "Indonesia",
    title: "Beachfront Villa Retreat",
    guests: 8,
    beds: 4,
    referencePoints: undefined,
    tags: ["Beach", "Long stay"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
] as const;

export type Property = (typeof MOCK_PROPERTIES)[number];

export type PropertyFilters = {
  query: string;
  type: "all" | "luxury" | "beach" | "city";
  pointsRange: "any" | "0-600" | "600-700" | "700+";
};

// 过滤逻辑单独导出
export function matchesFilters(property: Property, filters: PropertyFilters) {
  const { query, type, pointsRange } = filters;

  const q = query.trim().toLowerCase();
  if (q) {
    const inCity = property.city.toLowerCase().includes(q);
    const inCountry = property.country.toLowerCase().includes(q);
    const inTitle = property.title.toLowerCase().includes(q);
    if (!inCity && !inCountry && !inTitle) return false;
  }

  if (type !== "all") {
    const tagsLower = (property.tags ?? []).map((t) => t.toLowerCase());
    if (type === "luxury" && !tagsLower.includes("luxury")) return false;
    if (type === "beach" && !tagsLower.includes("beach")) return false;
    if (type === "city" && !tagsLower.some((t) => t.includes("city"))) {
      return false;
    }
  }

  const pts = property.referencePoints;
  if (pointsRange !== "any" && typeof pts === "number") {
    if (pointsRange === "0-600" && !(pts <= 600)) return false;
    if (pointsRange === "600-700" && !(pts >= 600 && pts <= 700)) return false;
    if (pointsRange === "700+" && !(pts >= 700)) return false;
  }

  return true;
}