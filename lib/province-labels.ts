// lib/province-labels.ts
// Display-only Chinese → English province labels used by intelligence
// commentary. Internal filter keys and analytics keys remain Chinese —
// this module only powers presentation strings.

export const PROVINCE_CN_TO_EN: Record<string, string> = {
  "北京": "Beijing",
  "上海": "Shanghai",
  "广东": "Guangdong",
  "江苏": "Jiangsu",
  "浙江": "Zhejiang",
  "山东": "Shandong",
  "安徽": "Anhui",
  "湖北": "Hubei",
  "湖南": "Hunan",
  "四川": "Sichuan",
  "重庆": "Chongqing",
  "福建": "Fujian",
  "天津": "Tianjin",
  "河南": "Henan",
  "河北": "Hebei",
  "山西": "Shanxi",
  "陕西": "Shaanxi",
  "辽宁": "Liaoning",
  "吉林": "Jilin",
  "黑龙江": "Heilongjiang",
  "内蒙古": "Inner Mongolia",
  "广西": "Guangxi",
  "海南": "Hainan",
  "江西": "Jiangxi",
  "贵州": "Guizhou",
  "云南": "Yunnan",
  "西藏": "Tibet",
  "甘肃": "Gansu",
  "青海": "Qinghai",
  "宁夏": "Ningxia",
  "新疆": "Xinjiang",
};

export function toEnglishProvince(cn: string): string {
  return PROVINCE_CN_TO_EN[cn] ?? cn;
}

// Oxford-style join: ["A"] → "A", ["A","B"] → "A and B",
// ["A","B","C"] → "A, B and C".
export function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const head = items.slice(0, -1).join(", ");
  return `${head} and ${items[items.length - 1]}`;
}
