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
} from "@/lib/compute-market-notes";
import type { Hospital } from "@/lib/hospital-types";

type MarketIntelligenceNotesProps = {
  hospitals: Hospital[];
};

export default function MarketIntelligenceNotes({
  hospitals,
}: MarketIntelligenceNotesProps) {
  // Pure render: compute layer does the analytics, component just maps to UI.
  const notes = useMemo(() => {
    const analytics = computeAnalytics(hospitals, hospitals);
    // Narrative order: network distribution → institutional structure →
    // technology ecosystem → regulatory maturity → market access →
    // clinical workflow standardization.
    return [
      ...computeGeographicNotes(analytics.geographicIntelligence),
      ...computeInstitutionNotes(analytics.institutionIntelligence),
      ...computePlatformNotes(analytics.platformIntelligence),
      ...computeRegulatoryNotes(analytics.regulatoryIntelligence),
      ...computeReimbursementNotes(analytics.reimbursementIntelligence),
      ...computeScoringNotes(analytics.scoringIntelligence),
    ];
  }, [hospitals]);

  return (
    <section className="rounded-xl border border-cyan-300/15 bg-slate-900/60 p-3 shadow-[0_0_16px_rgba(34,211,238,0.06)]">
      <div className="mb-3 flex items-center justify-between border-b border-cyan-300/10 pb-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300/70">
            Market Intelligence Notes
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Analyst brief · live commentary
          </p>
        </div>
      </div>

      <ul key={hospitals.length} className="space-y-2">
        {notes.map((note, idx) => (
          <li
            key={`${note.tag}-${idx}`}
            className="market-note-enter flex gap-2.5 rounded-lg border border-transparent px-1 py-1 transition hover:border-cyan-300/10 hover:bg-cyan-400/[0.03]"
          >
            <span className="mt-1 shrink-0 text-cyan-400/90">▸</span>
            <p className="min-w-0 text-xs leading-5 text-slate-300">
              {note.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
