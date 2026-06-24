import Link from "next/link";

export default function SectionByte() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          BYTEclt &nbsp;·&nbsp; BYTE Healthcare Consulting
        </p>

        <h2 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Diagnostics Strategy
          <br />
          Built Around Testing Adoption
        </h2>

        <div className="mt-10 space-y-6">
          <p className="text-[15px] leading-8 text-zinc-400">
            BYTE Healthcare Consulting works on biomarker testing, companion
            diagnostics, and launch readiness across China&apos;s precision
            medicine market.
          </p>
          <p className="text-[15px] leading-8 text-zinc-400">
            We work with pharma, diagnostics, and biotech teams on how
            biomarker testing actually behaves across Chinese hospitals
            and third-party testing laboratories — testing capability and
            methodology, regional reimbursement, send-out testing, and
            hospital-level adoption.
          </p>
          <p className="text-[15px] leading-8 text-zinc-400">
            Jianji CDx is BYTE Healthcare Consulting&apos;s biomarker and
            companion diagnostics intelligence platform for analyzing testing
            adoption across Chinese hospitals and third-party testing
            laboratories.
          </p>
        </div>

        <Link
          href="/about"
          prefetch={false}
          className="mt-12 inline-flex items-center gap-2 text-[13px] tracking-tight text-zinc-300 transition-colors hover:text-zinc-100"
        >
          About BYTE Healthcare Consulting
          <span aria-hidden className="text-zinc-500">→</span>
        </Link>
      </div>
    </section>
  );
}
