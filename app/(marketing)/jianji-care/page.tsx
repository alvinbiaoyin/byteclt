// app/(marketing)/jianji-care/page.tsx
// Jianji Care — China Supplier Quality Management for healthcare products.
//
// Factory intelligence demo (below) is illustrative only: data from
// lib/jianji-care-data.ts, not connected to Supabase.

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import type { CountBucket } from "@/lib/jianji-care-data";
import {
  CARE_SUPPLIERS,
  computeCareMetrics,
  countByCategory,
  countByProvince,
  countByReadiness,
  countByRegion,
  isAuditedOrVisited,
} from "@/lib/jianji-care-data";
import CareSupplierExplorer from "./care-supplier-explorer";

export const metadata: Metadata = {
  title:
    "Jianji Care | China Supplier Quality Management for Healthcare Products",
  description:
    "China-side supplier quality management for eldercare and rehabilitation devices, IVD and CDx reagents & consumables, and medical devices — audits, production monitoring, release gates, and CAPA follow-up without a full-time China SQE.",
  openGraph: {
    title:
      "Jianji Care | China Supplier Quality Management for Healthcare Products",
    description:
      "China-side supplier quality management for eldercare devices, IVD/CDx, and medical devices manufactured or sourced in China.",
    type: "website",
  },
};

interface MetricCard {
  label: string;
  value: number;
  hint: string;
}

interface UseCase {
  title: string;
  description: string;
}

interface SectorCard {
  title: string;
  description: string;
}

interface IncludeItem {
  title: string;
  description: string;
}

interface StepItem {
  step: string;
  title: string;
  description: string;
}

const SECTORS: readonly SectorCard[] = [
  {
    title: "Eldercare & rehabilitation devices",
    description:
      "Nursing and rehab equipment, care furniture, mobility aids, and related hard goods — production monitoring, inspection, and shipment release against your specs.",
  },
  {
    title: "IVD & CDx",
    description:
      "Reagents, consumables, and related materials (including CDx-linked kits manufactured in China): lot consistency, labeling and packaging checks, nonconformance / CAPA follow-up, and release support.",
  },
  {
    title: "Medical devices",
    description:
      "Finished goods and components under OEM/ODM — supplier qualification, in-process and pre-shipment quality gates aligned with your specifications and QMS expectations.",
  },
];

const INCLUDES: readonly IncludeItem[] = [
  {
    title: "Supplier audit & qualification",
    description:
      "On-site or structured review of capability, quality system signals, and fit before you commit volume.",
  },
  {
    title: "Production / in-process monitoring",
    description:
      "Progress and risk checks during production — remote-first, with factory visits when the gate requires it.",
  },
  {
    title: "Pre-shipment inspection & release",
    description:
      "Checklist-based verification with a clear release or hold recommendation, not a PDF left hanging.",
  },
  {
    title: "CAPA & rework follow-up",
    description:
      "Drive nonconformances to closure with evidence — so issues are fixed before goods move.",
  },
  {
    title: "Bilingual reports & evidence",
    description:
      "Decision-ready English/Chinese reporting with photo and video support for your team and suppliers.",
  },
  {
    title: "Optional monthly quality brief",
    description:
      "On retainer: defect trends, supplier status, and what to watch before the next shipment.",
  },
];

const STEPS: readonly StepItem[] = [
  {
    step: "01",
    title: "Scope",
    description:
      "Align product, factory, checklist, and release rules before anyone goes on site.",
  },
  {
    step: "02",
    title: "Engage",
    description:
      "Kick off within days. We bridge your requirements to the plant in Chinese and report in English.",
  },
  {
    step: "03",
    title: "Execute",
    description:
      "Run the quality gates that matter — not six unnecessary factory visits for every milestone.",
  },
  {
    step: "04",
    title: "Scale",
    description:
      "Per project or retainer: China SQE capacity on demand as your order volume grows.",
  },
];

const USE_CASES: readonly UseCase[] = [
  {
    title: "Factory Discovery & Longlisting",
    description:
      "Identify potentially relevant manufacturers based on product category, manufacturing scope, location, and target-market requirements.",
  },
  {
    title: "Manufacturer Identity & Capability Verification",
    description:
      "Assess whether a company is an actual manufacturer and whether its facility, equipment, processes, and product experience fit the project.",
  },
  {
    title: "Audit Prioritization & Site-Visit Planning",
    description:
      "Identify key information gaps, risk signals, and areas requiring direct factory review before an audit or visit.",
  },
  {
    title: "Export Readiness & Quality-Risk Review",
    description:
      "Review quality-system signals, certifications, export experience, product documentation, and potential execution risks.",
  },
];

