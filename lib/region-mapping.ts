// lib/region-mapping.ts
// Geographic Intelligence: static, deterministic province → region mapping.
// Five-region framework (East / North / South / Central / West).
// Northeast (Liaoning, Jilin, Heilongjiang) and Inner Mongolia roll up into
// North China to preserve a stable five-region narrative for analytics.

export const REGIONS = [
  "East China",
  "North China",
  "South China",
  "Central China",
  "West China",
] as const;

export type Region = (typeof REGIONS)[number];

export const PROVINCE_TO_REGION: Record<string, Region> = {
  // North China (incl. Northeast + Inner Mongolia)
  "北京": "North China",
  "天津": "North China",
  "河北": "North China",
  "山西": "North China",
  "内蒙古": "North China",
  "辽宁": "North China",
  "吉林": "North China",
  "黑龙江": "North China",

  // East China
  "上海": "East China",
  "江苏": "East China",
  "浙江": "East China",
  "安徽": "East China",
  "福建": "East China",
  "山东": "East China",
  "江西": "East China",

  // Central China
  "河南": "Central China",
  "湖北": "Central China",
  "湖南": "Central China",

  // South China
  "广东": "South China",
  "广西": "South China",
  "海南": "South China",

  // West China (Southwest + Northwest)
  "四川": "West China",
  "重庆": "West China",
  "贵州": "West China",
  "云南": "West China",
  "西藏": "West China",
  "陕西": "West China",
  "甘肃": "West China",
  "青海": "West China",
  "宁夏": "West China",
  "新疆": "West China",
};

export function resolveRegion(province: string | undefined | null): Region | null {
  if (!province) return null;
  return PROVINCE_TO_REGION[province] ?? null;
}

// -----------------------------------------------------------------------
// Detailed 6-region split for Market Analytics panels only.
// Separates Northeast China out of North China while leaving the original
// 5-region framework (and all Geographic Intelligence consumers) untouched.
// -----------------------------------------------------------------------

export const DETAILED_REGIONS = [
  "East China",
  "North China",
  "South China",
  "Central China",
  "West China",
  "Northeast China",
] as const;

export type DetailedRegion = (typeof DETAILED_REGIONS)[number];

const NORTHEAST_PROVINCES = new Set<string>(["辽宁", "吉林", "黑龙江"]);

export function resolveDetailedRegion(
  province: string | undefined | null
): DetailedRegion | null {
  if (!province) return null;
  if (NORTHEAST_PROVINCES.has(province)) return "Northeast China";
  const r = PROVINCE_TO_REGION[province];
  // North China in 5-region already excludes Northeast (now reassigned above);
  // any other 5-region label maps 1:1 into the 6-region label set.
  return (r as DetailedRegion) ?? null;
}
