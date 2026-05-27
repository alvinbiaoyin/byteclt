// Deterministic curation for the homepage "Featured Testing Institutions"
// section. No LLM. Pattern matching against hospital.name (case-insensitive,
// substring). Tokens are ordered by intelligence signal weight so the first
// matched institution is the highest-priority one available in the dataset.
//
// Falls back to utilization-ranked top-up when fewer than `minimum` institutions
// match the curation patterns, ensuring the section always feels populated.

import type { Hospital } from "./hospital-types";

type CurationToken = {
  token: string;
  category: "national-cancer" | "academic" | "commercial";
};

// Ordered by intelligence weight. National cancer centers first, then leading
// academic medical centers, then major commercial precision oncology labs.
// Mix of English and Chinese tokens so both naming conventions are caught.
const FEATURED_TOKENS: CurationToken[] = [
  // ── National cancer centers ──
  { token: "National Cancer Center", category: "national-cancer" },
  { token: "CAMS Cancer", category: "national-cancer" },
  { token: "Chinese Academy of Medical Sciences", category: "national-cancer" },
  { token: "Beijing Cancer", category: "national-cancer" },
  { token: "Fudan University Shanghai Cancer", category: "national-cancer" },
  { token: "Sun Yat-sen University Cancer", category: "national-cancer" },
  { token: "Tianjin Medical University Cancer", category: "national-cancer" },
  { token: "Cancer Hospital", category: "national-cancer" },
  { token: "肿瘤医院", category: "national-cancer" },

  // ── Leading academic medical centers ──
  { token: "PLA General", category: "academic" },
  { token: "解放军总医院", category: "academic" },
  { token: "Peking Union", category: "academic" },
  { token: "协和", category: "academic" },
  { token: "Peking University", category: "academic" },
  { token: "Ruijin", category: "academic" },
  { token: "瑞金", category: "academic" },
  { token: "Huashan", category: "academic" },
  { token: "华山", category: "academic" },
  { token: "Zhongshan Hospital", category: "academic" },
  { token: "中山医院", category: "academic" },
  { token: "West China Hospital", category: "academic" },
  { token: "华西", category: "academic" },
  { token: "Union Hospital", category: "academic" },

  // ── Major commercial precision oncology labs ──
  { token: "Genetron", category: "commercial" },
  { token: "Novogene", category: "commercial" },
  { token: "Geneplus", category: "commercial" },
  { token: "Burning Rock", category: "commercial" },
  { token: "Amoy", category: "commercial" },
  { token: "Origimed", category: "commercial" },
  { token: "KingMed", category: "commercial" },
  { token: "金域", category: "commercial" },
];

const DEFAULT_TARGET = 9;
const DEFAULT_MINIMUM = 6;

export function selectFeaturedInstitutions(
  hospitals: Hospital[],
  target: number = DEFAULT_TARGET,
  minimum: number = DEFAULT_MINIMUM
): Hospital[] {
  const safe = Array.isArray(hospitals)
    ? hospitals.filter((h): h is Hospital => Boolean(h && h.name))
    : [];
  if (safe.length === 0) return [];

  const selected: Hospital[] = [];
  const selectedIds = new Set<Hospital["id"]>();

  for (const { token } of FEATURED_TOKENS) {
    if (selected.length >= target) break;
    const tokenLower = token.toLowerCase();
    const match = safe.find(
      (h) =>
        !selectedIds.has(h.id) && h.name.toLowerCase().includes(tokenLower)
    );
    if (match) {
      selected.push(match);
      selectedIds.add(match.id);
    }
  }

  // Top up with highest-utilization institutions until `minimum` is reached.
  // Deterministic ordering: utilization desc, then name asc to break ties.
  if (selected.length < minimum) {
    const remainder = safe
      .filter((h) => !selectedIds.has(h.id))
      .sort((a, b) => {
        const ua = a.utilization ?? 0;
        const ub = b.utilization ?? 0;
        if (ub !== ua) return ub - ua;
        return a.name.localeCompare(b.name);
      });
    for (const h of remainder) {
      if (selected.length >= minimum) break;
      selected.push(h);
      selectedIds.add(h.id);
    }
  }

  return selected;
}
