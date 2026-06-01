// lib/compute-analytics.ts

import type { Hospital } from "./hospital-types";
import {
  PROVINCE_TO_REGION,
  REGIONS,
  type Region,
  DETAILED_REGIONS,
  resolveDetailedRegion,
  type DetailedRegion,
} from "./region-mapping";
import { classifyAssay, type RegulatoryClass } from "./regulatory-mapping";
import { deriveScoringMethod, type ScoringMethod } from "./scoring-mapping";
import { isTier1City } from "./tier1-cities";

const CHART_COLORS = [
  "#22d3ee",
  "#38bdf8",
  "#06b6d4",
  "#67e8f9",
  "#0891b2",
  "#0e7490",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export type AnalyticsSnapshot = {
  assayDistribution: { name: string; value: number }[];
  tatDistribution: { label: string; count: number }[];
  biomarkerTrend: Array<Record<string, string | number>>;
  biomarkerSeries: string[];
  regionalCoverage: {
    province: string;
    active: number;
    network: number;
  }[];
  geographicIntelligence: GeographicIntelligence;
  platformIntelligence: PlatformIntelligence;
  regulatoryIntelligence: RegulatoryIntelligence;
  scoringIntelligence: ScoringIntelligence;
  institutionIntelligence: InstitutionIntelligence;
  reimbursementIntelligence: ReimbursementIntelligence;
  marketAnalyticsSnapshot: MarketAnalyticsSnapshot;
};

// Deterministic operational snapshot for the Market Analytics panel.
// Decoupled from the intelligence layers so the dashboard panel renders
// from a single self-contained struct (platform mix, regional mix, KPIs).
export type MarketAnalyticsSnapshot = {
  platformDistribution: Array<{
    platform: string;
    institutionCount: number;
    sharePercent: number; // 0–100, one decimal
  }>;
  regionalDistribution: Array<{
    region: DetailedRegion;
    institutionCount: number;
    sharePercent: number; // 0–100, one decimal
  }>;
  kpis: {
    totalInstitutions: number;
    totalProvinces: number;
    dominantPlatform: string | null;
    mostConcentratedRegion: DetailedRegion | null;
  };
};

// Deterministic reimbursement intelligence layer — additive, observational only.
// Driven by `Hospital.reimbursementStatus` (YES/NO) and `Hospital.reimbursementCny`
// (provincial reimbursement pricing). The notes generator MUST NOT make
// policy recommendations or quality / fairness judgements.
export type ReimbursementIntelligence = {
  coverage: {
    reimbursedCount: number;
    nonReimbursedCount: number;
    totalCount: number;
    reimbursedShare: number; // 0–100, one decimal
    landscape: "Broad" | "Established" | "Limited" | "Sparse";
  };
  pricing: {
    samples: number; // rows with reimbursementCny > 0
    min: number | null;
    max: number | null;
    median: number | null;
    spreadRatio: number | null; // max / min when both defined
    variabilityLabel: "High" | "Moderate" | "Uniform" | "Insufficient";
  };
  provincialCoverage: {
    fullyCoveredProvinces: string[]; // 100% YES, at least 1 lab
    uncoveredProvinces: string[]; // 0% YES, at least 1 lab
    partiallyCoveredProvinces: string[];
    fullyCoveredCount: number;
    uncoveredCount: number;
    segmentProvinces: number;
  };
  tier1Comparison: {
    tier1Total: number;
    tier1Covered: number;
    tier1CoverageRate: number;
    nonTier1Total: number;
    nonTier1Covered: number;
    nonTier1CoverageRate: number;
    coverageGapPP: number; // tier1Rate - nonTier1Rate, percentage points
  };
};

// Deterministic institution intelligence layer — additive, observational only.
// Splits the testing network into teaching-hospital pathology labs vs
// commercial reference labs using `Hospital.labType`. The notes generator
// MUST NOT translate counts into quality / capability judgements.
export type InstitutionIntelligence = {
  distribution: {
    teachingHospital: { count: number; sharePercent: number };
    commercial: { count: number; sharePercent: number };
  };
  totals: {
    totalInstitutions: number;
    classifiedCount: number; // HOSPITAL + COMMERCIAL rows
    unclassifiedCount: number;
  };
  dominant: {
    type: "teaching-hospital" | "commercial" | null;
    sharePercent: number;
  };
  landscape:
    | "Hospital-dominant"
    | "Commercial-dominant"
    | "Mixed"
    | "Sparse";
  // Commercial-lab footprint, used by metro-concentration commentary.
  commercialFootprint: {
    totalCommercial: number;
    commercialProvinces: number; // distinct provinces with ≥ 1 commercial lab
    segmentProvinces: number; // distinct provinces with any lab in segment
    commercialProvinceShare: number; // commercialProvinces / segmentProvinces, %
    tier1CommercialCount: number;
    tier1CommercialShare: number; // tier1CommercialCount / totalCommercial, %
    isMetroConcentrated: boolean; // tier1Share ≥ 70% AND totalCommercial ≥ 3
  };
};

// Deterministic scoring intelligence layer — additive, observational only.
// Each reported assay is mapped to its primary scoring methodology via
// `scoring-mapping.ts`. The notes generator MUST NOT translate counts
// into clinical recommendations or claims of scoring superiority.
export type ScoringIntelligence = {
  distribution: Array<{
    method: ScoringMethod;
    count: number;
    sharePercent: number; // share among classified entries
  }>;
  totals: {
    classifiedCount: number;
    unclassifiedCount: number;
    totalEntries: number;
  };
  dominant: {
    method: ScoringMethod | null;
    sharePercent: number;
  };
  shares: {
    tps: number;
    cps: number;
    ic: number;
    tc: number;
  };
  distinctMethods: number;
  coReporting: {
    tpsCpsLabs: string[];
    tpsCpsCount: number;
    tpsCpsSharePercent: number;
  };
  landscape: "TPS-dominant" | "CPS-dominant" | "Mixed" | "Heterogeneous" | "Sparse";
};

// Deterministic regulatory intelligence layer — additive, observational only.
// Classifies each reported assay as NMPA-approved / LDT / RUO / Unclassified
// using static string-pattern rules in `regulatory-mapping.ts`. The notes
// generator must NOT translate these counts into compliance conclusions.
export type RegulatoryIntelligence = {
  distribution: Array<{
    class: RegulatoryClass;
    count: number;
    sharePercent: number; // share among classified entries (excl. Unclassified)
  }>;
  totals: {
    classifiedCount: number;
    unclassifiedCount: number;
    totalEntries: number;
  };
  dominant: {
    class: Exclude<RegulatoryClass, "Unclassified"> | null;
    sharePercent: number;
  };
  shares: {
    nmpa: number;
    ldt: number;
    ruo: number;
  };
  landscape: "NMPA-dominant" | "LDT-dominant" | "Mixed" | "Sparse";
  // LDT institution-type concentration — backed by `Hospital.labType`.
  // null when no LDT-classified hospitals exist in the segment.
  ldtConcentration: {
    dominantLabType: string | null;
    sharePercent: number; // % of LDT-using institutions of that type
  } | null;
};

// Deterministic platform intelligence layer — additive, sits alongside
// geographic intelligence. Powers Market Intelligence Notes (Platform stage).
export type PlatformIntelligence = {
  distribution: Array<{
    platform: string;
    institutionCount: number;
    sharePercent: number; // 0–100, one decimal
  }>;
  dominant: {
    platform: string | null;
    sharePercent: number;
  };
  topConcentration: {
    topPlatformShare: number;
    top2Share: number;
    top3Share: number;
    concentrationLabel: "Dominant" | "Concentrated" | "Fragmented";
  };
  fragmentation: {
    totalPlatforms: number;
    singleInstitutionPlatforms: string[]; // platforms with exactly 1 institution
  };
  regional: {
    leadByRegion: Array<{
      region: Region;
      platform: string;
      institutionCount: number;
      sharePercent: number; // within region
    }>;
    distinctLeadPlatforms: number; // how many unique platforms lead some region
  };
};

// Deterministic geographic intelligence layer — sits alongside existing
// analytics outputs. Powers Market Intelligence Notes (Geographic stage).
export type GeographicIntelligence = {
  regional: Array<{
    region: Region;
    hospitalCount: number;
    provinceCount: number;
    sharePercent: number; // 0–100, one decimal
  }>;
  provinceConcentration: {
    top: Array<{
      province: string;
      hospitalCount: number;
      sharePercent: number;
    }>;
    underrepresented: string[]; // provinces with ≤ 1 hospital
  };
  imbalance: {
    dominantRegion: Region | null;
    dominantRegionShare: number;
    topProvinceShare: number;
    top3ProvinceShare: number;
    concentrationLabel: "High" | "Moderate" | "Balanced";
  };
  coverage: {
    totalHospitals: number;
    totalProvinces: number;
    averagePerProvince: number; // rounded to one decimal
  };
};

function buildAssayDistribution(hospitals: Hospital[]) {
  const counts = new Map<string, number>();
  
  if (Array.isArray(hospitals)) {
    for (const hospital of hospitals) {
      // 🛡️ 防御空值：确保 hospital 存在且 assays 是个数组
      if (hospital && Array.isArray(hospital.assays)) {
        for (const assay of hospital.assays) {
          if (assay) {
            counts.set(assay, (counts.get(assay) ?? 0) + 1);
          }
        }
      }
    }
  }

  // 计算总数用于在大屏上展示百分比占比
  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return Array.from(counts.entries())
    .map(([name, value]) => ({ 
      name, 
      value,
      share: total > 0 ? Math.round((value / total) * 100) : 0 
    }))
    .sort((a, b) => b.value - a.value);
}

function buildTatDistribution(hospitals: Hospital[]) {
  const order = ["2 Days", "3 Days", "4 Days", "5 Days"];
  const counts = new Map(order.map((label) => [label, 0]));

  if (Array.isArray(hospitals)) {
    for (const hospital of hospitals) {
      if (hospital && typeof hospital.tatDays === 'number') {
        const label = `${hospital.tatDays} Days`;
        if (counts.has(label)) {
          counts.set(label, (counts.get(label) ?? 0) + 1);
        }
      }
    }
  }

  return order.map((label) => ({
    label,
    count: counts.get(label) ?? 0,
  }));
}

function biomarkerDemandScore(biomarker: string, hospitals: Hospital[]): number {
  let score = 0;
  if (Array.isArray(hospitals)) {
    for (const hospital of hospitals) {
      // 🛡️ 防御空值：确保 hospital 存在且 biomarkers 是个数组
      if (hospital && Array.isArray(hospital.biomarkers) && hospital.biomarkers.includes(biomarker)) {
        score += hospital.utilization || 0;
      }
    }
  }
  return score;
}

function buildBiomarkerTrend(hospitals: Hospital[]) {
  const biomarkerSet = new Set<string>();
  
  if (Array.isArray(hospitals)) {
    for (const hospital of hospitals) {
      if (hospital && Array.isArray(hospital.biomarkers)) {
        hospital.biomarkers.forEach((item) => {
          if (item) biomarkerSet.add(item);
        });
      }
    }
  }

  const biomarkerSeries = Array.from(biomarkerSet)
    .map((name) => ({
      name,
      score: biomarkerDemandScore(name, hospitals),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.name);

  const trend = MONTHS.map((month, monthIndex) => {
    const point: Record<string, string | number> = { month };
    for (const biomarker of biomarkerSeries) {
      const base = biomarkerDemandScore(biomarker, hospitals);
      const seasonal =
        0.82 + monthIndex * 0.035 + (biomarker.length % 7) * 0.01;
      point[biomarker] = Math.round(base * seasonal);
    }
    return point;
  });

  return { biomarkerTrend: trend, biomarkerSeries };
}

function buildRegionalCoverage(filtered: Hospital[], all: Hospital[]) {
  const networkByProvince = new Map<string, number>();
  const activeByProvince = new Map<string, number>();

  if (Array.isArray(all)) {
    for (const hospital of all) {
      if (hospital && hospital.province) {
        networkByProvince.set(
          hospital.province,
          (networkByProvince.get(hospital.province) ?? 0) + 1
        );
      }
    }
  }

  if (Array.isArray(filtered)) {
    for (const hospital of filtered) {
      if (hospital && hospital.province) {
        activeByProvince.set(
          hospital.province,
          (activeByProvince.get(hospital.province) ?? 0) + 1
        );
      }
    }
  }

  return Array.from(networkByProvince.entries())
    .map(([province, network]) => ({
      province,
      active: activeByProvince.get(province) ?? 0,
      network,
    }))
    .sort((a, b) => b.active - a.active || b.network - a.network);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function buildGeographicIntelligence(
  filtered: Hospital[]
): GeographicIntelligence {
  const safe = Array.isArray(filtered) ? filtered : [];
  const total = safe.length;

  // Province → hospital count (filters out null/undefined province)
  const provinceCounts = new Map<string, number>();
  for (const h of safe) {
    if (h && h.province) {
      provinceCounts.set(h.province, (provinceCounts.get(h.province) ?? 0) + 1);
    }
  }

  // Region → { hospitals, provinces in that region }
  const regionStats = new Map<
    Region,
    { hospitals: number; provinces: Set<string> }
  >();
  for (const region of REGIONS) {
    regionStats.set(region, { hospitals: 0, provinces: new Set() });
  }
  for (const [province, count] of provinceCounts.entries()) {
    const region = PROVINCE_TO_REGION[province];
    if (!region) continue;
    const bucket = regionStats.get(region);
    if (bucket) {
      bucket.hospitals += count;
      bucket.provinces.add(province);
    }
  }

  const regional = Array.from(regionStats.entries())
    .map(([region, bucket]) => ({
      region,
      hospitalCount: bucket.hospitals,
      provinceCount: bucket.provinces.size,
      sharePercent: total > 0 ? round1((bucket.hospitals / total) * 100) : 0,
    }))
    .sort((a, b) => b.hospitalCount - a.hospitalCount);

  // Province concentration
  const sortedProvinces = Array.from(provinceCounts.entries())
    .map(([province, hospitalCount]) => ({
      province,
      hospitalCount,
      sharePercent: total > 0 ? round1((hospitalCount / total) * 100) : 0,
    }))
    .sort((a, b) => b.hospitalCount - a.hospitalCount);

  const topProvinces = sortedProvinces.slice(0, 3);
  const underrepresented = sortedProvinces
    .filter((p) => p.hospitalCount <= 1)
    .map((p) => p.province);

  // Imbalance signals
  const topProvinceShare = topProvinces[0]?.sharePercent ?? 0;
  const top3HospCount = topProvinces.reduce(
    (sum, p) => sum + p.hospitalCount,
    0
  );
  const top3ProvinceShare =
    total > 0 ? round1((top3HospCount / total) * 100) : 0;
  const dominantRegional = regional.find((r) => r.hospitalCount > 0) ?? null;

  let concentrationLabel: "High" | "Moderate" | "Balanced" = "Balanced";
  if (top3ProvinceShare >= 50) concentrationLabel = "High";
  else if (top3ProvinceShare >= 35) concentrationLabel = "Moderate";

  const totalProvinces = provinceCounts.size;
  const averagePerProvince =
    totalProvinces > 0 ? round1(total / totalProvinces) : 0;

  return {
    regional,
    provinceConcentration: { top: topProvinces, underrepresented },
    imbalance: {
      dominantRegion: dominantRegional?.region ?? null,
      dominantRegionShare: dominantRegional?.sharePercent ?? 0,
      topProvinceShare,
      top3ProvinceShare,
      concentrationLabel,
    },
    coverage: {
      totalHospitals: total,
      totalProvinces,
      averagePerProvince,
    },
  };
}

function buildPlatformIntelligence(filtered: Hospital[]): PlatformIntelligence {
  const safe = Array.isArray(filtered) ? filtered : [];
  const total = safe.length;

  // Platform → institution count (filter null / empty platform strings)
  const platformCounts = new Map<string, number>();
  for (const h of safe) {
    if (h && h.platform && h.platform.trim()) {
      const key = h.platform.trim();
      platformCounts.set(key, (platformCounts.get(key) ?? 0) + 1);
    }
  }

  const distribution = Array.from(platformCounts.entries())
    .map(([platform, institutionCount]) => ({
      platform,
      institutionCount,
      sharePercent: total > 0 ? round1((institutionCount / total) * 100) : 0,
    }))
    .sort((a, b) => b.institutionCount - a.institutionCount);

  const dominantEntry = distribution[0];
  const topPlatformShare = dominantEntry?.sharePercent ?? 0;
  const top2Share = distribution
    .slice(0, 2)
    .reduce((sum, p) => sum + p.sharePercent, 0);
  const top3Share = distribution
    .slice(0, 3)
    .reduce((sum, p) => sum + p.sharePercent, 0);

  let concentrationLabel: "Dominant" | "Concentrated" | "Fragmented" =
    "Fragmented";
  if (topPlatformShare >= 50) concentrationLabel = "Dominant";
  else if (top2Share >= 50) concentrationLabel = "Concentrated";

  const singleInstitutionPlatforms = distribution
    .filter((p) => p.institutionCount === 1)
    .map((p) => p.platform);

  // Regional lead — for each region with at least 1 institution,
  // find the platform with the highest institution count in that region.
  const regionPlatformCounts = new Map<Region, Map<string, number>>();
  for (const region of REGIONS) {
    regionPlatformCounts.set(region, new Map());
  }
  for (const h of safe) {
    if (!h || !h.province || !h.platform || !h.platform.trim()) continue;
    const region = PROVINCE_TO_REGION[h.province];
    if (!region) continue;
    const bucket = regionPlatformCounts.get(region);
    if (!bucket) continue;
    const key = h.platform.trim();
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }

  const leadByRegion: PlatformIntelligence["regional"]["leadByRegion"] = [];
  for (const [region, bucket] of regionPlatformCounts.entries()) {
    if (bucket.size === 0) continue;
    const sorted = Array.from(bucket.entries()).sort((a, b) => b[1] - a[1]);
    const [platform, count] = sorted[0];
    const regionTotal = Array.from(bucket.values()).reduce(
      (sum, n) => sum + n,
      0
    );
    leadByRegion.push({
      region,
      platform,
      institutionCount: count,
      sharePercent: regionTotal > 0 ? round1((count / regionTotal) * 100) : 0,
    });
  }
  const distinctLeadPlatforms = new Set(leadByRegion.map((l) => l.platform))
    .size;

  return {
    distribution,
    dominant: {
      platform: dominantEntry?.platform ?? null,
      sharePercent: topPlatformShare,
    },
    topConcentration: {
      topPlatformShare,
      top2Share: round1(top2Share),
      top3Share: round1(top3Share),
      concentrationLabel,
    },
    fragmentation: {
      totalPlatforms: distribution.length,
      singleInstitutionPlatforms,
    },
    regional: {
      leadByRegion,
      distinctLeadPlatforms,
    },
  };
}

function buildRegulatoryIntelligence(
  filtered: Hospital[]
): RegulatoryIntelligence {
  const safe = Array.isArray(filtered) ? filtered : [];

  const classCounts = new Map<RegulatoryClass, number>([
    ["NMPA-approved", 0],
    ["LDT", 0],
    ["RUO", 0],
    ["Unclassified", 0],
  ]);

  // labType → count of LDT-using institutions (per hospital, not per assay)
  const ldtLabTypes = new Map<string, number>();

  for (const h of safe) {
    if (!h || !Array.isArray(h.assays)) continue;
    let hospitalHasLdt = false;
    for (const a of h.assays) {
      if (!a) continue;
      const cls = classifyAssay(a);
      classCounts.set(cls, (classCounts.get(cls) ?? 0) + 1);
      if (cls === "LDT") hospitalHasLdt = true;
    }
    if (hospitalHasLdt) {
      const tier = (h.labType || "Unknown").trim();
      ldtLabTypes.set(tier, (ldtLabTypes.get(tier) ?? 0) + 1);
    }
  }

  const nmpaCount = classCounts.get("NMPA-approved") ?? 0;
  const ldtCount = classCounts.get("LDT") ?? 0;
  const ruoCount = classCounts.get("RUO") ?? 0;
  const unclassifiedCount = classCounts.get("Unclassified") ?? 0;
  const classifiedCount = nmpaCount + ldtCount + ruoCount;
  const totalEntries = classifiedCount + unclassifiedCount;
  const denom = classifiedCount > 0 ? classifiedCount : 1;

  const nmpaShare = round1((nmpaCount / denom) * 100);
  const ldtShare = round1((ldtCount / denom) * 100);
  const ruoShare = round1((ruoCount / denom) * 100);

  const distribution = (
    ["NMPA-approved", "LDT", "RUO", "Unclassified"] as const
  )
    .map((c) => {
      const count = classCounts.get(c) ?? 0;
      const sharePercent =
        c === "Unclassified" ? 0 : round1((count / denom) * 100);
      return { class: c, count, sharePercent };
    })
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  // Dominant class — only among classified entries.
  const orderedClassified = (["NMPA-approved", "LDT", "RUO"] as const)
    .map((c) => ({ c, s: round1(((classCounts.get(c) ?? 0) / denom) * 100) }))
    .sort((a, b) => b.s - a.s);
  const dominantEntry =
    orderedClassified[0]?.s > 0 ? orderedClassified[0] : null;

  let landscape: RegulatoryIntelligence["landscape"];
  if (classifiedCount < 5) landscape = "Sparse";
  else if (nmpaShare >= 50) landscape = "NMPA-dominant";
  else if (ldtShare >= 50) landscape = "LDT-dominant";
  else landscape = "Mixed";

  let ldtConcentration: RegulatoryIntelligence["ldtConcentration"] = null;
  const totalLdtHospitals = Array.from(ldtLabTypes.values()).reduce(
    (a, b) => a + b,
    0
  );
  if (totalLdtHospitals > 0) {
    const sorted = Array.from(ldtLabTypes.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    const [labType, n] = sorted[0];
    ldtConcentration = {
      dominantLabType: labType,
      sharePercent: round1((n / totalLdtHospitals) * 100),
    };
  }

  return {
    distribution,
    totals: { classifiedCount, unclassifiedCount, totalEntries },
    dominant: {
      class: dominantEntry?.c ?? null,
      sharePercent: dominantEntry?.s ?? 0,
    },
    shares: { nmpa: nmpaShare, ldt: ldtShare, ruo: ruoShare },
    landscape,
    ldtConcentration,
  };
}

function buildScoringIntelligence(
  filtered: Hospital[]
): ScoringIntelligence {
  const safe = Array.isArray(filtered) ? filtered : [];

  // Row-level exclusive scoring categories.
  // ["TPS"] = TPS-only
  // ["CPS"] = CPS-only
  // ["TPS", "CPS"] = TPS+CPS co-reporting
  // ["%TC"] or ["TC"] = TC
  const methodCounts = new Map<ScoringMethod, number>([
    ["TPS", 0], // TPS-only
    ["CPS", 0], // CPS-only
    ["IC", 0],
    ["TC", 0],
  ]);

  let classifiedLabCount = 0;
  let unclassifiedCount = 0;
  const tpsCpsLabs: string[] = [];

  const normalizeScoringMethod = (value: unknown): ScoringMethod | null => {
    const text = String(value || "")
      .replace(/[\[\]"']/g, "")
      .trim()
      .toUpperCase();

    if (!text) return null;

    if (text === "%TC" || text === "TC" || text.includes("TUMOR CELL")) return "TC";
    if (text === "IC" || text.includes("IMMUNE CELL")) return "IC";
    if (text.includes("TPS") || text.includes("TUMOR PROPORTION")) return "TPS";
    if (text.includes("CPS") || text.includes("COMBINED POSITIVE")) return "CPS";

    return null;
  };

  const expandScoringValues = (values: unknown[]): ScoringMethod[] => {
    const methods = values.flatMap((value) =>
      String(value || "")
        .split(/[,+/;|]/)
        .map((item) => normalizeScoringMethod(item))
        .filter((item): item is ScoringMethod => Boolean(item))
    );

    return Array.from(new Set(methods));
  };

  const countExclusiveCategory = (methods: ScoringMethod[], labName: string) => {
    if (methods.length === 0) {
      unclassifiedCount += 1;
      return;
    }

    classifiedLabCount += 1;

    const hasTPS = methods.includes("TPS");
    const hasCPS = methods.includes("CPS");
    const hasIC = methods.includes("IC");
    const hasTC = methods.includes("TC");

    if (hasTPS && hasCPS) {
      tpsCpsLabs.push(labName || "Unknown Laboratory");
      return;
    }

    if (hasTPS) {
      methodCounts.set("TPS", (methodCounts.get("TPS") ?? 0) + 1);
      return;
    }

    if (hasCPS) {
      methodCounts.set("CPS", (methodCounts.get("CPS") ?? 0) + 1);
      return;
    }

    if (hasIC) {
      methodCounts.set("IC", (methodCounts.get("IC") ?? 0) + 1);
      return;
    }

    if (hasTC) {
      methodCounts.set("TC", (methodCounts.get("TC") ?? 0) + 1);
      return;
    }

    unclassifiedCount += 1;
  };

  for (const h of safe) {
    if (!h) continue;

    const explicitScoring = Array.isArray(h.scoring)
      ? expandScoringValues(h.scoring)
      : [];

    if (explicitScoring.length > 0) {
      countExclusiveCategory(explicitScoring, h.name || "Unknown Laboratory");
      continue;
    }

    // Fallback only when explicit scoring is absent.
    const inferredMethods = Array.isArray(h.assays)
      ? h.assays
          .map((a) => deriveScoringMethod(a))
          .filter((item): item is ScoringMethod => Boolean(item))
      : [];

    countExclusiveCategory(
      Array.from(new Set(inferredMethods)),
      h.name || "Unknown Laboratory"
    );
  }

  const tpsOnlyCount = methodCounts.get("TPS") ?? 0;
  const cpsOnlyCount = methodCounts.get("CPS") ?? 0;
  const icCount = methodCounts.get("IC") ?? 0;
  const tcCount = methodCounts.get("TC") ?? 0;
  const tpsCpsCount = tpsCpsLabs.length;

  const totalEntries = classifiedLabCount + unclassifiedCount;
  const denom = classifiedLabCount > 0 ? classifiedLabCount : 1;

  const tpsOnlyShare = round1((tpsOnlyCount / denom) * 100);
  const cpsOnlyShare = round1((cpsOnlyCount / denom) * 100);
  const icShare = round1((icCount / denom) * 100);
  const tcShare = round1((tcCount / denom) * 100);
  const tpsCpsSharePercent = round1((tpsCpsCount / denom) * 100);

  const distribution = (["TPS", "CPS", "IC", "TC"] as const)
    .map((m) => ({
      method: m,
      count: methodCounts.get(m) ?? 0,
      sharePercent: round1(((methodCounts.get(m) ?? 0) / denom) * 100),
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const distinctMethods =
    distribution.length + (tpsCpsCount > 0 ? 1 : 0);
  const topMethod = distribution[0] ?? null;

  let landscape: ScoringIntelligence["landscape"];
  if (classifiedLabCount < 5) landscape = "Sparse";
  else if (tpsOnlyShare >= 60) landscape = "TPS-dominant";
  else if (cpsOnlyShare >= 60) landscape = "CPS-dominant";
  else if (distinctMethods >= 4 && (topMethod?.sharePercent ?? 0) < 40)
    landscape = "Heterogeneous";
  else landscape = "Mixed";

  return {
    distribution,
    totals: {
      classifiedCount: classifiedLabCount,
      unclassifiedCount,
      totalEntries,
    },
    dominant: {
      method: topMethod?.method ?? null,
      sharePercent: topMethod?.sharePercent ?? 0,
    },
    shares: {
      tps: tpsOnlyShare,
      cps: cpsOnlyShare,
      ic: icShare,
      tc: tcShare,
    },
    distinctMethods,
    coReporting: {
      tpsCpsLabs,
      tpsCpsCount,
      tpsCpsSharePercent,
    },
    landscape,
  };
}

function buildInstitutionIntelligence(
  filtered: Hospital[]
): InstitutionIntelligence {
  const safe = Array.isArray(filtered) ? filtered : [];
  const totalInstitutions = safe.length;

  let hospitalCount = 0;
  let commercialCount = 0;
  let unclassifiedCount = 0;

  const segmentProvinces = new Set<string>();
  const commercialProvinces = new Set<string>();
  let tier1CommercialCount = 0;

  for (const h of safe) {
    if (!h) continue;
    if (h.province) segmentProvinces.add(h.province);

    const rawType = (h.labType || "").trim().toUpperCase();
    if (rawType === "HOSPITAL") {
      hospitalCount += 1;
    } else if (rawType === "COMMERCIAL") {
      commercialCount += 1;
      if (h.province) commercialProvinces.add(h.province);
      if (isTier1City(h.city)) tier1CommercialCount += 1;
    } else {
      unclassifiedCount += 1;
    }
  }

  const classifiedCount = hospitalCount + commercialCount;
  const denom = classifiedCount > 0 ? classifiedCount : 1;

  const hospitalShare = round1((hospitalCount / denom) * 100);
  const commercialShare = round1((commercialCount / denom) * 100);

  let landscape: InstitutionIntelligence["landscape"];
  if (classifiedCount < 5) landscape = "Sparse";
  else if (hospitalShare >= 60) landscape = "Hospital-dominant";
  else if (commercialShare >= 50) landscape = "Commercial-dominant";
  else landscape = "Mixed";

  const dominantType: InstitutionIntelligence["dominant"]["type"] =
    classifiedCount === 0
      ? null
      : hospitalShare >= commercialShare
      ? "teaching-hospital"
      : "commercial";
  const dominantShare =
    dominantType === "teaching-hospital"
      ? hospitalShare
      : dominantType === "commercial"
      ? commercialShare
      : 0;

  const commercialProvinceShare =
    segmentProvinces.size > 0
      ? round1((commercialProvinces.size / segmentProvinces.size) * 100)
      : 0;
  const tier1CommercialShare =
    commercialCount > 0
      ? round1((tier1CommercialCount / commercialCount) * 100)
      : 0;

  return {
    distribution: {
      teachingHospital: { count: hospitalCount, sharePercent: hospitalShare },
      commercial: { count: commercialCount, sharePercent: commercialShare },
    },
    totals: {
      totalInstitutions,
      classifiedCount,
      unclassifiedCount,
    },
    dominant: { type: dominantType, sharePercent: dominantShare },
    landscape,
    commercialFootprint: {
      totalCommercial: commercialCount,
      commercialProvinces: commercialProvinces.size,
      segmentProvinces: segmentProvinces.size,
      commercialProvinceShare,
      tier1CommercialCount,
      tier1CommercialShare,
      isMetroConcentrated: commercialCount >= 3 && tier1CommercialShare >= 70,
    },
  };
}

function buildReimbursementIntelligence(
  filtered: Hospital[]
): ReimbursementIntelligence {
  const safe = Array.isArray(filtered) ? filtered : [];

  let reimbursedCount = 0;
  let nonReimbursedCount = 0;
  const prices: number[] = [];

  // Province-level coverage tracking
  const provinceCoverage = new Map<string, { total: number; covered: number }>();
  let tier1Total = 0;
  let tier1Covered = 0;
  let nonTier1Total = 0;
  let nonTier1Covered = 0;

  for (const h of safe) {
    if (!h) continue;
    const status = h.reimbursementStatus;
    const isCovered = status === "YES";
    const isCounted = status === "YES" || status === "NO";

    if (status === "YES") reimbursedCount += 1;
    if (status === "NO") nonReimbursedCount += 1;

    if (isCounted) {
      if (h.province) {
        const bucket =
          provinceCoverage.get(h.province) ?? { total: 0, covered: 0 };
        bucket.total += 1;
        if (isCovered) bucket.covered += 1;
        provinceCoverage.set(h.province, bucket);
      }
      const tier1 = isTier1City(h.city);
      if (tier1) {
        tier1Total += 1;
        if (isCovered) tier1Covered += 1;
      } else {
        nonTier1Total += 1;
        if (isCovered) nonTier1Covered += 1;
      }
    }

    if (typeof h.reimbursementCny === "number" && h.reimbursementCny > 0) {
      prices.push(h.reimbursementCny);
    }
  }

  const totalCount = reimbursedCount + nonReimbursedCount;
  const reimbursedShare =
    totalCount > 0 ? round1((reimbursedCount / totalCount) * 100) : 0;

  let landscape: ReimbursementIntelligence["coverage"]["landscape"];
  if (totalCount < 5) landscape = "Sparse";
  else if (reimbursedShare >= 80) landscape = "Broad";
  else if (reimbursedShare >= 50) landscape = "Established";
  else landscape = "Limited";

  // Pricing stats
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const min = sortedPrices[0] ?? null;
  const max = sortedPrices[sortedPrices.length - 1] ?? null;
  let median: number | null = null;
  if (sortedPrices.length > 0) {
    const mid = Math.floor(sortedPrices.length / 2);
    median =
      sortedPrices.length % 2 === 0
        ? Math.round((sortedPrices[mid - 1] + sortedPrices[mid]) / 2)
        : sortedPrices[mid];
  }
  const spreadRatio =
    min && max && min > 0 ? Math.round((max / min) * 10) / 10 : null;

  let variabilityLabel: ReimbursementIntelligence["pricing"]["variabilityLabel"];
  if (prices.length < 3) variabilityLabel = "Insufficient";
  else if (spreadRatio !== null && spreadRatio >= 2.5) variabilityLabel = "High";
  else if (spreadRatio !== null && spreadRatio >= 1.5)
    variabilityLabel = "Moderate";
  else variabilityLabel = "Uniform";

  // Province cohort buckets
  const fullyCovered: string[] = [];
  const uncovered: string[] = [];
  const partial: string[] = [];
  for (const [prov, b] of provinceCoverage.entries()) {
    if (b.total === 0) continue;
    if (b.covered === b.total) fullyCovered.push(prov);
    else if (b.covered === 0) uncovered.push(prov);
    else partial.push(prov);
  }

  // Tier-1 vs non-tier-1 rates
  const tier1CoverageRate =
    tier1Total > 0 ? round1((tier1Covered / tier1Total) * 100) : 0;
  const nonTier1CoverageRate =
    nonTier1Total > 0 ? round1((nonTier1Covered / nonTier1Total) * 100) : 0;
  const coverageGapPP = round1(tier1CoverageRate - nonTier1CoverageRate);

  return {
    coverage: {
      reimbursedCount,
      nonReimbursedCount,
      totalCount,
      reimbursedShare,
      landscape,
    },
    pricing: {
      samples: prices.length,
      min,
      max,
      median,
      spreadRatio,
      variabilityLabel,
    },
    provincialCoverage: {
      fullyCoveredProvinces: fullyCovered,
      uncoveredProvinces: uncovered,
      partiallyCoveredProvinces: partial,
      fullyCoveredCount: fullyCovered.length,
      uncoveredCount: uncovered.length,
      segmentProvinces: provinceCoverage.size,
    },
    tier1Comparison: {
      tier1Total,
      tier1Covered,
      tier1CoverageRate,
      nonTier1Total,
      nonTier1Covered,
      nonTier1CoverageRate,
      coverageGapPP,
    },
  };
}

function buildMarketAnalyticsSnapshot(
  filtered: Hospital[]
): MarketAnalyticsSnapshot {
  const safe = Array.isArray(filtered) ? filtered : [];
  const totalInstitutions = safe.length;

  const platformCounts = new Map<string, number>();
  const regionCounts = new Map<DetailedRegion, number>();
  for (const r of DETAILED_REGIONS) regionCounts.set(r, 0);
  const provinces = new Set<string>();

  for (const h of safe) {
    if (!h) continue;
    if (h.platform && h.platform.trim()) {
      const key = h.platform.trim();
      platformCounts.set(key, (platformCounts.get(key) ?? 0) + 1);
    }
    if (h.province) {
      provinces.add(h.province);
      const region = resolveDetailedRegion(h.province);
      if (region) regionCounts.set(region, (regionCounts.get(region) ?? 0) + 1);
    }
  }

  const denom = totalInstitutions > 0 ? totalInstitutions : 1;

  const platformDistribution = Array.from(platformCounts.entries())
    .map(([platform, institutionCount]) => ({
      platform,
      institutionCount,
      sharePercent: round1((institutionCount / denom) * 100),
    }))
    .sort((a, b) => b.institutionCount - a.institutionCount);

  const regionalDistribution = Array.from(regionCounts.entries())
    .map(([region, institutionCount]) => ({
      region,
      institutionCount,
      sharePercent: round1((institutionCount / denom) * 100),
    }))
    .sort((a, b) => b.institutionCount - a.institutionCount);

  const dominantPlatform = platformDistribution[0]?.platform ?? null;
  const topRegional =
    regionalDistribution.find((r) => r.institutionCount > 0) ?? null;

  return {
    platformDistribution,
    regionalDistribution,
    kpis: {
      totalInstitutions,
      totalProvinces: provinces.size,
      dominantPlatform,
      mostConcentratedRegion: topRegional?.region ?? null,
    },
  };
}

export function computeAnalytics(
  filtered: Hospital[],
  all: Hospital[]
): AnalyticsSnapshot {
  const safeFiltered = Array.isArray(filtered) ? filtered : [];
  const safeAll = Array.isArray(all) ? all : [];

  const { biomarkerTrend, biomarkerSeries } = buildBiomarkerTrend(safeFiltered);

  return {
    assayDistribution: buildAssayDistribution(safeFiltered),
    tatDistribution: buildTatDistribution(safeFiltered),
    biomarkerTrend,
    biomarkerSeries,
    regionalCoverage: buildRegionalCoverage(safeFiltered, safeAll),
    geographicIntelligence: buildGeographicIntelligence(safeFiltered),
    platformIntelligence: buildPlatformIntelligence(safeFiltered),
    regulatoryIntelligence: buildRegulatoryIntelligence(safeFiltered),
    scoringIntelligence: buildScoringIntelligence(safeFiltered),
    institutionIntelligence: buildInstitutionIntelligence(safeFiltered),
    reimbursementIntelligence: buildReimbursementIntelligence(safeFiltered),
    marketAnalyticsSnapshot: buildMarketAnalyticsSnapshot(safeFiltered),
  };
}

export { CHART_COLORS };