// app/(marketing)/intelligence/page.tsx
// Intelligence — narrative editorial body + sticky-label / narrative-flow list.
//
// Layout intent (V4 — narrative flow):
//   - Editorial body block constrained to max-w-3xl for prose readability.
//   - "Areas Commonly Observed" reframed as a 1/3 + 2/3 split:
//        Left (1/3, sticky):   eyebrow + one quiet caption line.
//        Right (2/3, single-column text flow):
//           Eight labels rendered as a vertical sequence with no card
//           chrome — just a hairline beneath each row, a cyan-coded
//           monospace numeric marker, and generous py-8 vertical
//           breathing room. On hover the row shifts 4px right; the
//           hairline and marker brighten to cyan; the text lifts to
//           near-white. The whole thing is meant to read as guided
//           reading rather than a grid of containers.
//
// Firm identity lives on /about. Platform mechanics live on /platform.
// The interactive dashboard at /intel remains the operating surface and
// is reached via the "Open Platform" CTA in the marketing nav.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence · BYTEclt",
  description:
    "BYTEclt analyzes real-world testing activity to understand how companion diagnostics move through hospitals, laboratories, and treatment pathways across precision medicine markets.",
};

const AREAS_COMMONLY_OBSERVED = [
  "Testing adoption and utilization patterns",
  "Companion diagnostic implementation",
  "Real-world testing workflow behavior",
  "Guideline adoption across institutions",
  "Send-out and laboratory network dynamics",
  "Testing access and reimbursement status",
  "Molecular and NGS testing pathways",
  "Treatment pathway implications in clinical practice",
];

export default function IntelligencePage() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-32 md:py-40">
        {/* Editorial body — narrower column for prose. */}
        <div className="max-w-3xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Intelligence
          </p>

          <h1 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
            Understanding How Biomarker Testing Behaves in Real Clinical
            Practice
          </h1>

          <div className="mt-10 space-y-7">
            <p className="text-[15px] leading-8 text-zinc-400">
              Biomarker testing adoption rarely evolves uniformly across
              markets. Differences in testing workflow, turnaround time,
              reimbursement status, laboratory capability, and guideline
              implementation continue to shape how precision medicine is
              practiced across real clinical settings.
            </p>
            <p className="text-[15px] leading-8 text-zinc-400">
              BYTEclt analyzes real-world testing activity to understand
              how companion diagnostics move through hospitals,
              laboratories, and treatment pathways — revealing where
              adoption accelerates, where operational friction remains,
              and how testing behavior ultimately influences patient
              access and therapy decisions.
            </p>
          </div>
        </div>

        {/* ── Areas Commonly Observed ─────────────────────────────────────
            Asymmetric 1/3 + 2/3 grid. Sticky label on the left, a single
            vertical column of frameless text rows on the right. */}
        <div className="mt-24 border-t border-zinc-900/60 pt-16 md:mt-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
            {/* Left — sticky label + quiet caption. */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                  Areas Commonly Observed
                </p>
                <p className="mt-5 max-w-[15rem] text-[13px] leading-7 text-zinc-600">
                  Recurring threads across markets, institutions, and
                  clinical pathways.
                </p>
              </div>
            </div>

            {/* Right — single-column narrative text flow. No card chrome,
                just a hairline beneath each row + a cyan-coded numeric
                marker. */}
            <ul className="lg:col-span-2">
              {AREAS_COMMONLY_OBSERVED.map((label, idx) => (
                <li
                  key={label}
                  className="group flex items-baseline gap-6 border-b border-slate-800/60 py-8 transition-all duration-300 ease-out hover:translate-x-1 hover:border-cyan-400/40"
                >
                  <span className="shrink-0 font-mono text-[13px] tracking-[0.3em] text-cyan-400/50 transition-colors duration-300 group-hover:text-cyan-300">
                    {String(idx + 1).padStart(2, "0")} /
                  </span>
                  <span className="text-[15px] font-light leading-relaxed tracking-tight text-zinc-300 transition-colors duration-300 group-hover:text-zinc-50">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
