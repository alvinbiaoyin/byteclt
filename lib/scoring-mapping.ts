// lib/scoring-mapping.ts
// Static, deterministic mapping from PD-L1 IHC assay → primary reported
// scoring methodology. Pattern matching only — no inference, no clinical
// recommendation. Reflects the most widely *reported* scoring approach
// associated with each clone in routine pathology practice.

export const SCORING_METHODS = ["TPS", "CPS", "IC", "TC"] as const;
export type ScoringMethod = (typeof SCORING_METHODS)[number];

// Primary scoring methodology associated with each clone, based on the
// indications for which each clone is most commonly reported in practice.
const CLONE_PRIMARY_SCORE: Array<{ clone: string; method: ScoringMethod }> = [
  { clone: "22C3", method: "TPS" }, // NSCLC TPS is the most common 22C3 readout
  { clone: "28-8", method: "TPS" }, // NSCLC / melanoma TPS
  { clone: "SP263", method: "TPS" }, // NSCLC TPS
  { clone: "SP142", method: "IC" }, // TNBC IC scoring is the SP142 hallmark
];

// Returns the primary scoring method an assay is associated with, or
// null when no deterministic match is possible.
export function deriveScoringMethod(assay: string): ScoringMethod | null {
  if (!assay) return null;
  const upper = assay.toUpperCase();

  // 1. Explicit scoring tokens in the assay name take priority.
  // Tokenize on non-alphanumeric so "IC" doesn't match inside "PRACTICE".
  const tokens = upper.split(/[^A-Z0-9]+/).filter(Boolean);
  if (tokens.includes("CPS")) return "CPS";
  if (tokens.includes("TPS")) return "TPS";
  if (tokens.includes("IC")) return "IC";
  if (tokens.includes("TC")) return "TC";

  // 2. Clone-based derivation.
  for (const { clone, method } of CLONE_PRIMARY_SCORE) {
    if (upper.includes(clone.toUpperCase())) return method;
  }

  return null;
}
