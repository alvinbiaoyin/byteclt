import Link from "next/link";
import { PreviewChinaMap } from "./preview-china-map";

// Section 3 — Jianji™ Intelligence Platform preview.
// Restrained product preview, not an internal dashboard. China map +
// two metrics + a curated institution list. No backdrop grid, no glow,
// no bottom chart row, no regional pip-bars — the homepage previews
// the platform, it does not fully display it.

const PREVIEW_INSTITUTIONS = [
  { name: "Fudan Cancer", city: "Shanghai", weight: 96 },
  { name: "PUMC Hospital", city: "Beijing", weight: 84 },
  { name: "Sun Yat-sen", city: "Guangzhou", weight: 72 },
  { name: "Tianjin Cancer", city: "Tianjin", weight: 60 },
  { name: "West China", city: "Chengdu", weight: 48 },
];

const FEATURE_LABELS = [
  "National Testing Map",
  "Platform",
  "Regulatory & Reimbursement",
  "Analyst Notes",
];

export default function SectionPlatformPreview() {
  return (
    <section className="border-b border-slate-900 bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-28 md:py-36 lg:grid-cols-12 lg:gap-20">
        {/* ── Left text column ────────────────────────────────── */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <h2 className="text-3xl font-normal leading-tight tracking-tight text-zinc-100 sm:text-4xl lg:text-[2.5rem]">
            Jianji™ Intelligence Platform
          </h2>

          <p className="mt-6 max-w-md text-[15px] leading-8 text-zinc-400">
            Real-time view of the Chinese laboratory CDx testing landscape —
            institution coverage, regulatory, methodology and platform
            adoption, reimbursement, and market access.
          </p>

          <ul className="mt-10 space-y-2 text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            {FEATURE_LABELS.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>

          <Link
            href="/intel"
            prefetch={false}
            className="mt-10 inline-flex w-fit items-center gap-2 rounded-sm border border-cyan-400/40 bg-cyan-500/10 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-200 transition-colors hover:border-cyan-300/70 hover:bg-cyan-500/20"
          >
            Open Intelligence Platform
          </Link>
        </div>

        {/* ── Right preview frame ─────────────────────────────── */}
        <div className="relative lg:col-span-7">
          <DashboardPreviewFrame />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Static preview frame. Decorative only; does not import the live
// dashboard. Two horizontal bands: minimal chrome, then the map/sidebar
// grid. Sidebar holds two metrics and a curated institution list whose
// row bars stand in for the section's single chart.
// ─────────────────────────────────────────────────────────────────────────
function DashboardPreviewFrame() {
  return (
    <div className="overflow-hidden rounded-md border border-slate-800/60 bg-slate-950">
      {/* Minimal chrome */}
      <div className="flex items-center justify-between border-b border-slate-900 bg-slate-950/80 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-300">
            Jianji™ Platform
          </span>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-600">
          China · CDx Coverage
        </span>
      </div>

      {/* Map + sidebar grid */}
      <div className="grid grid-cols-12 gap-px bg-slate-900">
        {/* China testing map */}
        <div className="col-span-12 bg-slate-950 p-4 lg:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300/70">
              National Testing Map
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-600">
              Schematic
            </p>
          </div>
          <div className="relative h-56 overflow-hidden">
            <PreviewChinaMap />
          </div>
        </div>

        {/* Sidebar: KPIs + institution list */}
        <div className="col-span-12 bg-slate-950 lg:col-span-4">
          {/* 2 KPIs */}
          <div className="grid grid-cols-2 gap-px bg-slate-900">
            {[
              ["Active Institutions", "77"],
              ["Provinces Covered", "19"],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-950 px-4 py-3">
                <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-1 text-xl font-light tabular-nums text-zinc-100">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Top Institutions list with inline bars */}
          <div className="border-t border-slate-900 p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300/70">
              Top Institutions
            </p>
            <ul className="mt-4 space-y-3">
              {PREVIEW_INSTITUTIONS.map((inst) => (
                <li key={inst.name}>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em]">
                    <span className="truncate text-zinc-300">{inst.name}</span>
                    <span className="ml-2 text-zinc-600">{inst.city}</span>
                  </div>
                  <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className="h-full bg-cyan-500/55"
                      style={{ width: `${inst.weight}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
