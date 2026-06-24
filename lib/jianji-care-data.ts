// lib/jianji-care-data.ts
// Mock dataset for the Jianji Care™ Supplier Intelligence Platform demo.
//
// China elderly care and rehabilitation device supplier intelligence for
// international procurement, supplier evaluation, and market development.
//
// All supplier names are fictional. Figures are illustrative and intended
// only for demonstration of the supplier-intelligence view. This file is a
// self-contained mock — it is not connected to Supabase or any live source.

export type ProductCategory =
  | "Electric wheelchair"
  | "Manual wheelchair"
  | "Mobility scooter"
  | "Hospital bed"
  | "Care sofa / recliner"
  | "Patient lift"
  | "Walking aids"
  | "Bathroom safety"
  | "Home care devices";

export type FactoryType =
  | "Manufacturer"
  | "Trading Company"
  | "Manufacturer + Export Office";

export type AuditStatus =
  | "Not audited"
  | "Desktop reviewed"
  | "Site visited"
  | "Formal audit completed";

export type ReadinessLevel = "High" | "Medium" | "Low";

export type RiskLevel = "Low" | "Medium" | "High";

export interface CareSupplier {
  id: string;
  supplierName: string;
  province: string;
  city: string;
  region: string;
  productCategories: ProductCategory[];
  keyProducts: string[];
  factoryType: FactoryType;
  exportMarkets: string[];
  certifications: string[];
  auditStatus: AuditStatus;
  /** 0–100 composite export-readiness signal. */
  exportReadiness: number;
  /** 0–100 quality-system maturity signal. */
  qualitySystem: number;
  /** 0–100 certification-completeness signal. */
  certificationCompleteness: number;
  /** 0–100 product-competitiveness signal. */
  productCompetitiveness: number;
  /** 0–100 communication-responsiveness signal. */
  communicationResponsiveness: number;
  overallReadiness: ReadinessLevel;
  riskLevel: RiskLevel;
  byteAssessmentNote: string;
}

// Canonical product-category taxonomy used by filters and summaries.
export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  "Electric wheelchair",
  "Manual wheelchair",
  "Mobility scooter",
  "Hospital bed",
  "Care sofa / recliner",
  "Patient lift",
  "Walking aids",
  "Bathroom safety",
  "Home care devices",
] as const;

export const AUDIT_STATUSES: readonly AuditStatus[] = [
  "Not audited",
  "Desktop reviewed",
  "Site visited",
  "Formal audit completed",
] as const;

export const READINESS_LEVELS: readonly ReadinessLevel[] = [
  "High",
  "Medium",
  "Low",
] as const;

