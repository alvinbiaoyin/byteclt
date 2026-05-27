// lib/tier1-cities.ts
// Static, deterministic set of China's tier-1 metropolitan cities.
// Used by Institution Intelligence to detect commercial-lab concentration
// in major metros. Mapping is observational; not a quality judgement.

export const TIER1_CITIES = new Set([
  "BEIJING",
  "SHANGHAI",
  "GUANGZHOU",
  "SHENZHEN",
]);

export function isTier1City(city: string | undefined | null): boolean {
  if (!city) return false;
  return TIER1_CITIES.has(city.trim().toUpperCase());
}
