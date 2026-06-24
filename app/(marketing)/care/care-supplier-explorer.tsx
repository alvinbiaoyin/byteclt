"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  AuditStatus,
  CareSupplier,
  ProductCategory,
  ReadinessLevel,
} from "@/lib/jianji-care-data";
import {
  AUDIT_STATUSES,
  PRODUCT_CATEGORIES,
  READINESS_LEVELS,
} from "@/lib/jianji-care-data";

// Client-side supplier explorer: four independent filters (product category,
// province, readiness level, audit status) over the mock supplier set, plus
// the supplier card grid. The page passes the full dataset down; all filtering
// happens in the browser so the demo needs no backend.

const ALL = "All" as const;
type AllOption = typeof ALL;

type CategoryFilter = ProductCategory | AllOption;
type ProvinceFilter = string;
type ReadinessFilter = ReadinessLevel | AllOption;
type AuditFilter = AuditStatus | AllOption;

interface CareSupplierExplorerProps {
  suppliers: CareSupplier[];
  provinces: string[];
}

// Keep the demo compact: show at most this many supplier cards by default,
// both for the full set and any filtered result.
const MAX_VISIBLE = 8;

const READINESS_BADGE: Record<ReadinessLevel, string> = {
  High: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300",
  Medium: "border-amber-500/40 bg-amber-950/40 text-amber-300",
  Low: "border-rose-500/40 bg-rose-950/40 text-rose-300",
};

const RISK_BADGE: Record<CareSupplier["riskLevel"], string> = {
  Low: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300",
  Medium: "border-amber-500/40 bg-amber-950/40 text-amber-300",
  High: "border-rose-500/40 bg-rose-950/40 text-rose-300",
};

const AUDIT_DOT: Record<AuditStatus, string> = {
  "Not audited": "bg-rose-400",
  "Desktop reviewed": "bg-amber-400",
  "Site visited": "bg-cyan-400",
  "Formal audit completed": "bg-emerald-400",
};

const selectClass =
  "w-full appearance-none rounded-sm border border-slate-800 bg-slate-900/60 px-3 py-2 text-[13px] text-slate-200 transition-colors focus:border-cyan-500/60 focus:outline-none";

const labelClass =
  "mb-1.5 block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500";

export default function CareSupplierExplorer({
  suppliers,
  provinces,
}: CareSupplierExplorerProps) {
  const [category, setCategory] = useState<CategoryFilter>(ALL);
  const [province, setProvince] = useState<ProvinceFilter>(ALL);
  const [readiness, setReadiness] = useState<ReadinessFilter>(ALL);
  const [audit, setAudit] = useState<AuditFilter>(ALL);

  const filtered = useMemo(() => {
    return suppliers.filter((supplier) => {
      if (category !== ALL && !supplier.productCategories.includes(category)) {
        return false;
      }
      if (province !== ALL && supplier.province !== province) return false;
      if (readiness !== ALL && supplier.overallReadiness !== readiness) {
        return false;
      }
      if (audit !== ALL && supplier.auditStatus !== audit) return false;
      return true;
    });
  }, [suppliers, category, province, readiness, audit]);

  const resetFilters = () => {
    setCategory(ALL);
    setProvince(ALL);
    setReadiness(ALL);
    setAudit(ALL);
  };

  const hasActiveFilter =
    category !== ALL ||
    province !== ALL ||
    readiness !== ALL ||
    audit !== ALL;

  const visible = filtered.slice(0, MAX_VISIBLE);

  return (
    <div>
      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className="rounded-sm border border-slate-800/80 bg-slate-900/30 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass} htmlFor="filter-category">
              Product category
            </label>
            <select
              id="filter-category"
              className={selectClass}
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CategoryFilter)
              }
            >
              <option value={ALL}>All categories</option>
              {PRODUCT_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="filter-province">
              Province
            </label>
            <select
              id="filter-province"
              className={selectClass}
              value={province}
              onChange={(event) => setProvince(event.target.value)}
            >
              <option value={ALL}>All provinces</option>
              {provinces.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="filter-readiness">
              Readiness level
            </label>
            <select
              id="filter-readiness"
              className={selectClass}
              value={readiness}
              onChange={(event) =>
                setReadiness(event.target.value as ReadinessFilter)
              }
            >
              <option value={ALL}>All readiness levels</option>
              {READINESS_LEVELS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="filter-audit">
              Audit status
            </label>
            <select
              id="filter-audit"
              className={selectClass}
              value={audit}
              onChange={(event) => setAudit(event.target.value as AuditFilter)}
            >
              <option value={ALL}>All audit stages</option>
              {AUDIT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[12px] font-mono text-slate-500">
            Showing{" "}
            <span className="text-cyan-300">{visible.length}</span> of{" "}
            {filtered.length} suppliers
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-cyan-200"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ── Supplier cards ───────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <p className="mt-6 rounded-sm border border-slate-800/80 bg-slate-900/30 px-6 py-16 text-center text-sm text-slate-500">
          No suppliers match the current filter combination.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: CareSupplier }) {
  return (
    <article className="flex flex-col rounded-sm border border-slate-800/80 bg-slate-900/40 p-5 transition-colors hover:border-cyan-500/40">
      <header>
        <h3 className="text-[15px] font-medium leading-snug text-slate-100">
          {supplier.supplierName}
        </h3>
        <p className="mt-1 text-[12px] text-slate-500">
          {supplier.city}, {supplier.province}
        </p>
      </header>

      <div className="mt-4">
        <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
          Product categories
        </dt>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {supplier.productCategories.map((cat) => (
            <span
              key={cat}
              className="rounded-sm border border-slate-700/60 bg-slate-800/50 px-2 py-0.5 text-[11px] text-slate-300"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <dl className="mt-4 space-y-3 text-[12px]">
        <Field label="Key products">
          {supplier.keyProducts.join(" · ")}
        </Field>
        <Field label="Certification profile">
          {supplier.certifications.join(", ")}
        </Field>
        <Field label="Export markets">
          {supplier.exportMarkets.join(", ")}
        </Field>
        <Field label="Factory type">{supplier.factoryType}</Field>
        <div className="flex items-center gap-2">
          <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
            Audit status
          </dt>
          <dd className="flex items-center gap-1.5 text-slate-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${AUDIT_DOT[supplier.auditStatus]}`}
            />
            {supplier.auditStatus}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className={READINESS_BADGE[supplier.overallReadiness]}>
          Readiness: {supplier.overallReadiness}
        </Badge>
        <Badge className={RISK_BADGE[supplier.riskLevel]}>
          Risk level: {supplier.riskLevel}
        </Badge>
      </div>

      <p className="mt-4 border-t border-slate-800/80 pt-4 text-[12px] leading-6 text-slate-400">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          BYTE assessment note
        </span>
        <br />
        {supplier.byteAssessmentNote}
      </p>
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-slate-300">{children}</dd>
    </div>
  );
}

function Badge({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`rounded-sm border px-2 py-0.5 text-[11px] font-medium ${className}`}
    >
      {children}
    </span>
  );
}
