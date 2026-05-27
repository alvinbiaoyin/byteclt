import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · BYTEclt",
  description:
    "Contact BYTEclt for partnership discussions, diagnostics assessments, or platform access inquiries.",
};

export default function ContactPage() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          Contact
        </p>

        <h1 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Contact BYTEclt
        </h1>

        <p className="mt-10 text-[15px] leading-8 text-zinc-400">
          For partnership discussions, diagnostics assessments, or platform
          access inquiries related to companion diagnostics and biomarker
          testing.
        </p>

        {/* Contact details — quiet typographic block */}
        <div className="mt-20 border-t border-zinc-900/60 pt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Details
          </p>

          <div className="mt-10 space-y-3">
            <p className="text-[15px] font-light tracking-tight text-zinc-200">
              Shanghai, China
            </p>
            <p className="text-[15px] font-light tracking-tight text-zinc-200">
              alvin.yin@byteclt.com
            </p>
            <p className="text-[15px] font-light tracking-tight text-zinc-200">
              (+86) 134 8209 6741
            </p>
          </div>
        </div>

        {/* Single CTA */}
        <a
          href="mailto:alvin.yin@byteclt.com"
          className="mt-16 inline-flex w-fit items-center gap-2 rounded-sm border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
        >
          Contact BYTEclt
        </a>
      </div>
    </section>
  );
}