export default function JianjiCarePage() {
  const suppliers = CARE_SUPPLIERS;

  const metrics = computeCareMetrics(suppliers);
  const regionBuckets = countByRegion(suppliers);
  const categoryBuckets = countByCategory(suppliers);
  const readinessBuckets = countByReadiness(suppliers);
  const provinceBuckets = countByProvince(suppliers);
  const provinces = provinceBuckets.map((bucket) => bucket.label);

  const manufacturersNeedingAudit = suppliers.filter(
    (supplier) => !isAuditedOrVisited(supplier.auditStatus),
  );

  const KEY_REGIONS = ["Zhejiang", "Jiangsu", "Guangdong", "Shandong"];
  const keyRegionManufacturerCount = suppliers.filter((supplier) =>
    KEY_REGIONS.includes(supplier.province),
  ).length;

  const metricCards: MetricCard[] = [
    {
      label: "Illustrative records",
      value: metrics.totalSuppliers,
      hint: "Demo coverage set",
    },
    {
      label: "Product categories",
      value: metrics.productCategories,
      hint: "Healthcare product lines",
    },
    {
      label: "Provinces covered",
      value: metrics.provincesCovered,
      hint: "Demo coverage",
    },
    {
      label: "Indicative high readiness",
      value: metrics.highReadiness,
      hint: "Illustrative export readiness",
    },
    {
      label: "Audit signals logged",
      value: metrics.auditedOrVisited,
      hint: "Site visited or formally audited in demo",
    },
  ];

  return (
    <div className="bg-slate-950">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-slate-900 bg-gradient-to-b from-slate-900/40 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-400/80">
            Jianji Care™ · BY BYTE HEALTHCARE CONSULTING
          </p>
          <h1 className="mt-6 max-w-4xl text-3xl font-light tracking-tight text-slate-100 md:text-5xl">
            China Supplier Quality Management
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-8 text-slate-300">
            Your local supplier quality team in China — without a full-time
            China SQE.
          </p>
          <p className="mt-6 max-w-3xl text-[15px] leading-8 text-slate-400">
            We run standards, on-site checks, corrective follow-up, and shipment
            release for{" "}
            <span className="text-slate-300">
              eldercare and rehabilitation devices
            </span>
            ,{" "}
            <span className="text-slate-300">
              IVD and CDx reagents &amp; consumables
            </span>
            , and{" "}
            <span className="text-slate-300">medical devices</span> manufactured
            or sourced in China.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/contact?practice=jianji-care"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/60 bg-cyan-500/15 px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-100 transition-colors hover:border-cyan-300/80 hover:bg-cyan-500/25"
            >
              Discuss SQM
            </Link>
            <Link
              href="#factory-intelligence-demo"
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-700 bg-transparent px-5 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
            >
              Explore the Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sectors ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
          Sectors covered
        </h2>
        <p className="mt-3 max-w-2xl text-[13px] leading-7 text-slate-400">
          One operating model across healthcare manufacturing in China: QA
          standards, QC on site, order follow-up, and light project control.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SECTORS.map((sector) => (
            <div
              key={sector.title}
              className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-5"
            >
              <div className="h-px w-8 bg-cyan-500/50" />
              <h3 className="mt-4 text-[13px] font-medium leading-snug text-slate-200">
                {sector.title}
              </h3>
              <p className="mt-3 text-[12px] leading-6 text-slate-400">
                {sector.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What’s included ────────────────────────────────────────── */}
      <section className="border-y border-slate-900 bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
            What&apos;s included
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDES.map((item) => (
              <div
                key={item.title}
                className="rounded-sm border border-slate-800/80 bg-slate-950/60 p-5"
              >
                <h3 className="text-[13px] font-medium text-slate-200">
                  {item.title}
                </h3>
                <p className="mt-3 text-[12px] leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
          How it works
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-5"
            >
              <p className="font-mono text-[11px] tracking-[0.18em] text-cyan-400/80">
                {item.step}
              </p>
              <h3 className="mt-3 text-[13px] font-medium text-slate-200">
                {item.title}
              </h3>
              <p className="mt-3 text-[12px] leading-6 text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Factory intelligence support (demo layer) ──────────────── */}
      <section
        id="factory-intelligence-support"
        className="border-t border-slate-900"
      >
        <div className="mx-auto max-w-7xl px-6 pt-14 md:pt-16">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
            Factory intelligence support
          </h2>
          <p className="mt-3 max-w-3xl text-[13px] leading-7 text-slate-400">
            Before and alongside SQM execution, we use factory intelligence to
            discover, assess, and prioritise manufacturers. The demo below
            illustrates that support layer for{" "}
            <span className="text-slate-300">
              eldercare, mobility, and home-care
            </span>{" "}
            categories — illustrative only; live IVD/medical-device programmes
            use project-specific evidence.
          </p>
        </div>

        {/* Metric cards */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">
            Demo coverage
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {metricCards.map((card) => (
              <div
                key={card.label}
                className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-5"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-light text-slate-100">
                  {card.value}
                </p>
                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  {card.hint}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core use cases */}
        <div className="mx-auto max-w-7xl px-6 pb-4 pt-4">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
            Intelligence use cases
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-5"
              >
                <div className="h-px w-8 bg-cyan-500/50" />
                <h4 className="mt-4 text-[13px] font-medium leading-snug text-slate-200">
                  {useCase.title}
                </h4>
                <p className="mt-3 text-[12px] leading-6 text-slate-400">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual summary */}
        <div className="mx-auto max-w-7xl px-6 pb-4 pt-8">
          <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600">
            Illustrative records
          </p>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <SummaryPanel
              title="Manufacturers by region"
              buckets={regionBuckets}
              total={metrics.totalSuppliers}
              barClass="bg-cyan-500/70"
            />
            <SummaryPanel
              title="Manufacturers by product category"
              buckets={categoryBuckets}
              total={metrics.totalSuppliers}
              barClass="bg-sky-500/60"
            />
            <SummaryPanel
              title="Export readiness distribution"
              buckets={readinessBuckets}
              total={metrics.totalSuppliers}
              barClass="bg-emerald-500/60"
            />
          </div>
        </div>

        {/* Intelligence dimensions */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h3 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
            Intelligence dimensions
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <InsightCard title="Factory identity and operating background">
              <strong className="text-slate-200">Zhejiang</strong>,{" "}
              <strong className="text-slate-200">Jiangsu</strong>,{" "}
              <strong className="text-slate-200">Guangdong</strong>, and{" "}
              <strong className="text-slate-200">Shandong</strong> show the
              strongest illustrative concentration in this demo, accounting for{" "}
              <strong className="text-slate-200">
                {keyRegionManufacturerCount}
              </strong>{" "}
              of {metrics.totalSuppliers} example manufacturers. Regional density
              is an indicative signal only and requires verification for live
              projects.
            </InsightCard>

            <InsightCard title="Product and manufacturing capability">
              Healthcare product categories in the demo span mobility, care
              furniture, patient handling, and home-care devices. Capability fit
              should be assessed against equipment, process scope, and prior
              product experience — presented here as potential capability, not
              confirmed production capacity.
            </InsightCard>

            <InsightCard title="Quality-system and audit signals">
              <strong className="text-slate-200">
                {manufacturersNeedingAudit.length}
              </strong>{" "}
              illustrative records carry incomplete audit signals or information
              gaps that would warrant desktop review or a recommended audit focus
              before production decisions. Audit status in the demo is indicative
              only.
            </InsightCard>

            <InsightCard title="Export and target-market readiness">
              Export readiness varies by certification profile, documentation
              completeness, and prior export experience. Records showing{" "}
              <strong className="text-slate-200">ISO 13485</strong>,{" "}
              <strong className="text-slate-200">CE</strong>, or{" "}
              <strong className="text-slate-200">FDA 510(k)</strong> coverage
              suggest stronger indicative readiness — all require verification
              against target-market requirements.
            </InsightCard>
          </div>
        </div>
      </section>

      {/* ── Video ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 lg:pt-1">
            <h2 className="text-2xl font-light tracking-tight text-slate-100 md:text-3xl">
              See Jianji Care in Action
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-8 text-slate-400">
              A short look at China-side product observation, factory
              assessment, and quality checks — the fieldwork behind supplier
              quality management.
            </p>
          </div>
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="w-full max-w-[360px] overflow-hidden rounded-md border border-slate-800/80 bg-slate-900/40 shadow-lg shadow-black/20">
              <video
                className="aspect-[9/16] w-full bg-slate-900 object-cover"
                controls
                playsInline
                preload="metadata"
                poster="/images/jianji-care-video-poster.svg"
                aria-label="Jianji Care supplier quality demonstration video"
              >
                <source src="/videos/jianji-care-intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ── Factory Intelligence Demo ────────────────────────────────── */}
      <section
        id="factory-intelligence-demo"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-16"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
            Factory Intelligence Demo
          </h2>
          <span className="rounded-sm border border-amber-500/30 bg-amber-950/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300/90">
            Illustrative demo data
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-[13px] leading-7 text-slate-400">
          Example manufacturers across elderly-care, rehabilitation, mobility,
          and home-care product categories — illustrating how intelligence
          supports SQM scoping. Profiles are fictional and for demonstration
          only.
        </p>
        <p className="mt-4 max-w-3xl rounded-sm border border-slate-800/80 bg-slate-900/30 px-4 py-3 text-[12px] leading-6 text-slate-500">
          This demo uses fictional manufacturer profiles and illustrative
          assessments. It does not represent verified real-world suppliers or
          current audit findings. IVD and broader medical-device programmes are
          scoped per project outside this demo set.
        </p>
        <div className="mt-6">
          <CareSupplierExplorer suppliers={suppliers} provinces={provinces} />
        </div>
      </section>
    </div>
  );
}

function SummaryPanel({
  title,
  buckets,
  total,
  barClass,
}: {
  title: string;
  buckets: CountBucket[];
  total: number;
  barClass: string;
}) {
  const max = buckets.reduce((peak, bucket) => Math.max(peak, bucket.count), 0);
  return (
    <div className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-5">
      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {buckets.map((bucket) => {
          const widthPct = max > 0 ? (bucket.count / max) * 100 : 0;
          const sharePct =
            total > 0 ? Math.round((bucket.count / total) * 100) : 0;
          return (
            <li key={bucket.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] text-slate-300">
                  {bucket.label}
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {bucket.count} · {sharePct}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${barClass}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function InsightCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-6">
      <h3 className="text-[13px] font-medium text-slate-200">{title}</h3>
      <p className="mt-3 text-[13px] leading-7 text-slate-400">{children}</p>
    </div>
  );
}
