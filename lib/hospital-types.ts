// lib/hospital-types.ts

export type Hospital = {
  id: string | number;
  name: string;
  province: string;
  city: string;
  street: string;
  labType: string;
  biomarkers: string[];
  assays: string[];
  platform: string;
  coordinates: [number, number]; // [经度, 纬度]
  utilization: number;
  tatDays: number;
  // Market-access plumbing (sourced from Supabase reimbursement_status /
  // reimbursement_cny). Null when missing or unrecognized.
  reimbursementStatus: "YES" | "NO" | null;
  reimbursementCny: number | null;
};

export type FilterState = {
  province: string;
  biomarker: string;
  assay: string;
  platform: string;
};