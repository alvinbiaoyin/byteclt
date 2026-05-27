// Selected Work.
// Institutional-style engagement listing. Vertical stack, hairline
// separators, typography-led hierarchy. Closes with a short Observations
// block — analytical perspective statements, not marketing copy.

const ENGAGEMENTS = [
  {
    title: "HER2-Low Testing Assessment",
    body:
      "Assessment of HER2-low testing adoption across Chinese pathology laboratories and third-party testing providers, including assay methodology, testing availability, and estimated testing volume relevant to companion diagnostic launch planning.",
    meta: "China · Companion Diagnostics · HER2-low",
  },
  {
    title: "DLBCL COO / CDx Readiness",
    body:
      "Evaluation of biomarker testing readiness and companion diagnostic adoption patterns associated with DLBCL COO classification across hospitals and laboratories in China.",
    meta: "DLBCL · Biomarker Testing · Launch Readiness",
  },
];

const OBSERVATIONS = [
  "Testing adoption rarely scales uniformly across regions.",
  "Commercial launch assumptions often fail at the laboratory level.",
  "Testing methodology variation remains a practical launch constraint.",
];

export default function SectionSelectedWork() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <h2 className="text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Selected Work
        </h2>

        <p className="mt-8 text-[15px] leading-8 text-zinc-400">
          Representative assessments related to biomarker testing,
          companion diagnostics, and launch planning.
        </p>

        <div className="mt-24 divide-y divide-zinc-900/60">
          {ENGAGEMENTS.map((engagement) => (
            <article
              key={engagement.title}
              className="py-16 first:pt-0 last:pb-0"
            >
              <h3 className="text-2xl font-light tracking-tight text-zinc-100 md:text-[1.625rem]">
                {engagement.title}
              </h3>

              <p className="mt-7 text-[15px] leading-8 text-zinc-400">
                {engagement.body}
              </p>

              <p className="mt-8 text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-600">
                {engagement.meta}
              </p>
            </article>
          ))}
        </div>

        {/* Observations — short institutional perspective statements. */}
        <div className="mt-24 border-t border-zinc-900/60 pt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Observations
          </p>

          <ul className="mt-10 space-y-7">
            {OBSERVATIONS.map((statement) => (
              <li
                key={statement}
                className="text-[17px] font-light leading-[1.7] text-zinc-200"
              >
                {statement}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
