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

  // 2. 类型匹配（用 tags 简单模拟）
  // ✅ 如果没有 tags 或 tags 为空,显示所有房产(不过滤)
  if (type !== "all" && property.tags && property.tags.length > 0) {
    const tagsLower = property.tags.map((t) => t.toLowerCase());
    if (type === "luxury" && !tagsLower.includes("luxury")) return false;
    if (type === "beach" && !tagsLower.includes("beach")) return false;
    if (type === "city" && !tagsLower.some((t) => t.includes("city")))
      return false;
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