// app/components/laboratory-list.tsx
"use client";

import type { Hospital } from "@/lib/hospital-types";
import { classifyAssay, type RegulatoryClass } from "@/lib/regulatory-mapping";
import { resolveDetailedRegion } from "@/lib/region-mapping";

type LaboratoryListProps = {
  hospitals: Hospital[];
  // "featured" = curated default homepage view (intelligence signal density)
  // "filtered" = active exploration view (full filtered result set)
  mode?: "featured" | "filtered";
};

export default function LaboratoryList({
  hospitals,
  mode = "filtered",
}: LaboratoryListProps) {
  const safeLength = Array.isArray(hospitals) ? hospitals.length : 0;

  const title =
    mode === "featured"
      ? "Featured Testing Institutions"
      : `${safeLength} Institutions Matched`;
  const subtitle =
    mode === "featured"
      ? `Curated intelligence · ${safeLength} highlighted`
      : "Active segment view";

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between border-b border-slate-900 pb-2">
        <div className="flex items-baseline gap-3">
          <span className="text-[9px] font-mono text-slate-600 tabular-nums tracking-[0.25em]">
            / 03
          </span>
          <h3 className="text-sm font-medium text-slate-200 tracking-tight">
            {title}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          {subtitle}
        </span>
      </div>
      {renderBody(hospitals)}
    </div>
  );
}

