import Link from "next/link";

export default function SectionAdjacentCare() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          From BYTE Healthcare Consulting
        </p>

        <article className="mt-8 rounded-md border border-slate-800/70 bg-slate-900/30 p-6">
          <p className="text-[13px] font-medium tracking-tight text-slate-300">
            Jianji Care
          </p>
          <h3 className="mt-2 text-lg font-light tracking-tight text-slate-100">
            China Factory Intelligence for Healthcare Products
          </h3>
          <p className="mt-3 text-[13px] leading-7 text-slate-400">
            Evaluate Chinese manufacturers across factory identity, production
            capability, quality systems, audit readiness, and export
            execution—before critical sourcing and production decisions.
          </p>
          <Link
            href="/jianji-care"
            prefetch={false}
            className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-400 transition-colors hover:text-cyan-200"
          >
            Explore Jianji Care
            <span aria-hidden className="text-zinc-600">
              →
            </span>
          </Link>
        </article>
      </div>
    </section>
  );
}