export const CARE_SUPPLIERS: CareSupplier[] = [
  {
    id: "JC-001",
    supplierName: "Hangzhou WellAge Medical Technology Co., Ltd.",
    province: "Zhejiang",
    city: "Hangzhou",
    region: "Yangtze River Delta",
    productCategories: ["Electric wheelchair", "Mobility scooter", "Walking aids"],
    keyProducts: [
      "Foldable lithium-battery electric wheelchair",
      "Four-wheel mobility scooter",
      "Height-adjustable rollator",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["Germany", "Japan", "Australia"],
    certifications: ["ISO 13485", "CE", "FDA 510(k)"],
    auditStatus: "Formal audit completed",
    exportReadiness: 88,
    qualitySystem: 86,
    certificationCompleteness: 90,
    productCompetitiveness: 84,
    communicationResponsiveness: 87,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Mature export operation with a dedicated overseas-sales team and complete documentation. Suitable as a primary candidate for European procurement programmes.",
  },
  {
    id: "JC-002",
    supplierName: "Ningbo Wellmove Health Products Co., Ltd.",
    province: "Zhejiang",
    city: "Ningbo",
    region: "Yangtze River Delta",
    productCategories: ["Hospital bed", "Patient lift", "Care sofa / recliner"],
    keyProducts: [
      "Five-function electric nursing bed",
      "Mobile patient hoist",
      "Powered recliner care chair",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Middle East", "Southeast Asia"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Site visited",
    exportReadiness: 74,
    qualitySystem: 78,
    certificationCompleteness: 72,
    productCompetitiveness: 76,
    communicationResponsiveness: 70,
    overallReadiness: "Medium",
    riskLevel: "Medium",
    byteAssessmentNote:
      "Solid manufacturing base for institutional nursing furniture. FDA pathway not yet started; recommend confirming documentation before North American engagement.",
  },
  {
    id: "JC-003",
    supplierName: "Taizhou Evergreen Mobility Products Co., Ltd.",
    province: "Zhejiang",
    city: "Taizhou",
    region: "Yangtze River Delta",
    productCategories: ["Mobility scooter", "Electric wheelchair"],
    keyProducts: [
      "Three-wheel mobility scooter",
      "Compact travel power wheelchair",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Southeast Asia"],
    certifications: ["ISO 9001", "CE"],
    auditStatus: "Desktop reviewed",
    exportReadiness: 58,
    qualitySystem: 60,
    certificationCompleteness: 55,
    productCompetitiveness: 68,
    communicationResponsiveness: 62,
    overallReadiness: "Medium",
    riskLevel: "Medium",
    byteAssessmentNote:
      "Competitive unit pricing on entry mobility scooters. Quality-system maturity is moderate; an on-site review is advised before committing to volume orders.",
  },
  {
    id: "JC-004",
    supplierName: "Suzhou Kangyuan Rehabilitation Equipment Co., Ltd.",
    province: "Jiangsu",
    city: "Suzhou",
    region: "Yangtze River Delta",
    productCategories: ["Patient lift", "Hospital bed", "Home care devices"],
    keyProducts: [
      "Ceiling-track patient lift",
      "ICU-grade electric bed",
      "Anti-decubitus mattress system",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["Germany", "United Kingdom", "Canada"],
    certifications: ["ISO 13485", "CE", "FDA 510(k)"],
    auditStatus: "Formal audit completed",
    exportReadiness: 90,
    qualitySystem: 88,
    certificationCompleteness: 92,
    productCompetitiveness: 85,
    communicationResponsiveness: 86,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Strong engineering capability in patient-handling systems and complete regulatory coverage. Well positioned for institutional elderly-care tenders in Europe and North America.",
  },
  {
    id: "JC-005",
    supplierName: "Nanjing U-Care Medical Technology Co., Ltd.",
    province: "Jiangsu",
    city: "Nanjing",
    region: "Yangtze River Delta",
    productCategories: ["Walking aids", "Bathroom safety", "Home care devices"],
    keyProducts: [
      "Foldable walking frame",
      "Shower commode chair",
      "Bed-rail support system",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Southeast Asia", "Middle East"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Site visited",
    exportReadiness: 71,
    qualitySystem: 73,
    certificationCompleteness: 70,
    productCompetitiveness: 72,
    communicationResponsiveness: 75,
    overallReadiness: "Medium",
    riskLevel: "Low",
    byteAssessmentNote:
      "Broad daily-living-aids catalogue with consistent build quality. A reliable secondary source for mixed bathroom-safety and walking-aid programmes.",
  },
  {
    id: "JC-006",
    supplierName: "Changzhou Greenlife Assistive Products Co., Ltd.",
    province: "Jiangsu",
    city: "Changzhou",
    region: "Yangtze River Delta",
    productCategories: ["Manual wheelchair", "Walking aids", "Bathroom safety"],
    keyProducts: [
      "Standard steel manual wheelchair",
      "Aluminium crutches",
      "Wall-mounted grab bars",
    ],
    factoryType: "Trading Company",
    exportMarkets: ["Africa", "Southeast Asia"],
    certifications: ["ISO 9001"],
    auditStatus: "Desktop reviewed",
    exportReadiness: 49,
    qualitySystem: 45,
    certificationCompleteness: 42,
    productCompetitiveness: 58,
    communicationResponsiveness: 66,
    overallReadiness: "Low",
    riskLevel: "High",
    byteAssessmentNote:
      "Trading company aggregating multiple factories with competitive pricing. Manufacturing source traceability should be confirmed; a site visit is recommended before procurement.",
  },
  {
    id: "JC-007",
    supplierName: "Shanghai Wellcare Medical Technology Co., Ltd.",
    province: "Shanghai",
    city: "Shanghai",
    region: "Yangtze River Delta",
    productCategories: ["Hospital bed", "Care sofa / recliner", "Patient lift"],
    keyProducts: [
      "Low-height fall-prevention nursing bed",
      "Tilt-in-space care recliner",
      "Sit-to-stand transfer aid",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["Japan", "Australia", "United States"],
    certifications: ["ISO 13485", "CE", "FDA 510(k)"],
    auditStatus: "Formal audit completed",
    exportReadiness: 86,
    qualitySystem: 84,
    certificationCompleteness: 88,
    productCompetitiveness: 83,
    communicationResponsiveness: 89,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Export-oriented operation with strong English-language communication and design capability tuned to Japanese and Australian care standards.",
  },
  {
    id: "JC-008",
    supplierName: "Foshan Heli Care Furniture Co., Ltd.",
    province: "Guangdong",
    city: "Foshan",
    region: "Pearl River Delta",
    productCategories: ["Care sofa / recliner", "Hospital bed", "Home care devices"],
    keyProducts: [
      "Reclining geriatric care chair",
      "Wooden-frame nursing bed",
      "Adjustable overbed table",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Southeast Asia", "Middle East", "Europe"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Site visited",
    exportReadiness: 76,
    qualitySystem: 75,
    certificationCompleteness: 74,
    productCompetitiveness: 80,
    communicationResponsiveness: 72,
    overallReadiness: "Medium",
    riskLevel: "Low",
    byteAssessmentNote:
      "Furniture-led care manufacturer with strong finishing quality. Competitive on recliner and care-chair lines; documentation suitable for European distribution.",
  },
  {
    id: "JC-009",
    supplierName: "Shenzhen Brightlife Smart Mobility Co., Ltd.",
    province: "Guangdong",
    city: "Shenzhen",
    region: "Pearl River Delta",
    productCategories: ["Electric wheelchair", "Mobility scooter", "Home care devices"],
    keyProducts: [
      "Carbon-fibre folding power wheelchair",
      "Lightweight airline-approved scooter",
      "Remote fall-detection sensor",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["United States", "Germany", "Japan"],
    certifications: ["ISO 13485", "CE", "FDA 510(k)"],
    auditStatus: "Formal audit completed",
    exportReadiness: 89,
    qualitySystem: 85,
    certificationCompleteness: 87,
    productCompetitiveness: 90,
    communicationResponsiveness: 88,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Design-driven manufacturer with strong lithium-battery and lightweight-materials expertise. A leading candidate for premium mobility lines.",
  },
  {
    id: "JC-010",
    supplierName: "Guangzhou Sunrise Medical Trading Co., Ltd.",
    province: "Guangdong",
    city: "Guangzhou",
    region: "Pearl River Delta",
    productCategories: ["Manual wheelchair", "Mobility scooter", "Walking aids"],
    keyProducts: [
      "Lightweight aluminium wheelchair",
      "Mid-range mobility scooter",
      "Quad-base walking cane",
    ],
    factoryType: "Trading Company",
    exportMarkets: ["Africa", "South America", "Southeast Asia"],
    certifications: ["ISO 9001", "CE"],
    auditStatus: "Not audited",
    exportReadiness: 52,
    qualitySystem: 48,
    certificationCompleteness: 50,
    productCompetitiveness: 60,
    communicationResponsiveness: 68,
    overallReadiness: "Low",
    riskLevel: "High",
    byteAssessmentNote:
      "Broad export network across multiple markets. Factory assessment is not yet complete; further desktop review and a site visit are recommended before procurement.",
  },
  {
    id: "JC-011",
    supplierName: "Dongguan Homewell Care Products Co., Ltd.",
    province: "Guangdong",
    city: "Dongguan",
    region: "Pearl River Delta",
    productCategories: ["Bathroom safety", "Home care devices", "Walking aids"],
    keyProducts: [
      "Non-slip shower stool",
      "Raised toilet seat with armrests",
      "Bedside support handle",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Europe", "Southeast Asia"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Desktop reviewed",
    exportReadiness: 64,
    qualitySystem: 66,
    certificationCompleteness: 63,
    productCompetitiveness: 67,
    communicationResponsiveness: 65,
    overallReadiness: "Medium",
    riskLevel: "Medium",
    byteAssessmentNote:
      "Focused bathroom-safety manufacturer with reasonable tooling. Desktop review is positive; an on-site visit would confirm consistency for larger programmes.",
  },
  {
    id: "JC-012",
    supplierName: "Qingdao Seaside Homecare Equipment Co., Ltd.",
    province: "Shandong",
    city: "Qingdao",
    region: "Bohai Rim",
    productCategories: ["Hospital bed", "Patient lift", "Electric wheelchair"],
    keyProducts: [
      "Three-function electric nursing bed",
      "Floor-standing patient lift",
      "Reclining power wheelchair",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["Europe", "Middle East", "Japan"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Site visited",
    exportReadiness: 79,
    qualitySystem: 80,
    certificationCompleteness: 76,
    productCompetitiveness: 78,
    communicationResponsiveness: 77,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Well-organised northern manufacturer with diversified care lines and good port access. A dependable mid-to-high volume partner for European buyers.",
  },
  {
    id: "JC-013",
    supplierName: "Jinan Evercare Medical Equipment Co., Ltd.",
    province: "Shandong",
    city: "Jinan",
    region: "Bohai Rim",
    productCategories: ["Manual wheelchair", "Hospital bed", "Walking aids"],
    keyProducts: [
      "Reinforced bariatric wheelchair",
      "Manual crank nursing bed",
      "Adjustable walking frame",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Middle East", "Africa"],
    certifications: ["ISO 9001", "CE"],
    auditStatus: "Desktop reviewed",
    exportReadiness: 56,
    qualitySystem: 58,
    certificationCompleteness: 52,
    productCompetitiveness: 62,
    communicationResponsiveness: 59,
    overallReadiness: "Medium",
    riskLevel: "Medium",
    byteAssessmentNote:
      "Cost-competitive on heavy-duty manual products. Certification profile requires confirmation; ISO 13485 coverage should be checked before regulated-market entry.",
  },
  {
    id: "JC-014",
    supplierName: "Weifang Goodwill Care Devices Co., Ltd.",
    province: "Shandong",
    city: "Weifang",
    region: "Bohai Rim",
    productCategories: ["Care sofa / recliner", "Home care devices", "Bathroom safety"],
    keyProducts: [
      "Manual care recliner",
      "Folding bath transfer bench",
      "Incontinence-care underpad dispenser",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Southeast Asia"],
    certifications: ["ISO 9001"],
    auditStatus: "Not audited",
    exportReadiness: 44,
    qualitySystem: 46,
    certificationCompleteness: 40,
    productCompetitiveness: 55,
    communicationResponsiveness: 52,
    overallReadiness: "Low",
    riskLevel: "High",
    byteAssessmentNote:
      "Early-stage exporter developing its certification profile. Certification profile requires confirmation and a site visit is recommended before procurement.",
  },
  {
    id: "JC-015",
    supplierName: "Shijiazhuang Huakang Rehabilitation Co., Ltd.",
    province: "Hebei",
    city: "Shijiazhuang",
    region: "Bohai Rim",
    productCategories: ["Walking aids", "Manual wheelchair", "Bathroom safety"],
    keyProducts: [
      "Steel rollator with seat",
      "Economy folding wheelchair",
      "Bathroom safety rail set",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Africa", "Middle East"],
    certifications: ["ISO 9001", "CE"],
    auditStatus: "Desktop reviewed",
    exportReadiness: 53,
    qualitySystem: 54,
    certificationCompleteness: 48,
    productCompetitiveness: 60,
    communicationResponsiveness: 57,
    overallReadiness: "Medium",
    riskLevel: "Medium",
    byteAssessmentNote:
      "Volume-oriented producer of basic mobility and safety items. Suitable for value programmes; quality consistency should be confirmed on site.",
  },
  {
    id: "JC-016",
    supplierName: "Hengshui Anbang Medical Products Co., Ltd.",
    province: "Hebei",
    city: "Hengshui",
    region: "Bohai Rim",
    productCategories: ["Home care devices", "Bathroom safety", "Walking aids"],
    keyProducts: [
      "Reusable bed pad",
      "Bedside commode chair",
      "Adjustable underarm crutch",
    ],
    factoryType: "Trading Company",
    exportMarkets: ["Africa", "Southeast Asia"],
    certifications: ["ISO 9001"],
    auditStatus: "Not audited",
    exportReadiness: 41,
    qualitySystem: 42,
    certificationCompleteness: 38,
    productCompetitiveness: 50,
    communicationResponsiveness: 60,
    overallReadiness: "Low",
    riskLevel: "High",
    byteAssessmentNote:
      "Trading intermediary serving value-focused markets. Manufacturing origin and quality system should be reviewed, and export documentation checked, before supplier approval.",
  },
  {
    id: "JC-017",
    supplierName: "Xiamen Carelink Rehabilitation Products Co., Ltd.",
    province: "Fujian",
    city: "Xiamen",
    region: "Southeast Coast",
    productCategories: ["Electric wheelchair", "Mobility scooter", "Walking aids"],
    keyProducts: [
      "Outdoor all-terrain power wheelchair",
      "Heavy-duty mobility scooter",
      "Carbon-fibre walking stick",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["Europe", "Australia", "United States"],
    certifications: ["ISO 13485", "CE", "FDA 510(k)"],
    auditStatus: "Site visited",
    exportReadiness: 82,
    qualitySystem: 81,
    certificationCompleteness: 83,
    productCompetitiveness: 84,
    communicationResponsiveness: 80,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Coastal exporter with good logistics and a strong outdoor-mobility line. Documentation is complete and communication is responsive for Western buyers.",
  },
  {
    id: "JC-018",
    supplierName: "Quanzhou Mingcare Care Products Co., Ltd.",
    province: "Fujian",
    city: "Quanzhou",
    region: "Southeast Coast",
    productCategories: ["Care sofa / recliner", "Hospital bed", "Home care devices"],
    keyProducts: [
      "Fabric-finish care recliner",
      "Two-function nursing bed",
      "Portable bed-exit alarm",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Southeast Asia", "Middle East"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Desktop reviewed",
    exportReadiness: 63,
    qualitySystem: 64,
    certificationCompleteness: 61,
    productCompetitiveness: 66,
    communicationResponsiveness: 62,
    overallReadiness: "Medium",
    riskLevel: "Medium",
    byteAssessmentNote:
      "Mid-range care-furniture manufacturer with acceptable certification. An on-site audit is recommended to confirm capacity for larger contracts.",
  },
  {
    id: "JC-019",
    supplierName: "Hefei Ankang Assistive Devices Co., Ltd.",
    province: "Anhui",
    city: "Hefei",
    region: "Yangtze River Delta",
    productCategories: ["Patient lift", "Hospital bed", "Walking aids"],
    keyProducts: [
      "Mobile sit-to-stand lift",
      "Four-function electric care bed",
      "Forearm support walker",
    ],
    factoryType: "Manufacturer",
    exportMarkets: ["Europe", "Southeast Asia"],
    certifications: ["ISO 13485", "CE"],
    auditStatus: "Site visited",
    exportReadiness: 72,
    qualitySystem: 74,
    certificationCompleteness: 71,
    productCompetitiveness: 73,
    communicationResponsiveness: 70,
    overallReadiness: "Medium",
    riskLevel: "Low",
    byteAssessmentNote:
      "Inland manufacturer with improving export processes and competitive labour costs. A credible patient-handling source for buyers comfortable with longer lead times.",
  },
  {
    id: "JC-020",
    supplierName: "Tianjin Northcare Medical Devices Co., Ltd.",
    province: "Tianjin",
    city: "Tianjin",
    region: "Bohai Rim",
    productCategories: ["Hospital bed", "Patient lift", "Care sofa / recliner"],
    keyProducts: [
      "Heavy-duty bariatric nursing bed",
      "Twin-motor patient lift",
      "Pressure-relief care recliner",
    ],
    factoryType: "Manufacturer + Export Office",
    exportMarkets: ["Europe", "Middle East", "Japan"],
    certifications: ["ISO 13485", "CE", "FDA 510(k)"],
    auditStatus: "Formal audit completed",
    exportReadiness: 85,
    qualitySystem: 83,
    certificationCompleteness: 86,
    productCompetitiveness: 81,
    communicationResponsiveness: 82,
    overallReadiness: "High",
    riskLevel: "Low",
    byteAssessmentNote:
      "Northern port-adjacent manufacturer with complete regulatory coverage and capacity for bariatric and institutional lines. Strong option for large care-home tenders.",
  },
];

// ── Derived summary helpers ────────────────────────────────────────────────
// Pure, typed aggregations used by the metric cards, insight section, and the
// Tailwind-based visual summary. Kept here so the page stays declarative.

export interface CountBucket {
  label: string;
  count: number;
}

export interface CareMetrics {
  totalSuppliers: number;
  productCategories: number;
  provincesCovered: number;
  highReadiness: number;
  auditedOrVisited: number;
}

const AUDITED_STATUSES: ReadonlySet<AuditStatus> = new Set<AuditStatus>([
  "Site visited",
  "Formal audit completed",
]);

export function isAuditedOrVisited(status: AuditStatus): boolean {
  return AUDITED_STATUSES.has(status);
}

export function computeCareMetrics(
  suppliers: readonly CareSupplier[],
): CareMetrics {
  const categorySet = new Set<ProductCategory>();
  const provinceSet = new Set<string>();
  let highReadiness = 0;
  let auditedOrVisited = 0;

  for (const supplier of suppliers) {
    supplier.productCategories.forEach((category) => categorySet.add(category));
    provinceSet.add(supplier.province);
    if (supplier.overallReadiness === "High") highReadiness += 1;
    if (isAuditedOrVisited(supplier.auditStatus)) auditedOrVisited += 1;
  }

  return {
    totalSuppliers: suppliers.length,
    productCategories: categorySet.size,
    provincesCovered: provinceSet.size,
    highReadiness,
    auditedOrVisited,
  };
}

export function countByRegion(
  suppliers: readonly CareSupplier[],
): CountBucket[] {
  const counts = new Map<string, number>();
  for (const supplier of suppliers) {
    counts.set(supplier.region, (counts.get(supplier.region) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function countByCategory(
  suppliers: readonly CareSupplier[],
): CountBucket[] {
  const counts = new Map<ProductCategory, number>();
  for (const supplier of suppliers) {
    for (const category of supplier.productCategories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return PRODUCT_CATEGORIES.map((category) => ({
    label: category,
    count: counts.get(category) ?? 0,
  }))
    .filter((bucket) => bucket.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function countByReadiness(
  suppliers: readonly CareSupplier[],
): CountBucket[] {
  const counts = new Map<ReadinessLevel, number>();
  for (const supplier of suppliers) {
    counts.set(
      supplier.overallReadiness,
      (counts.get(supplier.overallReadiness) ?? 0) + 1,
    );
  }
  return READINESS_LEVELS.map((level) => ({
    label: level,
    count: counts.get(level) ?? 0,
  }));
}

// Sorted province list (with counts) used to populate filter dropdowns and
// the supplier-density insight.
export function countByProvince(
  suppliers: readonly CareSupplier[],
): CountBucket[] {
  const counts = new Map<string, number>();
  for (const supplier of suppliers) {
    counts.set(supplier.province, (counts.get(supplier.province) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
