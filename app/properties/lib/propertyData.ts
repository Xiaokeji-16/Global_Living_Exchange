// app/properties/lib/propertyData.ts

// 房源的结构
export type Property = {
  id: number;
  city: string;
  country: string;
  title: string;
  guests: number;
  beds: number;
  referencePoints?: number;
  tags?: string[];
  imageSrc: string;
  verified: boolean;
};

// 顶部筛选条 / 列表用到的筛选类型
export type PropertyFilters = {
  query: string; // 文本搜索：城市 / 国家 / 标题
  type: "all" | "luxury" | "beach" | "city";
  pointsRange: "any" | "0-600" | "600-700" | "700+";
};

// 临时假数据
export const MOCK_PROPERTIES: Property[] = [
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
    referencePoints: undefined, // 没有估值
    tags: ["Beach", "Long stay"],
    imageSrc: "/icon/cozy_home.jpg",
    verified: true,
  },
];

// 根据 filters 判断一个 property 要不要保留
export function matchesFilters(
  property: Property,
  filters: PropertyFilters
): boolean {
  const { query, type, pointsRange } = filters;

  // 1. 文本匹配
  const q = query.trim().toLowerCase();
  if (q) {
    const inCity = property.city.toLowerCase().includes(q);
    const inCountry = property.country.toLowerCase().includes(q);
    const inTitle = property.title.toLowerCase().includes(q);
    if (!inCity && !inCountry && !inTitle) return false;
  }

  // 2. 类型匹配（用 tags 简单模拟）
  if (type !== "all") {
    const tagsLower = (property.tags ?? []).map((t) => t.toLowerCase());
    if (type === "luxury" && !tagsLower.includes("luxury")) return false;
    if (type === "beach" && !tagsLower.includes("beach")) return false;
    if (type === "city" && !tagsLower.some((t) => t.includes("city")))
      return false;
  }

  // 3. 积分区间
  const pts = property.referencePoints;
  if (pointsRange !== "any" && typeof pts === "number") {
    if (pointsRange === "0-600" && !(pts <= 600)) return false;
    if (pointsRange === "600-700" && !(pts >= 600 && pts <= 700)) return false;
    if (pointsRange === "700+" && !(pts >= 700)) return false;
  }

  return true;
}

// 按 id 查找房源，给详情页用
export function getPropertyById(id: string | number): Property | undefined {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return undefined;
  return MOCK_PROPERTIES.find((p) => p.id === numericId);
}