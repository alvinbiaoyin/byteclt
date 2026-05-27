// app/(marketing)/about/page.tsx
// About — firm identity. Answers "Who is BYTEclt?".
//
// Intentionally avoids platform vocabulary (Jianji, internal platform,
// methodology variation, observational analysis) and observation copy.
// Those belong to /platform and /intelligence respectively.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · BYTEclt",
  description:
    "BYTEclt is a diagnostics-focused advisory and intelligence practice working across precision medicine markets in Asia.",
};

const WHAT_WE_WORK_ON = [
  "Companion Diagnostics",
  "Laboratory Adoption",
  "Launch Readiness",
  "Testing Strategy",
  "Reimbursement Assessment",
  "NGS Market Evaluation",
];

export default function AboutPage() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          BYTEclt
        </p>

        <h1 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Biomarker Testing
          <br />
          Across Real Clinical Settings
        </h1>

        <div className="mt-10 space-y-6">
          <p className="text-[15px] leading-8 text-zinc-400">
            BYTEclt is a diagnostics-focused advisory and intelligence
            practice working across precision medicine markets in Asia.
          </p>
          <p className="text-[15px] leading-8 text-zinc-400">
            The firm supports pharmaceutical, diagnostics, and biotechnology
            organizations on companion diagnostic commercialization,
            laboratory adoption, reimbursement considerations, and biomarker
            testing strategy associated with real-world clinical
            implementation.
          </p>
        </div>

        {/* What We Work On — quiet vertical list, same hairline pattern
            shared by /platform and /intelligence but with a firm-scoped
            label and roster of practice areas. */}
        <div className="mt-24 border-t border-zinc-900/60 pt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            What We Work On
          </p>

          <ul className="mt-10 divide-y divide-zinc-900/60">
            {WHAT_WE_WORK_ON.map((area) => (
              <li
                key={area}
                className="py-4 text-[15px] font-light tracking-tight text-zinc-200"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
