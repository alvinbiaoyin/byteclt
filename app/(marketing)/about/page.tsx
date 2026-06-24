// app/(marketing)/about/page.tsx
// About — BYTE Healthcare Consulting firm identity and endorsed brands.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About · BYTE Healthcare Consulting",
  description:
    "BYTE Healthcare Consulting develops focused intelligence services for complex healthcare decisions across biomarker diagnostics and China factory intelligence.",
};

const WHAT_WE_WORK_ON = [
  "Companion Diagnostics",
  "Laboratory Adoption",
  "Launch Readiness",
  "Testing Strategy",
  "Reimbursement Assessment",
  "NGS Market Evaluation",
];

const BRANDS = [
  {
    name: "Jianji CDx",
    description:
      "Biomarker and companion diagnostics intelligence across testing adoption, laboratory networks, reimbursement, real-world testing behaviour, and launch readiness.",
    cta: "Explore Jianji CDx",
    href: "/platform",
  },
  {
    name: "Jianji Care",
    description:
      "China factory intelligence for healthcare, rehabilitation, elderly-care, mobility, and home-care products, covering manufacturer assessment, audit planning, quality risk, and export readiness.",
    cta: "Explore Jianji Care",
    href: "/jianji-care",
  },
] as const;

export default function AboutPage() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          BYTEclt · BYTE Healthcare Consulting
        </p>

        <h1 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Focused Healthcare Intelligence
          <br />
          Across Clinical and Manufacturing Settings
        </h1>

        <div className="mt-10 space-y-6">
          <p className="text-[15px] leading-8 text-zinc-400">
            BYTE Healthcare Consulting develops focused intelligence services
            for complex healthcare decisions across clinical diagnostics and
            healthcare manufacturing.
          </p>
          <p className="text-[15px] leading-8 text-zinc-400">
            The firm supports pharmaceutical, diagnostics, and biotechnology
            organizations on companion diagnostic commercialization,
            laboratory adoption, reimbursement considerations, and biomarker
            testing strategy associated with real-world clinical
            implementation.
          </p>
        </div>

        <div className="mt-24 border-t border-zinc-900/60 pt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Focused Practices
          </p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BRANDS.map((brand) => (
              <article
                key={brand.name}
                className="flex flex-col rounded-md border border-slate-800/70 bg-slate-900/30 p-6"
              >
                <h2 className="text-lg font-light tracking-tight text-zinc-100">
                  {brand.name}
                </h2>
                <p className="mt-3 flex-1 text-[13px] leading-7 text-zinc-400">
                  {brand.description}
                </p>
                <Link
                  href={brand.href}
                  prefetch={false}
                  className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-200 transition-colors hover:text-cyan-100"
                >
                  {brand.cta}
                  <span aria-hidden className="text-cyan-500/70">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-24 border-t border-zinc-900/60 pt-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Jianji CDx Expertise
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
