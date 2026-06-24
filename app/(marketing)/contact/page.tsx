import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact · BYTE Healthcare Consulting",
  description:
    "Contact BYTE Healthcare Consulting about biomarker and companion diagnostics intelligence, CDx platform access, or Jianji Care factory intelligence projects.",
};

const INQUIRY_PATHS = [
  {
    name: "Jianji CDx",
    description:
      "For biomarker testing, companion diagnostics, laboratory adoption, reimbursement, market intelligence, and platform access.",
    practice: "jianji-cdx",
  },
  {
    name: "Jianji Care",
    description:
      "For China factory intelligence, manufacturer assessment, audit planning, site visits, quality review, and export readiness.",
    practice: "jianji-care",
  },
] as const;

type ContactPageProps = {
  searchParams: Promise<{ practice?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { practice } = await searchParams;
  const selectedPractice =
    practice === "jianji-care" || practice === "jianji-cdx" ? practice : null;

  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto max-w-3xl px-6 py-32 md:py-40">
        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
          Contact
        </p>

        <h1 className="mt-8 text-3xl font-light tracking-tight text-zinc-100 md:text-4xl">
          Discuss a Healthcare Intelligence Project
        </h1>

        <p className="mt-10 text-[15px] leading-8 text-zinc-400">
          Contact BYTE Healthcare Consulting about biomarker and companion
          diagnostics intelligence, CDx platform access, or Jianji Care factory
          intelligence projects.
        </p>

        {selectedPractice === "jianji-care" && (
          <p className="mt-6 rounded-sm border border-cyan-500/20 bg-cyan-950/20 px-4 py-3 text-[13px] leading-7 text-cyan-100/90">
            You are enquiring about a{" "}
            <strong className="font-medium text-cyan-50">Jianji Care</strong>{" "}
            factory intelligence project.
          </p>
        )}

        {selectedPractice === "jianji-cdx" && (
          <p className="mt-6 rounded-sm border border-cyan-500/20 bg-cyan-950/20 px-4 py-3 text-[13px] leading-7 text-cyan-100/90">
            You are enquiring about{" "}
            <strong className="font-medium text-cyan-50">Jianji CDx</strong>{" "}
            biomarker and companion diagnostics intelligence.
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {INQUIRY_PATHS.map((path) => {
            const isSelected = selectedPractice === path.practice;
            return (
              <Link
                key={path.practice}
                href={`/contact?practice=${path.practice}`}
                prefetch={false}
                className={`flex flex-col rounded-md border p-5 transition-colors ${
                  isSelected
                    ? "border-cyan-500/40 bg-cyan-950/20"
                    : "border-slate-800/70 bg-slate-900/30 hover:border-slate-700"
                }`}
              >
                <h2 className="text-[15px] font-medium text-zinc-100">
                  {path.name}
                </h2>
                <p className="mt-2 flex-1 text-[13px] leading-7 text-zinc-400">
                  {path.description}
                </p>
              </Link>
            );
          })}
        </div>

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

        <a
          href={
            selectedPractice === "jianji-care"
              ? "mailto:alvin.yin@byteclt.com?subject=Jianji%20Care%20factory%20intelligence%20enquiry"
              : selectedPractice === "jianji-cdx"
                ? "mailto:alvin.yin@byteclt.com?subject=Jianji%20CDx%20enquiry"
                : "mailto:alvin.yin@byteclt.com"
          }
          className="mt-16 inline-flex w-fit items-center gap-2 rounded-sm border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
        >
          Contact BYTE Healthcare Consulting
        </a>
      </div>
    </section>
  );
}
