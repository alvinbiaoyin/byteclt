// lib/regulatory-mapping.ts
// Static, deterministic PD-L1 IHC assay → regulatory class mapping.
// String-pattern matching only; no inference, no LLM, no compliance judgement.
//
// Sources: published NMPA companion-diagnostic registry for PD-L1 IHC kits
// and widely-cited research-use-only antibody clones.

export const REGULATORY_CLASSES = [
  "NMPA-approved",
  "LDT",
  "RUO",
  "Unclassified",
] as const;
export type RegulatoryClass = (typeof REGULATORY_CLASSES)[number];

// NMPA-approved PD-L1 IHC companion-diagnostic clones.
const NMPA_APPROVED_CLONES = ["22C3", "28-8", "SP142", "SP263"];

// Common research-use-only antibody clones found in PD-L1 literature.
const RUO_CLONES = ["E1L3N", "73-10", "ZR3", "QR1"];

// Explicit token markers (case-insensitive substring match on assay name).
const NMPA_KEYWORDS = ["PHARMDX", "NMPA", "CFDA"];
const LDT_KEYWORDS = ["LDT", "LAB-DEVELOPED", "LAB DEVELOPED", "IN-HOUSE"];
const RUO_KEYWORDS = ["RUO", "RESEARCH USE", "RESEARCH-USE"];

export function classifyAssay(assay: string): RegulatoryClass {
  if (!assay) return "Unclassified";
  const upper = assay.toUpperCase();

  if (RUO_KEYWORDS.some((k) => upper.includes(k))) return "RUO";
  if (RUO_CLONES.some((c) => upper.includes(c.toUpperCase()))) return "RUO";

  if (LDT_KEYWORDS.some((k) => upper.includes(k))) return "LDT";

  if (NMPA_KEYWORDS.some((k) => upper.includes(k))) return "NMPA-approved";
  if (NMPA_APPROVED_CLONES.some((c) => upper.includes(c))) return "NMPA-approved";

  return "Unclassified";
}
