// app/components/intelligence-explorer.tsx
"use client";

import type { FilterState, Hospital } from "@/lib/hospital-types";

// 🌐 Display-only bilingual labels (CN province key → EN label).
// Internal filter key remains the Chinese name to keep data/map/analytics untouched.
const PROVINCE_CN_TO_EN: Record<string, string> = {
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
};

function formatProvinceLabel(cn: string): string {
  const en = PROVINCE_CN_TO_EN[cn];
  return en ? `${en} ${cn}` : cn;
}

type IntelligenceExplorerProps = {
  hospitals: Hospital[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

export default function IntelligenceExplorer({
  hospitals,
  filters,
  onFiltersChange,
}: IntelligenceExplorerProps) {
  
  // 1. 动态提取所有可选的唯一值
  const provinces = Array.from(new Set(hospitals.map((h) => h.province)))
    .filter(Boolean)
    .sort((a, b) =>
      formatProvinceLabel(a).localeCompare(formatProvinceLabel(b))
    );
  
  const biomarkers = Array.from(
    new Set(hospitals.flatMap((h) => h.biomarkers || []))
  ).filter(Boolean).sort();
  
  const assays = Array.from(
    new Set(hospitals.flatMap((h) => h.assays || []))
  ).filter(Boolean).sort();
  
  const platforms = Array.from(new Set(hospitals.map((h) => h.platform))).filter(Boolean).sort();

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? "" : value,
    });
  };

  const selectClass = "w-full rounded-xl border border-cyan-300/10 bg-slate-950/80 p-3 text-sm text-cyan-100 placeholder-slate-500 shadow-inner focus:border-cyan-400/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/30";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. 省份筛选 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Province</label>
        <select
          value={filters.province || "all"}
          onChange={(e) => handleSelectChange("province", e.target.value)}
          className={selectClass}
        >
          <option value="all">Select Province</option>
          {provinces.map((p) => (
            <option key={p} value={p}>{formatProvinceLabel(p)}</option>
          ))}
        </select>
      </div>

      {/* 2. 生物标志物筛选 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Biomarker</label>
        <select
          value={filters.biomarker || "all"}
          onChange={(e) => handleSelectChange("biomarker", e.target.value)}
          className={selectClass}
        >
          <option value="all">Select Biomarker</option>
          {biomarkers.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* 3. 检测方法筛选 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Assay</label>
        <select
          value={filters.assay || "all"}
          onChange={(e) => handleSelectChange("assay", e.target.value)}
          className={selectClass}
        >
          <option value="all">Select Assay</option>
          {assays.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* 4. 设备平台筛选 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Platform</label>
        <select
          value={filters.platform || "all"}
          onChange={(e) => handleSelectChange("platform", e.target.value)}
          className={selectClass}
        >
          <option value="all">Select Platform</option>
          {platforms.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  );
}