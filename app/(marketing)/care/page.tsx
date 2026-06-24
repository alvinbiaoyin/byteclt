// app/(marketing)/care/page.tsx
// Jianji Care™ Supplier Intelligence Platform — demo vertical.
//
// China elderly care and rehabilitation device supplier intelligence for
// international procurement, supplier evaluation, and market development.
//
// Mock demo only: all data is sourced from lib/jianji-care-data.ts and is not
// connected to Supabase. The page renders the hero, headline metrics, an
// insight read-out, and Tailwind-only summary bars on the server, then hands
// the dataset to a client explorer for filtering.

import type { Metadata } from "next";
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
  title: "Jianji Care™ Supplier Intelligence Platform · BYTEclt",
  description:
    "China elderly care and rehabilitation device supplier intelligence for international procurement, supplier evaluation, and market development.",
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

const USE_CASES: readonly UseCase[] = [
  {
    title: "Supplier shortlisting for overseas procurement",
    description:
      "Compare potential suppliers by category, location, export readiness, certification profile, and BYTE assessment notes.",
  },
  {
    title: "Pre-shipment inspection planning",
    description:
      "Identify suppliers and product categories where on-site inspection or shipment-level quality checks may be required.",
  },
  {
    title: "Initial supplier audit prioritization",
    description:
      "Prioritize suppliers for desktop review, site visit, or formal audit based on readiness, risk level, and product complexity.",
  },
  {
    title: "Product category sourcing comparison",
    description:
      "Compare supplier density and export readiness across elderly care and rehabilitation device categories.",
  },
];

