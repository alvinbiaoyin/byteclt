// lib/filter-hospitals.ts

export type Hospital = {
  hospital?: string;
  country?: string;
  city?: string;
  biomarkers?: string[];
  methodology?: string;
  platform?: string;
  lat?: number;
  lng?: number;
  tat?: number;
  positiveRate?: number;
  reimbursement?: string;
  [key: string]: any;
};

export type FilterState = {
  country?: string[];
  city?: string[];
  biomarkers?: string[];
  methodology?: string[];
  platform?: string[];
};

function safeArray<T>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

export function uniqueValues(
  hospitals: Hospital[],
  key: keyof Hospital
): string[] {
  const set = new Set<string>();
  for (const hospital of safeArray(hospitals) as Record<string, any>[]) {
    const val = hospital[key];
    if (Array.isArray(val)) {
      val.forEach((v) => v && set.add(String(v)));
    } else if (val) {
      set.add(String(val));
    }
  }
  return Array.from(set).sort();
}

export function filterHospitalsForList(
  hospitals: Hospital[],
  filters: FilterState
): Hospital[] {
  const safeHospitals = safeArray(hospitals) as Hospital[];

  return safeHospitals.filter((hospital) => {
    if (filters.country?.length && (!hospital.country || !filters.country.includes(hospital.country))) return false;
    if (filters.city?.length && (!hospital.city || !filters.city.includes(hospital.city))) return false;
    if (filters.biomarkers?.length && (!hospital.biomarkers || !hospital.biomarkers.some((b) => filters.biomarkers!.includes(b)))) return false;
    if (filters.methodology?.length && (!hospital.methodology || !filters.methodology.includes(hospital.methodology))) return false;
    if (filters.platform?.length && (!hospital.platform || !filters.platform.includes(hospital.platform))) return false;
    return true;
  });
}

export function filterHospitalsForMap(
  hospitals: Hospital[],
  filters: FilterState
): { hospital?: string; lat?: number; lng?: number }[] {
  const filtered = filterHospitalsForList(hospitals, filters);
  return filtered.map((h) => ({
    hospital: h.hospital,
    lat: h.lat,
    lng: h.lng,
  }));
}

// ====================================================
// ✨ 核心修复：添加别名导出，完美适配前端组件的 import
// ====================================================
export const filterHospitals = filterHospitalsForList;