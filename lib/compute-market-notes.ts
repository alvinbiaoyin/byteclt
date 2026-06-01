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

export type MarketNoteCategory =
  | "geography"
  | "institution"
  | "platform"
  | "regulatory"
  | "reimbursement"
  | "scoring"
  | "general";

export type MarketNoteSeverity = "info" | "watch" | "important";

export type MarketNoteConfidence = "high" | "medium" | "low";

export type MarketNoteBasis =
  | "institution-level"
  | "assay-entry-level"
  | "province-level"
  | "mixed"
  | "insufficient-data";

export type MarketNote = {
  // Tag is retained for React keys / future stage routing.
  tag: string;

  // Human-readable insight sentence.
  text: string;

  // Structured metadata for client-ready dashboard display.
  // Optional during v2.1 migration so existing note generators do not break.
  category?: MarketNoteCategory;
  severity?: MarketNoteSeverity;
  confidence?: MarketNoteConfidence;
  basis?: MarketNoteBasis;

  // Compact supporting metric shown under the insight.
  // Example: "18 / 31 classified assay entries" or "25.8% reimbursed".
  metric?: string;
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

  const classifiedCoverage = Math.round(
    (totals.classifiedCount / Math.max(totals.totalEntries, 1)) * 100
  );

  const nmpaShare = Math.round(shares.nmpa);
  const ldtShare = Math.round(shares.ldt);
  const ruoShare = Math.round(shares.ruo);

  const mixMetric = `NMPA ${nmpaShare}%, LDT ${ldtShare}%, RUO ${ruoShare}%, ${totals.classifiedCount} classified assay entries, ${classifiedCoverage}% classification coverage`;

  const confidence =
    totals.classifiedCount >= 20 && classifiedCoverage >= 70
      ? "high"
      : totals.classifiedCount >= 8 && classifiedCoverage >= 50
      ? "medium"
      : "low";

  // -------------------------------------------------------------------------
  // 1. Dominant regulatory model — single executive headline.
  // -------------------------------------------------------------------------
  if (landscape === "NMPA-dominant") {
    notes.push({
      tag: "reg-dominant-nmpa",
      category: "regulatory",
      severity: "info",
      confidence,
      basis: "assay-entry-level",
      metric: mixMetric,
      text: `NMPA-approved assays account for the majority of classified reported testing workflows in the selected segment.`,
    });
  } else if (landscape === "LDT-dominant") {
    notes.push({
      tag: "reg-dominant-ldt",
      category: "regulatory",
      severity: "info",
      confidence,
      basis: "assay-entry-level",
      metric: mixMetric,
      text: `LDT workflows account for the majority of classified reported testing workflows in the selected segment.`,
    });
  } else if (
    landscape === "Mixed" &&
    dominant.class &&
    dominant.sharePercent >= 35
  ) {
    if (dominant.class === "NMPA-approved") {
      notes.push({
        tag: "reg-mixed-nmpa-anchor",
        category: "regulatory",
        severity: "info",
        confidence,
        basis: "assay-entry-level",
        metric: mixMetric,
        text: `NMPA-approved assays anchor the current testing landscape, with LDT workflows remaining present in the classified assay mix.`,
      });
    } else if (dominant.class === "LDT") {
      notes.push({
        tag: "reg-mixed-ldt-anchor",
        category: "regulatory",
        severity: "info",
        confidence,
        basis: "assay-entry-level",
        metric: mixMetric,
        text: `LDT workflows hold a leading share of classified reported testing activity, alongside a measurable base of NMPA-approved assays.`,
      });
    } else if (dominant.class === "RUO") {
      notes.push({
        tag: "reg-mixed-ruo-anchor",
        category: "regulatory",
        severity: "info",
        confidence,
        basis: "assay-entry-level",
        metric: mixMetric,
        text: `RUO-classified assay usage represents the leading share of the classified assay mix in the selected segment.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // 2. LDT institution-type concentration.
  // -------------------------------------------------------------------------
  // This is mixed basis: LDT share comes from assay entries, while concentration
  // comes from institutions that report at least one LDT-classified assay.
  if (
    shares.ldt >= 15 &&
    ldtConcentration &&
    ldtConcentration.dominantLabType &&
    ldtConcentration.sharePercent >= 70
  ) {
    const rawLabType = ldtConcentration.dominantLabType.toUpperCase();
    const labTypeLabel =
      rawLabType === "HOSPITAL"
        ? "hospital pathology centers"
        : rawLabType === "COMMERCIAL"
        ? "commercial reference laboratories"
        : ldtConcentration.dominantLabType;

    notes.push({
      tag: "reg-ldt-concentration",
      category: "regulatory",
      severity: "info",
      confidence,
      basis: "mixed",
      metric: `LDT ${ldtShare}% of classified assay entries; ${Math.round(ldtConcentration.sharePercent)}% of LDT-reporting institutions are ${labTypeLabel}`,
      text:
        rawLabType === "HOSPITAL"
          ? `LDT workflows remain concentrated in hospital pathology centers within the selected segment.`
          : rawLabType === "COMMERCIAL"
          ? `LDT activity skews toward commercial reference laboratories within the selected segment.`
          : `LDT activity is concentrated within a specific institution type in the selected segment.`,
    });
  }

  // -------------------------------------------------------------------------
  // 3. RUO antibody / workflow usage.
  // -------------------------------------------------------------------------
  if (shares.ruo > 0 && shares.ruo < 5) {
    notes.push({
      tag: "reg-ruo-limited",
      category: "regulatory",
      severity: "info",
      confidence,
      basis: "assay-entry-level",
      metric: `RUO ${ruoShare}% of classified assay entries`,
      text: `RUO-classified assay usage remains limited across the current network view.`,
    });
  } else if (shares.ruo >= 10) {
    notes.push({
      tag: "reg-ruo-measurable",
      category: "regulatory",
      severity: "info",
      confidence,
      basis: "assay-entry-level",
      metric: `RUO ${ruoShare}% of classified assay entries`,
      text: `RUO-classified assay usage shows measurable presence across the selected network view.`,
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
  const {
    shares,
    totals,
    landscape,
    coReporting,
  } = scoring;

  if (
    landscape === "Sparse" ||
    totals.classifiedCount < 5 ||
    totals.classifiedCount / Math.max(totals.totalEntries, 1) < 0.4
  ) {
    return [];
  }

  const notes: MarketNote[] = [];

  const tpsOnlyShare = Math.round(shares.tps);
  const cpsOnlyShare = Math.round(shares.cps);
  const icShare = Math.round(shares.ic);
  const tcShare = Math.round(shares.tc);

  const tpsCpsCount = coReporting?.tpsCpsCount ?? 0;
  const tpsCpsShare = Math.round(coReporting?.tpsCpsSharePercent ?? 0);

  const classifiedCoverage = Math.round(
    (totals.classifiedCount / Math.max(totals.totalEntries, 1)) * 100
  );

  const confidence =
    totals.classifiedCount >= 20 && classifiedCoverage >= 70
      ? "high"
      : totals.classifiedCount >= 8 && classifiedCoverage >= 50
      ? "medium"
      : "low";

  const mixMetric =
    `TPS-only ${tpsOnlyShare}%, ` +
    `TPS+CPS ${tpsCpsShare}%, ` +
    `CPS-only ${cpsOnlyShare}%, ` +
    `IC ${icShare}%, ` +
    `TC ${tcShare}%, ` +
    `${totals.classifiedCount} classified labs with scoring data, ` +
    `${classifiedCoverage}% classification coverage`;

  if (tpsCpsCount > 0) {
    notes.push({
      tag: "scoring-row-level-tps-cps",
      category: "scoring",
      severity: "info",
      confidence,
      basis: "institution-level",
      metric: mixMetric,
      text: "TPS-only remains the largest scoring reporting pattern, while TPS+CPS co-reporting is observed as a distinct lab-level reporting category in the selected segment.",
    });
    return notes;
  }

  notes.push({
    tag: "scoring-row-level-summary",
    category: "scoring",
    severity: "info",
    confidence,
    basis: "institution-level",
    metric: mixMetric,
    text: "Scoring methodology reporting is summarized by mutually exclusive lab-level reporting categories in the selected segment.",
  });

  return notes;
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
  reimbursement: ReimbursementIntelligence
): MarketNote[] {
  const { coverage, pricing, provincialCoverage, tier1Comparison } =
    reimbursement;

  const notes: MarketNote[] = [];

  // -------------------------------------------------------------------------
  // 1. Coverage headline
  // -------------------------------------------------------------------------
  // Institution-level because reimbursementStatus is counted per institution row.
  if (coverage.totalCount === 0 || coverage.landscape === "Sparse") {
    return [];
  }

  const reimbursedMetric = `${coverage.reimbursedCount} / ${coverage.totalCount} institutions reimbursed, ${Math.round(coverage.reimbursedShare)}%`;

  if (coverage.landscape === "Limited") {
    notes.push({
      tag: "reimbursement-coverage-limited",
      category: "reimbursement",
      severity: coverage.reimbursedShare < 30 ? "important" : "watch",
      confidence: coverage.totalCount >= 20 ? "high" : "medium",
      basis: "institution-level",
      metric: reimbursedMetric,
      text: `Reimbursement coverage remains limited in the selected segment, suggesting market access conditions may vary meaningfully across participating institutions.`,
    });
  } else if (coverage.landscape === "Established") {
    notes.push({
      tag: "reimbursement-coverage-established",
      category: "reimbursement",
      severity: "info",
      confidence: coverage.totalCount >= 20 ? "high" : "medium",
      basis: "institution-level",
      metric: reimbursedMetric,
      text: `Reimbursement coverage is established across the selected segment, although non-reimbursed institutions remain present in the network.`,
    });
  } else if (coverage.landscape === "Broad") {
    notes.push({
      tag: "reimbursement-coverage-broad",
      category: "reimbursement",
      severity: "info",
      confidence: coverage.totalCount >= 20 ? "high" : "medium",
      basis: "institution-level",
      metric: reimbursedMetric,
      text: `Reimbursement coverage is broadly reported across participating institutions in the selected segment.`,
    });
  }

  // -------------------------------------------------------------------------
  // 2. Province-level heterogeneity
  // -------------------------------------------------------------------------
  // Province-level because this summarizes provincial coverage buckets.
  const provinceCount = provincialCoverage.segmentProvinces;
  const fullyCovered = provincialCoverage.fullyCoveredCount;
  const uncovered = provincialCoverage.uncoveredCount;
  const partial = provincialCoverage.partiallyCoveredProvinces.length;

  if (provinceCount >= 3 && (uncovered > 0 || partial > 0)) {
    const heterogeneityMetric = `${fullyCovered} fully covered, ${partial} partially covered, ${uncovered} uncovered provinces`;

    notes.push({
      tag: "reimbursement-provincial-heterogeneity",
      category: "reimbursement",
      severity: uncovered >= 3 ? "watch" : "info",
      confidence: provinceCount >= 6 ? "high" : "medium",
      basis: "province-level",
      metric: heterogeneityMetric,
      text: `Provincial reimbursement coverage remains heterogeneous across the selected market view.`,
    });
  }

  // -------------------------------------------------------------------------
  // 3. Pricing variability
  // -------------------------------------------------------------------------
  // Mixed basis: prices are institution/province-linked reimbursement samples.
  if (
    pricing.samples >= 3 &&
    pricing.min !== null &&
    pricing.max !== null &&
    pricing.median !== null
  ) {
    const priceMetric =
      pricing.spreadRatio !== null
        ? `${pricing.samples} price samples, median ¥${pricing.median}, range ¥${pricing.min}–¥${pricing.max}, ${pricing.spreadRatio}x spread`
        : `${pricing.samples} price samples, median ¥${pricing.median}, range ¥${pricing.min}–¥${pricing.max}`;

    if (pricing.variabilityLabel === "High") {
      notes.push({
        tag: "reimbursement-pricing-high-variability",
        category: "reimbursement",
        severity: "watch",
        confidence: pricing.samples >= 8 ? "high" : "medium",
        basis: "mixed",
        metric: priceMetric,
        text: `Reported reimbursement pricing shows high variability, indicating materially different payment levels across reported samples.`,
      });
    } else if (pricing.variabilityLabel === "Moderate") {
      notes.push({
        tag: "reimbursement-pricing-moderate-variability",
        category: "reimbursement",
        severity: "info",
        confidence: pricing.samples >= 8 ? "high" : "medium",
        basis: "mixed",
        metric: priceMetric,
        text: `Reported reimbursement pricing shows moderate variability across available samples.`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // 4. Tier-1 vs non-tier-1 reimbursement gap
  // -------------------------------------------------------------------------
  // Institution-level because the comparison is counted by institution rows.
  const enoughTierComparison =
    tier1Comparison.tier1Total >= 3 && tier1Comparison.nonTier1Total >= 3;

  if (enoughTierComparison && Math.abs(tier1Comparison.coverageGapPP) >= 20) {
    const gapDirection =
      tier1Comparison.coverageGapPP > 0
        ? "higher"
        : "lower";

    const gapMetric = `Tier-1: ${tier1Comparison.tier1Covered} / ${tier1Comparison.tier1Total} covered (${Math.round(tier1Comparison.tier1CoverageRate)}%), non-tier-1: ${tier1Comparison.nonTier1Covered} / ${tier1Comparison.nonTier1Total} covered (${Math.round(tier1Comparison.nonTier1CoverageRate)}%), gap ${Math.round(Math.abs(tier1Comparison.coverageGapPP))} pp`;

    notes.push({
      tag: "reimbursement-tier1-gap",
      category: "reimbursement",
      severity: Math.abs(tier1Comparison.coverageGapPP) >= 35 ? "watch" : "info",
      confidence:
        tier1Comparison.tier1Total + tier1Comparison.nonTier1Total >= 20
          ? "high"
          : "medium",
      basis: "institution-level",
      metric: gapMetric,
      text: `Tier-1 city institutions show ${gapDirection} reimbursement coverage than non-tier-1 institutions in the selected segment.`,
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
