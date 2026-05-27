// lib/compute-market-notes.ts
// Stage 1 — Geographic Intelligence note generator.
// Deterministic, executive-style biotech commentary driven by
// `GeographicIntelligence` from compute-analytics. No LLMs, no fetches.
// Numbers / aggregations come from the compute layer; this file only
// shapes presentation strings.

import type { Hospital } from "@/lib/hospital-types";
import type {
  GeographicIntelligence,
  PlatformIntelligence,
  RegulatoryIntelligence,
  ScoringIntelligence,
  InstitutionIntelligence,
  ReimbursementIntelligence,
} from "@/lib/compute-analytics";
import { joinList, toEnglishProvince } from "@/lib/province-labels";

export type MarketNote = {
  // Tag is retained for React keys / future stage routing. Not rendered.
  tag: string;
  text: string;
};

const pct = (n: number): number => Math.round(n);

// Render Geographic Intelligence as a compact 0–2 bullet executive headline.
// Strategy: surface the strongest concentration signal as a single combined
// regional + top-province sentence, then optionally surface the strongest
// imbalance signal (uneven inland coverage). All other regional summaries,
// secondary tiers, top-3 concentration callouts, and coverage averages are
// intentionally suppressed to keep the brief signal-dense.
export function computeGeographicNotes(
  geographic: GeographicIntelligence
): MarketNote[] {
  const { regional, provinceConcentration, coverage } = geographic;

  if (coverage.totalHospitals === 0) {
    return [
      {
        tag: "empty",
        text: "No testing institutions reported under the current selection.",
      },
    ];
  }

  const notes: MarketNote[] = [];
  const lead = regional.find((r) => r.hospitalCount > 0) ?? null;
  const topProvincesEn = provinceConcentration.top
    .slice(0, 3)
    .map((p) => toEnglishProvince(p.province));

  // 1. Primary highlight — strongest regional concentration in one line.
  if (coverage.totalProvinces === 1 && topProvincesEn[0]) {
    // Single-province selection — region wrap-up is redundant with the filter.
    notes.push({
      tag: "geo-lead",
      text: `${topProvincesEn[0]} anchors the entirety of reported testing activity in the current selection.`,
    });
  } else if (lead && topProvincesEn.length >= 2) {
    notes.push({
      tag: "geo-lead",
      text: `${lead.region} remains the primary testing cluster, accounting for ${pct(lead.sharePercent)}% of participating institutions, while ${joinList(topProvincesEn)} continue to anchor national testing capacity.`,
    });
  } else if (lead) {
    notes.push({
      tag: "geo-lead",
      text: `${lead.region} remains the primary testing cluster, accounting for ${pct(lead.sharePercent)}% of participating institutions.`,
    });
  }

  // 2. Imbalance signal — uneven inland coverage. Only when meaningful.
  if (
    provinceConcentration.underrepresented.length >= 3 &&
    coverage.totalProvinces >= 8
  ) {
    notes.push({
      tag: "geo-imbalance",
      text: `Testing coverage remains uneven across inland provinces, several of which report only a single participating institution.`,
    });
  }

  return notes;
}

// =========================================================================
// Stage 2 — Platform Intelligence note generator.
// =========================================================================
//
// Philosophy: emit only when there's a real executive-level signal.
// Most segment views should produce 0–2 bullets. Anything beyond that is
// noise. The analytics layer keeps full data; this generator selects.
//
// Emission thresholds:
//   1. Dominant platform        — leader ≥ 50% share, OR
//                                 leader ≥ 25pp ahead of #2
//   2. Fragmentation            — ≥ 4 platforms, leader < 25%, top-3 < 60%
//   3. Regional differentiation — ≥ 2 distinct lead platforms across ≥ 3 regions
//
// Deliberately suppressed (treated as noise / filler):
//   - "X distinct platforms in active use" ecosystem scale notes
//   - "Top 3 systems cover N%" generic coverage notes
//   - Single-institution long-tail platform listings
//   - "Co-lead" framing when no platform clears the dominance bar
//   - Standardization commentary when one platform leads everywhere

