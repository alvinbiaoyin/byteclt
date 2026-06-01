// lib/hospital-types.ts

export type ReimbursementStatus = "YES" | "NO" | null;

export type RegulatoryStatus =
  | "NMPA-approved"
  | "LDT"
  | "RUO"
  | "Unclassified"
  | null;

export type ScoringMethod =
  | "TPS"
  | "CPS"
  | "IC"
  | "TC"
  | "Other"
  | null;

export type Hospital = {
  id: string | number;
  name: string;
  province: string;
  city: string;
  street: string;

  // Institution layer
  labType: string; // "HOSPITAL" / "COMMERCIAL" / unknown string

  // Biomarker / testing layer
  biomarkers: string[];
  assays: string[];
  platform: string;

  // Future bot-QA-supported fields.
  // Optional now so the current dashboard will not break.
  method?: string | null;
  indication?: string | null;
  clone?: string | null;
  manufacturer?: string | null;
  scoringMethod?: ScoringMethod;

  // Raw scoring methods from Supabase JSON array, e.g. ["TPS"], ["TPS", "CPS"], ["TC"].
  scoring?: string[];

  regulatoryStatus?: RegulatoryStatus;

  coordinates: [number, number]; // [经度, 纬度]

  // Operational metrics
  utilization: number;
  tatDays: number;

  // Market-access plumbing sourced from Supabase reimbursement_status /
  // reimbursement_cny. Null when missing or unrecognized.
  reimbursementStatus: ReimbursementStatus;
  reimbursementCny: number | null;
};

export type FilterState = {
  province: string;
  biomarker: string;
  assay: string;
  platform: string;

  // Future filters. Optional so existing components keep working.
  labType?: string;
  method?: string;
  indication?: string;
  reimbursementStatus?: "" | "YES" | "NO";
  regulatoryStatus?: "" | NonNullable<RegulatoryStatus>;
  scoringMethod?: "" | NonNullable<ScoringMethod>;
};
