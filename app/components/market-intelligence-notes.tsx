"use client";

import { useMemo } from "react";
import { computeAnalytics } from "@/lib/compute-analytics";
import {
  computeGeographicNotes,
  computePlatformNotes,
  computeRegulatoryNotes,
  computeScoringNotes,
  computeInstitutionNotes,
  computeReimbursementNotes,
  type MarketNote,
  type MarketNoteBasis,
  type MarketNoteCategory,
  type MarketNoteConfidence,
  type MarketNoteSeverity,
} from "@/lib/compute-market-notes";
import type { Hospital } from "@/lib/hospital-types";

type MarketIntelligenceNotesProps = {
  hospitals: Hospital[];
  allHospitals?: Hospital[];
};

function inferCategory(tag: string): MarketNoteCategory {
  if (tag.startsWith("geo")) return "geography";
  if (tag.startsWith("institution")) return "institution";
  if (tag.startsWith("platform")) return "platform";
  if (tag.startsWith("reg")) return "regulatory";
  if (tag.startsWith("reimbursement")) return "reimbursement";
  if (tag.startsWith("scoring")) return "scoring";
  return "general";
}

function defaultBasis(category: MarketNoteCategory): MarketNoteBasis {
  if (category === "regulatory" || category === "scoring") return "assay-entry-level";
  if (category === "geography" || category === "reimbursement") return "province-level";
  if (category === "institution" || category === "platform") return "institution-level";
  return "mixed";
}

function defaultSeverity(category: MarketNoteCategory): MarketNoteSeverity {
  if (category === "reimbursement" || category === "regulatory") return "watch";
  return "info";
}

function normalizeNote(note: MarketNote): Required<Pick<
  MarketNote,
  "tag" | "text" | "category" | "severity" | "confidence" | "basis"
>> & Pick<MarketNote, "metric"> {
  const category = note.category ?? inferCategory(note.tag);
  return {
    tag: note.tag,
    text: note.text,
    category,
    severity: note.severity ?? defaultSeverity(category),
    confidence: note.confidence ?? "medium",
    basis: note.basis ?? defaultBasis(category),
    metric: note.metric,
  };
}

export default function MarketIntelligenceNotes({ hospitals, allHospitals }: MarketIntelligenceNotesProps) {
  const notes = useMemo(() => {
    const analytics = computeAnalytics(hospitals, allHospitals ?? hospitals);
    return [
      ...computeGeographicNotes(analytics.geographicIntelligence),
      ...computeInstitutionNotes(analytics.institutionIntelligence),
      ...computePlatformNotes(analytics.platformIntelligence),
      ...computeRegulatoryNotes(analytics.regulatoryIntelligence),
      ...computeReimbursementNotes(analytics.reimbursementIntelligence),
      ...computeScoringNotes(analytics.scoringIntelligence),
    ].map(normalizeNote);
  }, [hospitals, allHospitals]);

  return (
    <section className="rounded-xl border border-cyan-300/15 bg-slate-900/60 p-3 shadow-[0_0_16px_rgba(34,211,238,0.06)]">
      <div className="mb-3 flex items-center justify-between border-b border-cyan-300/10 pb-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">
            Market Intelligence Notes
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Analyst brief · rule-based live commentary
          </p>
        </div>
      </div>

      <ul key={hospitals.length} className="space-y-2">
        {notes.map((note, idx) => (
          <li
            key={`${note.tag}-${idx}`}
            className="market-note-enter rounded-lg border border-transparent px-2 py-2 transition hover:border-cyan-300/10 hover:bg-cyan-400/[0.03]"
          >
            <div className="mb-1 text-[9px]">
              <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-2 py-0.5 text-cyan-200/80">
                {note.category} | {note.basis} | {note.confidence} confidence
              </span>
            </div>

            <div className="flex gap-2.5">
              <span className="mt-1 shrink-0 text-cyan-400/90">▸</span>
              <div className="min-w-0">
                <p className="text-xs leading-5 text-slate-300">{note.text}</p>
                {note.metric && (
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">
                    Supporting metric: {note.metric}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
