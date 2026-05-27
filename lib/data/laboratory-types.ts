export type LaboratoryRow = {
  id: string;
  name: string;
  city: string;
  province: string;
  longitude: number;
  latitude: number;
  biomarkers: string[];
  assays: string[];
  platform: string;
  utilization: number;
  tier: string;
  tat_days: number;
};
