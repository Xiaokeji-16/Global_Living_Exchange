// app/properties/lib/propertyData.ts

// 房源的结构
export type Property = {
  id: number;
  city: string;
  country: string;
  title: string;
  guests: number;
  beds: number;
  referencePoints?: number | null;
  tags?: string[];
  imageSrc: string;
  verified: boolean;
  // 详情页字段（可选）
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  photos?: string[];
  propertyType?: string;
  stayCategory?: string;
  houseRules?: string;
};

export type PropertyDetail = {
  id: number;
  streetAddress: string | null;
  city: string;
  country: string;
  stateRegion: string | null;
  postcode: string | null;
  title: string;
  guests: number;
  beds: number;
  referencePoints: number | null;
  tags: string[];
  imageSrc: string;
  verified: boolean;
  description: string;
  bedrooms: number | null;
  bathrooms: number | null;
  photos: string[];
  propertyType: string | null;
  stayCategory: string | null;
  houseRules: string;
  hostId: string | null;
  createdAt: string | null;
};

export function formatPropertyLabel(value?: string | null): string {
  if (!value) return "";

  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function splitHouseRules(value?: string | null): string[] {
  return (value ?? "")
    .split(/\n|,/)
    .map((rule) => rule.trim())
    .filter(Boolean);
}

// 顶部筛选条 / 列表用到的筛选类型
export type PropertyFilters = {
  query: string; // 文本搜索:城市 / 国家 / 标题
  type: "all" | "luxury" | "beach" | "city";
  pointsRange: "any" | "0-600" | "600-700" | "700+";
};

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

  // 2. 类型匹配
  const propertyType = property.propertyType?.toLowerCase() || "";
  const stayCategory = property.stayCategory?.toLowerCase() || "";
  const titleLower = property.title.toLowerCase();

  if (type !== "all") {
    if (type === "luxury" && !(propertyType === "villa" || titleLower.includes("luxury"))) {
      return false;
    }
    if (type === "beach" && !stayCategory.includes("beach")) {
      return false;
    }
    if (type === "city" && !stayCategory.includes("city")) {
      return false;
    }
  }

  // 3. 积分区间
  // ✅ 如果没有积分,显示房产(不过滤)
  const pts = property.referencePoints;
  if (pointsRange !== "any" && pts !== null && pts !== undefined) {
    if (pointsRange === "0-600" && !(pts <= 600)) return false;
    if (pointsRange === "600-700" && !(pts >= 600 && pts <= 700)) return false;
    if (pointsRange === "700+" && !(pts >= 700)) return false;
  }

  return true;
}

// 按 id 查找房源,给详情页用
export function getPropertyById(id: string | number): Property | undefined {
  // 这个函数现在应该从 API 获取,但暂时保留
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return undefined;
  return undefined; // 需要从 API 获取
}
