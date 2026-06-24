import Link from "next/link";
import HeroChinaInfrastructureMap from "./hero-china-infrastructure-map";

// ─────────────────────────────────────────────────────────────────────────
// Hero — institutional, geopolitical posture.
//
// Right visual: HeroChinaInfrastructureMap — a cinematic, non-interactive
// mirror of the /intel dashboard ChinaMap. Real China province geometry +
// dashboard colour palette + hospital network nodes, layered on a faded
// world-map backdrop. Pure server-rendered SVG; no ECharts on the bundle.
// ─────────────────────────────────────────────────────────────────────────

export default function SectionHero() {
  return (
    <section className="relative border-b border-slate-900">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-12 lg:py-32">
        {/* ── Left text column ────────────────────────────────── */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-slate-100 sm:text-5xl lg:text-[3.5rem]">
            Biomarker Testing Intelligence Across Real Clinical Settings
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-slate-400">
            BYTEclt supports pharmaceutical, diagnostics, and biotechnology
            organizations on companion diagnostic commercialization, laboratory
            adoption, reimbursement considerations, and biomarker testing
            strategy associated with real-world clinical implementation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/platform"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/60 bg-cyan-500/15 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-100 transition-colors hover:border-cyan-300/80 hover:bg-cyan-500/25"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Explore Jianji CDx
            </Link>
            <Link
              href="/intel"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-700 bg-transparent px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
            >
              Open CDx Platform
            </Link>
          </div>

          {/* Tactical sub-strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-600">
            <span>National Coverage</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Companion Diagnostics</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span>Real-World Data</span>
          </div>
        </div>

        {/* ── Right geopolitical visual ───────────────────────── */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="relative aspect-[4/5] w-full max-w-[560px]">
            <HeroChinaInfrastructureMap />
          </div>
        </div>
      </div>
    </section>
  );
}