export function computePlatformNotes(
  platform: PlatformIntelligence
): MarketNote[] {
  const { distribution, dominant, topConcentration, regional } = platform;
  if (distribution.length === 0) return [];

  const notes: MarketNote[] = [];
  const lead = dominant.platform;
  const leadShare = dominant.sharePercent;
  const second = distribution[1];

  // 1. Dominance — only when a single platform clearly leads the market.
  if (lead) {
    if (leadShare >= 50) {
      notes.push({
        tag: "platform-lead",
        text: `${lead} remains the dominant testing platform, used by ${pct(leadShare)}% of participating institutions.`,
      });
    } else if (second && leadShare - second.sharePercent >= 25) {
      notes.push({
        tag: "platform-lead",
        text: `${lead} leads platform adoption at ${pct(leadShare)}%, well ahead of the rest of the field.`,
      });
    }
  }

  // 2. Fragmentation — only when no platform dominates AND the top
  // three together still fail to cross the majority line.
  const fragmented =
    distribution.length >= 4 &&
    leadShare < 25 &&
    topConcentration.top3Share < 60;
  if (fragmented) {
    notes.push({
      tag: "platform-fragmentation",
      text: `Platform adoption remains fragmented across the network, with no single system commanding clear leadership.`,
    });
  }

  // 3. Regional differentiation — only when distinct platforms lead
  // distinct regions (a real geographic split, not standardization).
  const leads = regional.leadByRegion;
  if (regional.distinctLeadPlatforms >= 2 && leads.length >= 3) {
    const byPlatform = new Map<string, string[]>();
    for (const l of leads) {
      if (!byPlatform.has(l.platform)) byPlatform.set(l.platform, []);
      byPlatform.get(l.platform)!.push(l.region);
    }
    const top2 = Array.from(byPlatform.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 2);
    if (top2.length === 2) {
      const [a, b] = top2;
      notes.push({
        tag: "platform-regional",
        text: `${a[0]} leads testing in ${joinList(a[1])}, while ${b[0]} holds primacy across ${joinList(b[1])}.`,
      });
    }
  }

  return notes;
}

// =========================================================================
// Stage 3 — Regulatory Intelligence note generator.
// =========================================================================
//
// Philosophy: observational market commentary only. NEVER make legal or
// compliance conclusions, NEVER describe institutions as compliant /
// non-compliant. Only describe the regulatory mix of the testing landscape.
//
// Emission gates (executive brevity — typically 1–3 bullets, often 1):
//   - Suppress entirely when the segment has < 40% classified assays or
//     fewer than 5 classified entries (Sparse landscape).
//   - Headline bullet: emit one dominance / mix statement only.
//   - LDT institution concentration: only when LDT share ≥ 15% AND a single
//     labType represents ≥ 70% of LDT-using institutions.
//   - RUO bullet: emit only when RUO share is meaningfully limited (< 5%)
//     or meaningfully present (≥ 10%); otherwise stay silent.
//
// Terminology: NMPA-approved assays / kits / antibodies / testing workflows.
// Never use "IVD workflows" or "IVD testing" in this China-focused dashboard.

