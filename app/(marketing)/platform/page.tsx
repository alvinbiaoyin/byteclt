// app/(marketing)/platform/page.tsx
// Platform — what Jianji™ is, restrained edition.
//
// Reads quieter and shorter than before. No second China map (homepage
// already establishes that visually). No "What Jianji Tracks" feature list
// (started reading like SaaS marketing and duplicated the homepage). No
// PD-L1 percentage fragment (created a "narrow single-biomarker dashboard"
// impression). No "internal" framing (commercial model is still evolving).
//
// Now: eyebrow → headline → one body sentence → quiet cross-biomarker
// matrix → one closing line.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jianji™ Platform · BYTEclt",
  description:
    "Jianji™ supports observational analysis related to biomarker testing adoption, reimbursement dynamics, and laboratory activity across precision medicine markets.",
};

// Biomarker constellation — irregular, editorial scatter rather than a
// rigid taxonomy grid. Many biomarkers overlap across companion diagnostics,
// molecular oncology, hematologic malignancies, immunotherapy, and targeted
// therapy settings, so strict categorization would be scientifically
// inconsistent. Positions below are hand-placed on a 12-col × 5-row grid;
// the resulting whitespace and unaligned starts create a "broader
// diagnostics landscape" feel without implying hierarchy.
//
// Position classes are static strings so Tailwind's JIT compiler can detect
// them — do not interpolate the col/row values from variables.
const BIOMARKERS: Array<{ name: string; pos: string }> = [
  // Row 1
  { name: "PD-L1",     pos: "md:col-start-2  md:col-span-2 md:row-start-1" },
  { name: "HER2-low",  pos: "md:col-start-6  md:col-span-3 md:row-start-1" },
  { name: "EGFR",      pos: "md:col-start-11 md:col-span-2 md:row-start-1" },
  // Row 2
  { name: "ALK",       pos: "md:col-start-1  md:col-span-2 md:row-start-2" },
  { name: "CLDN18.2",  pos: "md:col-start-5  md:col-span-3 md:row-start-2" },
  { name: "ROS1",      pos: "md:col-start-10 md:col-span-2 md:row-start-2" },
  // Row 3
  { name: "DLL3",      pos: "md:col-start-2  md:col-span-2 md:row-start-3" },
  { name: "MSI/MMR",   pos: "md:col-start-5  md:col-span-3 md:row-start-3" },
  { name: "RET",       pos: "md:col-start-9  md:col-span-2 md:row-start-3" },
  { name: "DLBCL COO", pos: "md:col-start-11 md:col-span-2 md:row-start-3" },
  // Row 4
  { name: "TMB",       pos: "md:col-start-3  md:col-span-2 md:row-start-4" },
  { name: "BCR-ABL1",  pos: "md:col-start-7  md:col-span-3 md:row-start-4" },
  { name: "FLT3",      pos: "md:col-start-11 md:col-span-2 md:row-start-4" },
  // Row 5
  { name: "PIK3CA",    pos: "md:col-start-4  md:col-span-2 md:row-start-5" },
  { name: "IDH1/2",    pos: "md:col-start-9  md:col-span-2 md:row-start-5" },
];

export default function PlatformPage() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          Jianji™
        </p>

        <h1 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Diagnostics Intelligence Platform
        </h1>

        <p className="mt-10 text-[15px] leading-8 text-zinc-400">
          Jianji™ supports observational analysis related to biomarker
          testing adoption, reimbursement dynamics, and laboratory activity
          across precision medicine markets.
        </p>

        {/* ── Biomarker constellation ─────────────────────────────────────
            On md+ this renders as a hand-placed 12-col × 5-row scatter so
            the biomarkers feel like floating editorial typography rather
            than a feature matrix. On mobile it collapses to a wrapping
            flex so the page stays compact. No intro paragraph — the
            constellation itself is the statement. */}
        <div className="mt-24 border-t border-zinc-900/60 pt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Biomarker Activity Across Precision Oncology
          </p>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-5 md:mt-16 md:grid md:grid-cols-12 md:grid-rows-5 md:gap-x-6 md:gap-y-14">
            {BIOMARKERS.map((bm) => (
              <li
                key={bm.name}
                className={`font-mono text-[13px] tracking-tight text-zinc-300 ${bm.pos}`}
              >
                {bm.name}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Restrained closing line ─────────────────────────────────────
            No eyebrow, no section header — a single confident sentence
            sitting on its own. */}
        <p className="mt-24 border-t border-zinc-900/60 pt-16 text-[17px] font-light leading-[1.7] text-zinc-200">
          Built around real-world diagnostics adoption.
        </p>
      </div>
    </section>
  );
}
