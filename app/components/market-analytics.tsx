// app/components/market-analytics.tsx
"use client";

import { useMemo } from "react";
import type { Hospital } from "@/lib/hospital-types";
import { computeAnalytics } from "@/lib/compute-analytics";

type MarketAnalyticsProps = {
  hospitals: Hospital[];
};

export default function MarketAnalytics({ hospitals }: MarketAnalyticsProps) {
  // Operational snapshot for the new Platform / Regional / KPI panels.
  // Compute layer owns aggregation; render layer stays presentational.
  const snapshot = useMemo(
    () => computeAnalytics(hospitals, hospitals).marketAnalyticsSnapshot,
    [hospitals]
  );
  // 📊 1. 动态计算左侧环形图数据（精准过滤 NULL 与空值）
  const assayDistribution = useMemo(() => {
    if (hospitals.length === 0) return [];
    const counts: Record<string, number> = {};
    let validTotal = 0;

    hospitals.forEach((h) => {
      const assay = h.assays?.[0];
      // 🛡️ 核心清洗：严格过滤掉任何 null, undefined, "NULL" 或空字符串
      if (assay && assay !== "NULL" && assay.trim() !== "") {
        counts[assay] = (counts[assay] || 0) + 1;
        validTotal++;
      }
    });

    if (validTotal === 0) return [];

    let accumulatedPercent = 0;

    return Object.entries(counts).map(([name, count]) => {
      const percentage = Math.round((count / validTotal) * 100);
      const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;
      const rotation = (accumulatedPercent / 100) * 360;
      accumulatedPercent += percentage;

      return {
        name,
        count,
        percentage,
        strokeDashoffset,
        rotation
      };
    }).sort((a, b) => b.count - a.count); // 降序排列
  }, [hospitals]);

  // 📊 2. 动态计算右侧柱状图数据（完全百分比化体系）
  const tatDistribution = useMemo(() => {
    const counts: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 };
    const total = hospitals.length || 1;
    let maxPercent = 0;

    hospitals.forEach((h) => {
      const days = h.tatDays || 3;
      const bucket = days <= 2 ? 2 : days >= 5 ? 5 : Math.round(days);
      if (bucket in counts) {
        counts[bucket] += 1;
      }
    });

    const list = Object.entries(counts).map(([days, count]) => {
      const percent = Math.round((count / total) * 100);
      if (percent > maxPercent) maxPercent = percent;
      return {
        label: `${days} Days`,
        percent,
        key: Number(days)
      };
    });

    return { list, maxPercent: maxPercent || 1 };
  }, [hospitals]);

  // 🎨 环形图：剔除暗淡色，精选 6 种高饱和度高对比度的极客色阵
  const ringColors = [
    { text: "text-cyan-400", stroke: "#22d3ee", dot: "bg-cyan-400" },       // 1. 极光青
    { text: "text-indigo-400", stroke: "#818cf8", dot: "bg-indigo-400" },   // 2. 魅惑靛
    { text: "text-amber-400", stroke: "#fbbf24", dot: "bg-amber-400" },     // 3. 琥珀金
    { text: "text-emerald-400", stroke: "#34d399", dot: "bg-emerald-400" }, // 4. 翡翠绿
    { text: "text-fuchsia-500", stroke: "#d946ef", dot: "bg-fuchsia-500" }, // 5. 迷幻紫
    { text: "text-rose-400", stroke: "#f43f5e", dot: "bg-rose-400" },       // 6. 烈焰红
  ];

  // 🎨 柱状图时效色彩系统
  const getTatBarColor = (days: number) => {
    switch(days) {
      case 2: return "from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:from-emerald-400 group-hover:to-teal-300";
      case 3: return "from-cyan-500 to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:from-cyan-400 group-hover:to-blue-300";
      case 4: return "from-violet-500 to-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.2)] group-hover:from-violet-400 group-hover:to-purple-300";
      case 5: return "from-amber-500 to-rose-500 shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:from-amber-400 group-hover:to-rose-400";
      default: return "from-cyan-600 to-cyan-400";
    }
  };

  const getTatTextColor = (days: number) => {
    switch(days) {
      case 2: return "text-emerald-400";
      case 3: return "text-cyan-400";
      case 4: return "text-violet-400";
      case 5: return "text-amber-400 font-bold";
      default: return "text-slate-300";
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <h3 className="text-sm font-medium text-slate-200 tracking-tight">Market Analytics</h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Real-Time CDx Matrix</span>
      </div>

      {/* 🛰️ KPI strip — terminal-style segment summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <KpiCell
          label="Active Institutions"
          value={String(snapshot.kpis.totalInstitutions)}
        />
        <KpiCell
          label="Provinces Covered"
          value={String(snapshot.kpis.totalProvinces)}
        />
        <KpiCell
          label="Dominant Platform"
          value={snapshot.kpis.dominantPlatform ?? "—"}
          accent="amber"
        />
        <KpiCell
          label="Top Region"
          value={snapshot.kpis.mostConcentratedRegion ?? "—"}
          accent="cyan"
        />
      </div>

      {/* ═══ PRIMARY INTELLIGENCE — Platform Concentration + Regional Matrix ═══ */}
      <PrimaryIntelligenceRow snapshot={snapshot} />

      {/* ═══ OPERATIONAL METRICS — Methodology + TAT (existing) ═══ */}
      <SectionCaption code="02" label="Operational Metrics" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-1">
        
        {/* 🧭 左侧：方法学环形比例图 */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <p className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-wider">Methodology Distribution</p>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-full py-1">
            
            {/* 🔮 SVG 真实多色环形 */}
            <div className="relative h-32 w-32 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#090d16" strokeWidth="8" fill="transparent" />
                
                {assayDistribution.map((item, index) => {
                  const color = ringColors[index % ringColors.length];
                  return (
                    <circle
                      key={item.name}
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={color.stroke}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={item.strokeDashoffset}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        transformOrigin: "50px 50px",
                        transform: `rotate(${item.rotation}deg)`,
                      }}
                    />
                  );
                })}
              </svg>

              {/* 中央核心指标 */}
              <div className="absolute text-center">
                <p className="text-2xl font-bold font-mono text-white tracking-tight">{hospitals.length}</p>
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold leading-tight">Total<br/>Methodologies</p>
              </div>
            </div>

            {/* 右侧：纯净版真实 6 大商业方法学图例 */}
            <div className="space-y-1.5 flex-1 w-full max-w-xs sm:max-w-[260px]">
              {assayDistribution.map((item, index) => {
                const color = ringColors[index % ringColors.length];
                return (
                  <div key={item.name} className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-2 truncate mr-2" title={item.name}>
                      <span className={`h-2 w-2 rounded-full shadow-[0_0_6px_currentColor] flex-shrink-0 ${color.dot} ${color.text}`} />
                      <span className="text-slate-400 truncate tracking-tight">{item.name}</span>
                    </div>
                    <span className={`font-bold font-mono tracking-tight flex-shrink-0 ${color.text}`}>{item.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 📊 右侧：多色四阶时效柱状图 */}
        <div className="lg:col-span-5">
          <p className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-wider">TAT Distribution (%)</p>
          <div className="flex items-end justify-between h-36 pt-4 px-2 border-b border-slate-900">
            {tatDistribution.list.map((item) => {
              const barHeight = Math.max((item.percent / tatDistribution.maxPercent) * 100, 6);
              const barColorClasses = getTatBarColor(item.key);
              const textColorClass = getTatTextColor(item.key);

              return (
                <div key={item.label} className="flex flex-col items-center gap-1.5 flex-1 group">
                  <span className={`text-[10px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mb-1 ${textColorClass}`}>
                    {item.percent}%
                  </span>
                  
                  <div 
                    className={`w-11 sm:w-12 rounded-t-md bg-gradient-to-t transition-all duration-700 ${barColorClasses}`}
                    style={{ height: `${barHeight}px` }} 
                  />
                  
                  <span className={`text-[10px] font-mono font-bold ${textColorClass}`}>
                    {item.percent}%
                  </span>
                  
                  <span className="text-[10px] font-mono text-slate-500 pb-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PRIMARY INTELLIGENCE row — Platform Concentration + Regional Matrix.
// Bloomberg / Palantir terminal aesthetic: dominance headline,
// segmented concentration block, ranked intelligence matrix with heat pips.
// ─────────────────────────────────────────────────────────────────────────

function PrimaryIntelligenceRow({
  snapshot,
}: {
  snapshot: ReturnType<
    typeof import("@/lib/compute-analytics").computeAnalytics
  >["marketAnalyticsSnapshot"];
}) {
  const topPlatform = snapshot.platformDistribution[0] ?? null;
  const totalPlatforms = snapshot.platformDistribution.length;

  return (
    <>
      <SectionCaption code="01" label="Primary Intelligence" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
        {/* ── Platform Concentration ── */}
        <div className="lg:col-span-5">
          <PanelHeader label="Platform Concentration" sub="Market Share" />

          {!topPlatform ? (
            <p className="mt-3 text-[10px] font-mono text-slate-600">
              No platforms reported in current segment.
            </p>
          ) : (
            <>
              {/* Dominance headline */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-mono font-semibold text-amber-200/90 tracking-tight tabular-nums">
                  {Math.round(topPlatform.sharePercent)}
                  <span className="text-xl text-amber-200/60">%</span>
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
                    Dominant
                  </span>
                  <span className="text-xs font-mono text-slate-200 font-semibold tracking-tight uppercase">
                    {topPlatform.platform}
                  </span>
                </div>
              </div>

              {/* Segmented concentration block */}
              <div className="mt-4 flex h-6 w-full overflow-hidden rounded-sm border border-slate-800 bg-slate-950/80">
                {snapshot.platformDistribution.map((item, index) => (
                  <PlatformSegment
                    key={item.platform}
                    platform={item.platform}
                    sharePercent={item.sharePercent}
                    rank={index}
                    isLast={index === totalPlatforms - 1}
                  />
                ))}
              </div>

              {/* Detail rows */}
              <div className="mt-4 space-y-1.5">
                {snapshot.platformDistribution.map((item, index) => (
                  <PlatformDetailRow
                    key={item.platform}
                    platform={item.platform}
                    sharePercent={item.sharePercent}
                    institutionCount={item.institutionCount}
                    rank={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Regional Intelligence Matrix ── */}
        <div className="lg:col-span-7">
          <PanelHeader
            label="Regional Intelligence Matrix"
            sub="Network Concentration"
          />

          <div className="mt-3 rounded-sm border border-slate-900 bg-slate-950/70 divide-y divide-slate-900">
            {/* Matrix header */}
            <div className="grid grid-cols-[28px_1fr_auto_56px_64px] items-center gap-3 px-3 py-1.5">
              <span className="text-[8px] font-mono text-slate-600 tracking-[0.25em]">
                RK
              </span>
              <span className="text-[8px] font-mono text-slate-600 tracking-[0.25em]">
                REGION
              </span>
              <span className="text-[8px] font-mono text-slate-600 tracking-[0.25em]">
                HEAT
              </span>
              <span className="text-right text-[8px] font-mono text-slate-600 tracking-[0.25em]">
                SHARE
              </span>
              <span className="text-right text-[8px] font-mono text-slate-600 tracking-[0.25em]">
                INST
              </span>
            </div>

            {snapshot.regionalDistribution.map((item, index) => (
              <RegionMatrixRow
                key={item.region}
                rank={index}
                region={item.region}
                sharePercent={item.sharePercent}
                institutionCount={item.institutionCount}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Compact key/value cell used by the KPI strip.
// Accent param ties cells to downstream panel palette (amber = platform,
// cyan = region) for cross-section visual consistency.
function KpiCell({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string;
  accent?: "default" | "amber" | "cyan";
}) {
  const valueTone =
    accent === "amber"
      ? "text-amber-200/90"
      : accent === "cyan"
      ? "text-cyan-200"
      : "text-slate-100";
  return (
    <div className="rounded-sm border border-slate-800 bg-slate-950/70 px-3 py-2">
      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-mono font-semibold tracking-tight truncate ${valueTone}`}
      >
        {value}
      </p>
    </div>
  );
}

// Bloomberg-style sectional caption: "/ NN  LABEL ────────────"
function SectionCaption({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[9px] font-mono text-slate-600 tabular-nums tracking-[0.25em]">
        / {code}
      </span>
      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">
        {label}
      </span>
      <span className="flex-1 h-px bg-gradient-to-r from-slate-800 via-slate-900 to-transparent" />
    </div>
  );
}

function PanelHeader({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <p className="text-[10px] font-mono text-slate-300 uppercase tracking-[0.2em]">
        {label}
      </p>
      <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">
        {sub}
      </span>
    </div>
  );
}

// Single segment inside the platform concentration block.
// Rank 0 = dim amber (dominance), rank 1 = muted steel cyan, rest = graphite.
function PlatformSegment({
  platform,
  sharePercent,
  rank,
  isLast,
}: {
  platform: string;
  sharePercent: number;
  rank: number;
  isLast: boolean;
}) {
  const tone =
    rank === 0
      ? "bg-amber-600/35"
      : rank === 1
      ? "bg-cyan-800/45"
      : "bg-slate-700/40";
  const border = isLast ? "" : "border-r border-slate-950";
  const textTone = rank === 0 ? "text-amber-100/90" : "text-slate-300/80";

  return (
    <div
      className={`${tone} ${border} flex items-center justify-center overflow-hidden transition-all duration-300`}
      style={{ width: `${sharePercent}%` }}
      title={`${platform} · ${Math.round(sharePercent)}%`}
    >
      {sharePercent >= 10 && (
        <span
          className={`${textTone} truncate px-1 text-[9px] font-mono uppercase tracking-wider`}
        >
          {platform}
        </span>
      )}
    </div>
  );
}

function PlatformDetailRow({
  platform,
  sharePercent,
  institutionCount,
  rank,
}: {
  platform: string;
  sharePercent: number;
  institutionCount: number;
  rank: number;
}) {
  const dotTone =
    rank === 0 ? "bg-amber-500" : rank === 1 ? "bg-cyan-700" : "bg-slate-600";
  const pctTone =
    rank === 0 ? "text-amber-200/90 font-semibold" : "text-slate-300";

  return (
    <div className="flex items-center justify-between text-[10px] font-mono">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`h-1.5 w-1.5 rounded-full ${dotTone} flex-shrink-0`} />
        <span className="text-slate-400 uppercase tracking-wider truncate">
          {platform}
        </span>
      </div>
      <div className="flex items-baseline gap-3 tabular-nums flex-shrink-0">
        <span className="text-slate-600">{institutionCount} inst</span>
        <span className={pctTone}>{Math.round(sharePercent)}%</span>
      </div>
    </div>
  );
}

// Single row of the regional intelligence matrix.
// Top rank gets row-level cyan heat tint; pips render an 8-cell heat indicator.
function RegionMatrixRow({
  rank,
  region,
  sharePercent,
  institutionCount,
}: {
  rank: number;
  region: string;
  sharePercent: number;
  institutionCount: number;
}) {
  const isTop = rank === 0;
  const isMuted = institutionCount === 0;
  const rowTone = isTop
    ? "bg-cyan-950/40"
    : rank === 1
    ? "bg-cyan-950/15"
    : "";
  const rawPips = Math.round((sharePercent / 100) * 8);
  const visiblePips =
    institutionCount > 0 ? Math.max(1, Math.min(8, rawPips)) : 0;

  return (
    <div
      className={`grid grid-cols-[28px_1fr_auto_56px_64px] items-center gap-3 px-3 py-2 ${rowTone} ${
        isMuted ? "opacity-30" : ""
      }`}
    >
      <span
        className={`text-[10px] font-mono tabular-nums ${
          isTop ? "text-amber-200/80 font-semibold" : "text-slate-500"
        }`}
      >
        {String(rank + 1).padStart(2, "0")}
      </span>

      <span
        className={`text-[11px] font-mono uppercase tracking-wide truncate ${
          isTop ? "text-slate-100 font-semibold" : "text-slate-300"
        }`}
      >
        {region}
      </span>

      <div className="flex gap-0.5">
        {Array.from({ length: 8 }, (_, i) => {
          const filled = i < visiblePips;
          const cellTone = filled
            ? isTop
              ? "bg-cyan-400/70 shadow-[0_0_4px_rgba(34,211,238,0.35)]"
              : rank === 1
              ? "bg-cyan-600/60"
              : "bg-cyan-800/55"
            : "bg-slate-900 border border-slate-800/70";
          return (
            <span
              key={i}
              className={`h-3 w-1.5 rounded-[1px] ${cellTone}`}
            />
          );
        })}
      </div>

      <span
        className={`text-right text-[11px] font-mono tabular-nums ${
          isTop ? "text-cyan-200" : "text-slate-300"
        }`}
      >
        {Math.round(sharePercent)}%
      </span>

      <span className="text-right text-[10px] font-mono text-slate-500 tabular-nums">
        {institutionCount} inst
      </span>
    </div>
  );
}