export function computeRegulatoryNotes(
  reg: RegulatoryIntelligence
): MarketNote[] {
  const { shares, landscape, dominant, totals, ldtConcentration } = reg;

  // Sparse coverage guard — no statistically meaningful signal.
  if (
    landscape === "Sparse" ||
    totals.classifiedCount === 0 ||
    totals.classifiedCount / Math.max(totals.totalEntries, 1) < 0.4
  ) {
    return [];
  }

  const notes: MarketNote[] = [];

  // 1. Dominant regulatory model — single executive headline.
  if (landscape === "NMPA-dominant") {
    notes.push({
      tag: "reg-dominant",
      text: `NMPA-approved assays account for the majority of reported testing workflows.`,
    });
  } else if (landscape === "LDT-dominant") {
    notes.push({
      tag: "reg-dominant",
      text: `LDT workflows lead the current testing landscape, driving the bulk of reported activity.`,
    });
  } else if (
    landscape === "Mixed" &&
    dominant.class &&
    dominant.sharePercent >= 35
  ) {
    if (dominant.class === "NMPA-approved") {
      notes.push({
        tag: "reg-dominant",
        text: `NMPA-approved assays anchor the current testing landscape, with LDT workflows playing a complementary role.`,
      });
    } else if (dominant.class === "LDT") {
      notes.push({
        tag: "reg-dominant",
        text: `LDT workflows hold a leading share of reported testing activity, alongside a measurable base of NMPA-approved assays.`,
      });
    }
  }

  // 2. LDT institution-type concentration — only when meaningful.
  if (
    shares.ldt >= 15 &&
    ldtConcentration &&
    ldtConcentration.dominantLabType &&
    ldtConcentration.sharePercent >= 70
  ) {
    const labType = ldtConcentration.dominantLabType.toUpperCase();
    if (labType === "HOSPITAL") {
      notes.push({
        tag: "reg-ldt-concentration",
        text: `LDT workflows remain concentrated in large academic pathology centers.`,
      });
    } else if (labType === "COMMERCIAL") {
      notes.push({
        tag: "reg-ldt-concentration",
        text: `LDT activity skews toward commercial reference laboratories.`,
      });
    }
  }

  // 3. RUO antibody usage — only when there's a meaningful signal.
  if (shares.ruo > 0 && shares.ruo < 5) {
    notes.push({
      tag: "reg-ruo",
      text: `RUO antibody usage remains limited across the current network.`,
    });
  } else if (shares.ruo >= 10) {
    notes.push({
      tag: "reg-ruo",
      text: `RUO antibody usage shows measurable presence across the network, signaling a research-driven testing segment.`,
    });
  }

  return notes;
}

// =========================================================================
// Stage 4 — Scoring Intelligence note generator.
// =========================================================================
//
// Philosophy: observational scoring-methodology commentary only. NEVER make
// clinical recommendations, claim scoring superiority, or comment on
// scoring accuracy / compliance. Stay strictly at the market-structure
// level (adoption / standardization / fragmentation).
//
// Emission gates (executive brevity — typically 0–1 bullet):
//   - Suppress entirely when classified < 5 or coverage < 40% of entries.
//   - At most ONE headline bullet emitted: dominance, duopoly,
//     concentration, or heterogeneity — whichever the data supports.
//
// Terminology: scoring methodology / scoring workflow /
// scoring standardization / scoring adoption / scoring systems.

export function computeScoringNotes(
  scoring: ScoringIntelligence
): MarketNote[] {
  const { shares, totals, distribution, distinctMethods, landscape } = scoring;

  // Sparse coverage guard — no statistically meaningful signal.
  if (
    landscape === "Sparse" ||
    totals.classifiedCount < 5 ||
    totals.classifiedCount / Math.max(totals.totalEntries, 1) < 0.4
  ) {
    return [];
  }

  const topShare = distribution[0]?.sharePercent ?? 0;
  const top2Share =
    (distribution[0]?.sharePercent ?? 0) +
    (distribution[1]?.sharePercent ?? 0);
  const tpsCps = shares.tps + shares.cps;

  // Single headline bullet, selected in priority order:

  // 1. Single dominant methodology.
  if (shares.tps >= 60) {
    return [
      {
        tag: "scoring-lead",
        text: "TPS remains the dominant scoring methodology across participating institutions.",
      },
    ];
  }
  if (shares.cps >= 60) {
    return [
      {
        tag: "scoring-lead",
        text: "CPS remains the dominant scoring methodology across participating institutions.",
      },
    ];
  }
  if (shares.ic >= 50) {
    return [
      {
        tag: "scoring-lead",
        text: "IC scoring leads testing methodology adoption across the current network.",
      },
    ];
  }

  // 2. TPS / CPS duopoly — meaningful when both individually material.
  if (tpsCps >= 75 && shares.tps >= 20 && shares.cps >= 20) {
    return [
      {
        tag: "scoring-duopoly",
        text: "TPS and CPS together account for the majority of reported scoring workflows.",
      },
    ];
  }

  // 3. Concentration around a limited number of systems —
  //    only when no clear single leader but the field is narrow.
  if (distinctMethods >= 3 && top2Share >= 80) {
    return [
      {
        tag: "scoring-concentration",
        text: "A limited number of scoring systems account for the majority of reported testing workflows.",
      },
    ];
  }

  // 4. True heterogeneity — many methods, no leader.
  if (distinctMethods >= 4 && topShare < 40) {
    return [
      {
        tag: "scoring-heterogeneity",
        text: "Scoring practices remain heterogeneous across participating institutions.",
      },
    ];
  }

  // No meaningful signal — stay silent.
  return [];
}