function renderBody(hospitals: Hospital[]) {
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
        No matching laboratory nodes found in this segment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {hospitals.map((lab) => (
        <EntityTile key={lab.id} lab={lab} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tactical Intelligence Entity Tile — Palantir/Bloomberg-Neo terminal feel.
//   • Left edge: 2px color-coded accent strip (entity-type signal)
//   • Top-right: tactical registration tick
//   • Primary: institution name (uppercase, slate-100)
//   • Secondary: type · region (mono caps, slate-500)
//   • Tertiary: assay / platform / workflow (data rows, slate-300)
//   • Badges: regulatory + reimbursement only (NEVER duplicates subtitle)
// Missing fields are omitted entirely — no "N/A", no fake telemetry.
// ─────────────────────────────────────────────────────────────────────────

function EntityTile({ lab }: { lab: Hospital }) {
  const entity = resolveEntityType(lab);
  const region = resolveDetailedRegion(lab.province);

  const secondaryParts = [entity.label, region].filter(
    (v): v is string => Boolean(v)
  );

  const validAssays = (Array.isArray(lab.assays) ? lab.assays : []).filter(
    (a) => a && a !== "NULL" && a.trim() !== ""
  );
  const regulatoryClasses = classifyAssays(validAssays);

  const assayLine = formatAssayLine(validAssays);
  const platformLine =
    lab.platform && lab.platform.trim()
      ? `${lab.platform.trim()} Platform`
      : null;
  const workflowLine = formatWorkflowLine(regulatoryClasses);

  const tertiaryLines = [assayLine, platformLine, workflowLine].filter(
    (v): v is string => Boolean(v)
  );

  const badges = buildBadges(lab, regulatoryClasses);

  return (
    <article className="group relative flex min-h-[180px] flex-col overflow-hidden rounded-md border border-slate-800/60 bg-gradient-to-b from-slate-900/45 to-slate-950/95 transition-all duration-200 hover:border-cyan-500/30 hover:shadow-[0_0_24px_rgba(34,211,238,0.07)]">
      {/* Left tactical accent strip — color-coded by entity type */}
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-[2px] ${accentClassFor(entity.type)}`}
      />

      {/* Top-right tactical registration mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1.5 right-1.5 h-1.5 w-1.5 border-t border-r border-slate-700/60"
      />

      <div className="flex flex-1 flex-col p-4 pl-5">
        <h4 className="text-[13px] font-semibold uppercase tracking-tight text-slate-100 line-clamp-2 leading-snug">
          {lab.name || "Unnamed Institution"}
        </h4>

        {secondaryParts.length > 0 && (
          <p className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
            {secondaryParts.join(" · ")}
          </p>
        )}

        {tertiaryLines.length > 0 && (
          <>
            <div className="my-3 h-px bg-gradient-to-r from-slate-800/80 via-slate-900 to-transparent" />
            <div className="space-y-1 text-[11px] font-mono leading-relaxed">
              {tertiaryLines.map((line, i) => (
                <p key={i} className="truncate text-slate-300" title={line}>
                  {line}
                </p>
              ))}
            </div>
          </>
        )}

        {badges.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {badges.map((b) => (
              <EntityBadge key={b.label} label={b.label} tone={b.tone} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Entity type resolution & visual encoding ───────────────────────────

type EntityType =
  | "national-cancer"
  | "teaching-hospital"
  | "commercial-lab"
  | "other";

function resolveEntityType(lab: Hospital): {
  type: EntityType;
  label: string | null;
} {
  if (isNationalCancerCenter(lab.name)) {
    return { type: "national-cancer", label: "National Cancer Center" };
  }
  const upper = (lab.labType || "").trim().toUpperCase();
  if (upper === "HOSPITAL") {
    return { type: "teaching-hospital", label: "Teaching Hospital" };
  }
  if (upper === "COMMERCIAL") {
    return { type: "commercial-lab", label: "Commercial Reference Lab" };
  }
  if (upper && upper !== "UNKNOWN") {
    return { type: "other", label: capitalize(lab.labType) };
  }
  return { type: "other", label: null };
}

function isNationalCancerCenter(name: string | undefined): boolean {
  if (!name) return false;
  const n = name.toLowerCase();
  return (
    n.includes("national cancer") ||
    n.includes("cancer hospital") ||
    n.includes("cancer center") ||
    n.includes("cancer institute") ||
    n.includes("肿瘤医院") ||
    n.includes("肿瘤中心")
  );
}

function accentClassFor(type: EntityType): string {
  switch (type) {
    case "national-cancer":
      return "bg-violet-500/45 shadow-[2px_0_12px_-2px_rgba(139,92,246,0.4)]";
    case "teaching-hospital":
      return "bg-cyan-500/45 shadow-[2px_0_12px_-2px_rgba(34,211,238,0.4)]";
    case "commercial-lab":
      return "bg-amber-500/45 shadow-[2px_0_12px_-2px_rgba(245,158,11,0.4)]";
    case "other":
    default:
      return "bg-slate-700/50";
  }
}

// ─── Assay / regulatory formatting ──────────────────────────────────────

// Strip leading "PD-L1 IHC", "PD-L1", or "IHC" prefixes so that re-prefixing
// with "PD-L1" does not produce "PD-L1 IHC PD-L1 IHC 22C3".
function stripAssayPrefix(raw: string): string {
  return raw
    .replace(/^\s*PD-?L1\s*IHC\s*/i, "")
    .replace(/^\s*PD-?L1\s*/i, "")
    .replace(/^\s*IHC\s*/i, "")
    .trim();
}

function formatAssayLine(validAssays: string[]): string | null {
  if (validAssays.length === 0) return null;
  const clones = validAssays.map(stripAssayPrefix).filter(Boolean);
  if (clones.length === 0) return null;
  return `PD-L1 ${clones.join(" / ")}`;
}

function classifyAssays(validAssays: string[]): Set<RegulatoryClass> {
  const classes = new Set<RegulatoryClass>();
  for (const a of validAssays) {
    const cls = classifyAssay(a);
    if (cls !== "Unclassified") classes.add(cls);
  }
  return classes;
}

function formatWorkflowLine(classes: Set<RegulatoryClass>): string | null {
  if (classes.size === 0) return null;
  return `${Array.from(classes).join(" + ")} workflow`;
}

// ─── Badges — never duplicate subtitle ──────────────────────────────────
// Subtitle already encodes institution type + region, so badges are reserved
// for orthogonal signals: regulatory class and reimbursement status.

type BadgeTone = "nmpa" | "ldt" | "ruo" | "reimbursed";

function buildBadges(
  lab: Hospital,
  classes: Set<RegulatoryClass>
): Array<{ label: string; tone: BadgeTone }> {
  const badges: Array<{ label: string; tone: BadgeTone }> = [];
  if (classes.has("NMPA-approved")) {
    badges.push({ label: "NMPA", tone: "nmpa" });
  }
  if (classes.has("LDT")) {
    badges.push({ label: "LDT", tone: "ldt" });
  }
  if (classes.has("RUO")) {
    badges.push({ label: "RUO", tone: "ruo" });
  }
  if (lab.reimbursementStatus === "YES") {
    badges.push({ label: "Reimbursed", tone: "reimbursed" });
  }
  return badges;
}

function EntityBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  const TONE_CLASS: Record<BadgeTone, string> = {
    nmpa: "border-cyan-700/70 bg-cyan-950/50 text-cyan-300/90 shadow-[inset_0_0_6px_rgba(34,211,238,0.08)]",
    ldt: "border-amber-700/60 bg-amber-950/45 text-amber-200/90 shadow-[inset_0_0_6px_rgba(245,158,11,0.06)]",
    ruo: "border-rose-800/60 bg-rose-950/45 text-rose-300/80",
    reimbursed:
      "border-emerald-700/60 bg-emerald-950/45 text-emerald-300/90 shadow-[inset_0_0_6px_rgba(16,185,129,0.06)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-[2px] border px-1.5 py-[2px] text-[9px] font-mono uppercase tracking-[0.2em] ${TONE_CLASS[tone]}`}
    >
      {label}
    </span>
  );
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}