// Section 2 — China Precision Medicine Landscape.
// Six pillars of operating visibility. Typography-only hierarchy; each
// card carries a single short descriptor to keep the enterprise platform
// density and avoid a "consulting deck" feel.

const PILLARS: Array<{ title: string; descriptor: string }> = [
  {
    title: "Market Coverage",
    descriptor: "National testing presence across China.",
  },
  {
    title: "Laboratory Mapping",
    descriptor: "Hospital and third-party testing laboratory visibility.",
  },
  {
    title: "Testing Activity",
    descriptor: "Biomarker utilization and testing patterns.",
  },
  {
    title: "Platform Adoption",
    descriptor: "Platform and methodology distribution.",
  },
  {
    title: "Market Access",
    descriptor: "Provincial reimbursement and access environment.",
  },
  {
    title: "Real-World Data",
    descriptor:
      "Operational diagnostics intelligence from active laboratories.",
  },
];

export default function SectionIntelligenceLayer() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:py-32">
        <h2 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.02em] text-slate-100 sm:text-4xl lg:text-[2.75rem]">
          China Precision Medicine Landscape
        </h2>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-400">
          Real-world visibility into laboratories, testing, market access, and
          diagnostics adoption.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="group relative flex flex-col rounded-md border border-slate-800/70 bg-slate-900/30 p-8 transition-colors hover:border-slate-700 hover:bg-slate-900/55"
            >
              {/* Tactical corner registration mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-3 right-3 h-1.5 w-1.5 border-t border-r border-slate-700/60"
              />

              <h3 className="text-[19px] font-semibold leading-tight tracking-[-0.01em] text-slate-100">
                {p.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-slate-500">
                {p.descriptor}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