// =========================================================================
// Stage 5 — Institution Intelligence note generator.
// =========================================================================
//
// Philosophy: observational institutional-structure commentary only.
// NEVER make quality / capability judgements, NEVER state that one
// setting is "better" than another. Stay strictly at the market-structure
// level (distribution / concentration / dominance).
//
// Emission gates (executive brevity — typically 1–2 bullets):
//   - Suppress entirely when Sparse landscape (classified < 5).
//   - Headline bullet: ONE dominance / mix statement.
//   - Commercial concentration bullet: only when ≥ 3 commercial labs AND
//     tier-1-metro concentration ≥ 70%, OR commercial province coverage
//     ≤ 25% of segment provinces.
//
// Terminology: teaching hospital pathology laboratories /
// academic medical centers / commercial reference laboratories /
// testing infrastructure / testing network / institutional concentration.

export function computeInstitutionNotes(
  inst: InstitutionIntelligence
): MarketNote[] {
  const { distribution, totals, landscape, commercialFootprint } = inst;

  // Sparse guard — too few institutions for a meaningful signal.
  if (landscape === "Sparse" || totals.classifiedCount < 5) {
    return [];
  }

  const notes: MarketNote[] = [];
  const hospitalShare = distribution.teachingHospital.sharePercent;
  const commercialShare = distribution.commercial.sharePercent;

  // 1. Headline — dominance or mix.
  if (landscape === "Hospital-dominant" && hospitalShare >= 80) {
    notes.push({
      tag: "inst-lead",
      text: `Teaching hospital pathology laboratories remain the dominant testing setting across participating institutions.`,
    });
  } else if (landscape === "Hospital-dominant") {
    notes.push({
      tag: "inst-lead",
      text: `Teaching hospital pathology laboratories anchor the current testing landscape, with commercial reference laboratories playing a complementary role.`,
    });
  } else if (landscape === "Commercial-dominant") {
    notes.push({
      tag: "inst-lead",
      text: `Commercial reference laboratories drive the bulk of reported testing activity across the network.`,
    });
  } else if (
    landscape === "Mixed" &&
    hospitalShare >= 30 &&
    commercialShare >= 30
  ) {
    notes.push({
      tag: "inst-lead",
      text: `Testing infrastructure is split between teaching hospital pathology laboratories and commercial reference laboratories.`,
    });
  }

  // 2. Commercial concentration — metro skew or province confinement.
  if (commercialFootprint.isMetroConcentrated) {
    notes.push({
      tag: "inst-commercial-metro",
      text: `Commercial laboratory participation remains concentrated in major metropolitan regions.`,
    });
  } else if (
    commercialFootprint.totalCommercial >= 3 &&
    commercialFootprint.commercialProvinceShare > 0 &&
    commercialFootprint.commercialProvinceShare <= 25
  ) {
    notes.push({
      tag: "inst-commercial-provinces",
      text: `Commercial laboratory activity is confined to a small number of provinces.`,
    });
  }

  return notes;
}

