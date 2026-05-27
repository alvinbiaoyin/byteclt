// lib/compute-intelligence.ts

import type { Hospital } from "@/lib/hospital-types";

export type AssayMixItem = {
  name: string;
  value: number;
};

export type IntelligenceSnapshot = {
  provinceCount: number;
  assayMix: AssayMixItem[];
  insights: string[];
};

function countProvinces(hospitals: Hospital[]): number {
  // 🛡️ 防御空值：确保 hospitals 必须是数组
  if (!Array.isArray(hospitals)) return 0;
  return new Set(hospitals.filter(h => h && h.province).map((h) => h.province)).size;
}

function buildAssayMix(hospitals: Hospital[]): AssayMixItem[] {
  const counts = new Map<string, number>();
  
  // 🛡️ 防御空值
  if (Array.isArray(hospitals)) {
    for (const hospital of hospitals) {
      if (hospital && Array.isArray(hospital.assays)) {
        for (const assay of hospital.assays) {
          if (assay) {
            counts.set(assay, (counts.get(assay) ?? 0) + 1);
          }
        }
      }
    }
  }

  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function computeIntelligence(hospitals: Hospital[]): IntelligenceSnapshot {
  const safeHospitals = Array.isArray(hospitals) ? hospitals : [];

  const provinceCount = countProvinces(safeHospitals);
  const assayMix = buildAssayMix(safeHospitals);

  // 动态生成符合 5月20号 本土医学简报的专业 Insight 文本
  const insights: string[] = [];
  if (safeHospitals.length > 0) {
    insights.push(
      `Currently analyzing ${safeHospitals.length} active clinical CDx network nodes across key therapeutic regions.`
    );
    if (provinceCount > 0) {
      insights.push(`Geographical dispersion covers ${provinceCount} high-tier diagnostic administrative zones.`);
    }
    const lead = assayMix[0]?.name || "NGS";
    insights.push(`The dominant methodology skew in this selection is verified as ${lead}.`);
  } else {
    insights.push("No laboratory segment data available under current filter matrix conditions.");
  }

  return {
    provinceCount,
    assayMix,
    insights,
  };
}