export default function CarePage() {
  const suppliers = CARE_SUPPLIERS;

  const metrics = computeCareMetrics(suppliers);
  const regionBuckets = countByRegion(suppliers);
  const categoryBuckets = countByCategory(suppliers);
  const readinessBuckets = countByReadiness(suppliers);
  const provinceBuckets = countByProvince(suppliers);
  const provinces = provinceBuckets.map((bucket) => bucket.label);

  const suppliersNeedingAudit = suppliers.filter(
    (supplier) => !isAuditedOrVisited(supplier.auditStatus),
  );

  const KEY_SOURCING_PROVINCES = [
    "Zhejiang",
    "Jiangsu",
    "Guangdong",
    "Shandong",
  ];
  const keyProvinceSupplierCount = suppliers.filter((supplier) =>
    KEY_SOURCING_PROVINCES.includes(supplier.province),
  ).length;

  const metricCards: MetricCard[] = [
    {
      label: "Total suppliers",
      value: metrics.totalSuppliers,
      hint: "In the demo coverage set",
    },
    {
      label: "Product categories",
      value: metrics.productCategories,
      hint: "Care & rehabilitation lines",
    },
    {
      label: "Provinces covered",
      value: metrics.provincesCovered,
      hint: "Across coastal & northern clusters",
    },
    {
      label: "High-readiness suppliers",
      value: metrics.highReadiness,
      hint: "Rated High for export readiness",
    },
    {
      label: "Audited / visited",
      value: metrics.auditedOrVisited,
      hint: "Site visited or formally audited",
    },
  ];

  return (
    <div className="bg-slate-950">
      {/* ── A. Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-900 bg-gradient-to-b from-slate-900/40 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-400/80">
            BYTEclt Intelligence Vertical
          </p>
          <h1 className="mt-6 max-w-4xl text-3xl font-light tracking-tight text-slate-100 md:text-5xl">
            Jianji Care™ Supplier Intelligence Platform
          </h1>
          <p className="mt-8 max-w-3xl text-[15px] leading-8 text-slate-400">
            Structured intelligence on China elderly care and rehabilitation
            device suppliers, covering product scope, export readiness,
            certification profile, audit status, and BYTE assessment notes.
          </p>
          <p className="mt-4 max-w-3xl text-[14px] leading-7 text-slate-500">
            Designed to support overseas procurement teams with supplier
            shortlisting, site visit planning, audit prioritization, and
            sourcing decision support.
          </p>
        </div>
      </section>

      {/* ── B. Metric cards ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12">
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
      </section>

      {/* ── B2. Example use cases ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-4">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
          Example use cases
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className="rounded-sm border border-slate-800/80 bg-slate-900/40 p-5"
            >
              <div className="h-px w-8 bg-cyan-500/50" />
              <h3 className="mt-4 text-[13px] font-medium leading-snug text-slate-200">
                {useCase.title}
              </h3>
              <p className="mt-3 text-[12px] leading-6 text-slate-400">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── F. Visual summary ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-4 pt-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SummaryPanel
            title="Suppliers by region"
            buckets={regionBuckets}
            total={metrics.totalSuppliers}
            barClass="bg-cyan-500/70"
          />
          <SummaryPanel
            title="Suppliers by product category"
            buckets={categoryBuckets}
            total={metrics.totalSuppliers}
            barClass="bg-sky-500/60"
          />
          <SummaryPanel
            title="Readiness distribution"
            buckets={readinessBuckets}
            total={metrics.totalSuppliers}
            barClass="bg-emerald-500/60"
          />
        </div>
      </section>

      {/* ── E. Supplier intelligence notes ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
          Supplier intelligence notes
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <InsightCard title="Regional supplier density">
            <strong className="text-slate-200">Zhejiang</strong>,{" "}
            <strong className="text-slate-200">Jiangsu</strong>,{" "}
            <strong className="text-slate-200">Guangdong</strong>, and{" "}
            <strong className="text-slate-200">Shandong</strong> are useful
            starting regions for elderly care and rehabilitation device
            sourcing, accounting for{" "}
            <strong className="text-slate-200">
              {keyProvinceSupplierCount}
            </strong>{" "}
            of {metrics.totalSuppliers} demo suppliers. Coastal manufacturing
            bases and established port access keep lead times and logistics
            predictable for overseas buyers.
          </InsightCard>

          <InsightCard title="Export readiness variation">
            Export readiness differs markedly across the supplier base, driven
            by product category, certification completeness, communication
            quality, and previous export experience. Suppliers with{" "}
            <strong className="text-slate-200">ISO 13485</strong>,{" "}
            <strong className="text-slate-200">CE</strong>, and{" "}
            <strong className="text-slate-200">FDA 510(k)</strong> coverage plus
            a dedicated export function are typically the most straightforward to
            engage.
          </InsightCard>

          <InsightCard title="Audit prioritization">
            <strong className="text-slate-200">
              {suppliersNeedingAudit.length}
            </strong>{" "}
            suppliers carry medium readiness or incomplete certification and
            should be prioritized for desktop review or a site visit before
            procurement. On-site verification is recommended for any
            quality-sensitive or higher-complexity product line.
          </InsightCard>

          <InsightCard title="Procurement opportunity">
            <strong className="text-slate-200">Mobility aids</strong>,{" "}
            <strong className="text-slate-200">care furniture</strong>, and{" "}
            <strong className="text-slate-200">home care devices</strong> offer
            broad supplier coverage and competitive readiness, making them
            suitable starting categories for an initial overseas procurement
            evaluation.
          </InsightCard>
        </div>
      </section>

      {/* ── C & D. Filters + supplier cards ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
          Selected supplier intelligence records
        </h2>
        <p className="mt-3 max-w-3xl text-[13px] leading-7 text-slate-400">
          Showing selected demo supplier records across elderly care and
          rehabilitation device categories.
        </p>
        <div className="mt-6">
          <CareSupplierExplorer suppliers={suppliers} provinces={provinces} />
        </div>
        <p className="mt-10 border-t border-slate-900 pt-6 text-[11px] leading-6 text-slate-600">
          Jianji Care™ is a supplier intelligence and evaluation demo. It is not
          a public marketplace or product catalog.
        </p>
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
          const sharePct = total > 0 ? Math.round((bucket.count / total) * 100) : 0;
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