// =========================================================================
// Stage 6 — Reimbursement Intelligence note generator.
// =========================================================================
//
// Philosophy: observational market-access commentary only. NEVER make
// policy recommendations, NEVER imply favorable / unfavorable healthcare
// quality, NEVER suggest patient outcomes. Stay strictly at the
// market-structure level (coverage breadth / pricing variability /
// provincial fragmentation / metro-vs-non-metro coverage breadth).
//
// Emission gates (executive brevity — typically 1–3 bullets):
//   - Suppress entirely when Sparse landscape (totalCount < 5).
//   - Headline bullet: ONE coverage statement (Broad / Established / Limited).
//   - Pricing variability bullet: only when variabilityLabel === "High".
//   - Tier-1 vs non-tier-1 bullet: only when tier-1 ≥ 90% AND gap ≥ 30pp,
//     and both cohorts have ≥ 3 institutions.
//   - Provincial gap bullet: only when ≥ 3 fully-uncovered provinces in a
//     segment with ≥ 8 provinces — and only if tier-1 bullet did not fire
//     (the two signals overlap).

export function computeReimbursementNotes(
  reim: ReimbursementIntelligence
): MarketNote[] {
  const { coverage, pricing, provincialCoverage, tier1Comparison } = reim;

  // Sparse guard.
  if (coverage.landscape === "Sparse" || coverage.totalCount < 5) {
    return [];
  }

  const notes: MarketNote[] = [];

  // 1. Coverage headline.
  if (coverage.landscape === "Broad") {
    notes.push({
      tag: "reim-headline",
      text: `Reimbursement coverage is broadly established across the testing network.`,
    });
  } else if (coverage.landscape === "Established") {
    notes.push({
      tag: "reim-headline",
      text: `Reimbursement coverage is broadly established, though notable gaps persist across the testing network.`,
    });
  } else if (coverage.landscape === "Limited") {
    notes.push({
      tag: "reim-headline",
      text: `Reimbursement support remains limited across the testing network, leaving significant coverage gaps.`,
    });
  }

  // 2. Provincial pricing variability — only when truly fragmented.
  if (pricing.variabilityLabel === "High") {
    notes.push({
      tag: "reim-pricing",
      text: `Provincial pricing variability suggests fragmented provincial reimbursement structures.`,
    });
  }

  // 3. Tier-1 coverage advantage OR provincial gap — mutually exclusive.
  const tier1Strong =
    tier1Comparison.tier1Total >= 3 &&
    tier1Comparison.nonTier1Total >= 3 &&
    tier1Comparison.tier1CoverageRate >= 90 &&
    tier1Comparison.coverageGapPP >= 30;
  const provincialGapStrong =
    provincialCoverage.uncoveredCount >= 3 &&
    provincialCoverage.segmentProvinces >= 8;

  if (tier1Strong) {
    notes.push({
      tag: "reim-tier1",
      text: `Tier-1 metros maintain near-universal reimbursement coverage, while support across non-tier-1 regions remains uneven.`,
    });
  } else if (provincialGapStrong) {
    notes.push({
      tag: "reim-provincial-gap",
      text: `Reimbursement support remains absent across several provinces, signaling fragmented provincial market access.`,
    });
  }

  return notes;
}

// --- Legacy export kept for backward compatibility -----------------------
// Older callers may still import `computeMarketNotes`. Proxies to the
// geographic commentary when an analytics snapshot is provided.

type AnalyticsLike = {
  geographicIntelligence?: GeographicIntelligence;
  [key: string]: unknown;
};

export function computeMarketNotes(
  filteredHospitals: Hospital[] | undefined,
  analytics?: AnalyticsLike
): MarketNote[] {
  const filtered = Array.isArray(filteredHospitals) ? filteredHospitals : [];
  if (analytics?.geographicIntelligence) {
    return computeGeographicNotes(analytics.geographicIntelligence);
  }
  if (filtered.length === 0) {
    return [
      {
        tag: "empty",
        text: "No testing institutions reported under the current selection.",
      },
    ];
  }
  return [];
}
