import Link from "next/link";

// Adjacent Healthcare Supplier Intelligence.
// Lower-page, intentionally smaller than the Jianji CDx™ sections. Surfaces
// Jianji Care™ as an adjacent demo capability — a single narrow card — so it
// does not compete with the core diagnostics positioning.

export default function SectionAdjacentCare() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          Adjacent Healthcare Supplier Intelligence
        </p>

        <article className="mt-8 rounded-md border border-slate-800/70 bg-slate-900/30 p-6">
          <h3 className="text-[15px] font-medium tracking-tight text-slate-200">
            Jianji Care™ Supplier Intelligence Demo
          </h3>
          <p className="mt-3 text-[13px] leading-7 text-slate-400">
            A focused demo applying BYTEclt&apos;s China-side evaluation
            workflow to selected elderly care and rehabilitation device supplier
            assessment, including sourcing support, site visit planning, audit
            prioritization, and export readiness review.
          </p>
          <Link
            href="/care"
            prefetch={false}
            className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-400 transition-colors hover:text-cyan-200"
          >
            View Jianji Care™ Demo
            <span aria-hidden className="text-zinc-600">
              →
            </span>
          </Link>
        </article>
      </div>
    </section>
  );
}
