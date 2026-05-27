// app/components/market-analytics.tsx
"use client";

import { useMemo } from "react";
import type { Hospital } from "@/lib/hospital-types";

type MarketAnalyticsProps = {
  hospitals: Hospital[];
};

export default function MarketAnalytics({ hospitals }: MarketAnalyticsProps) {
  // 📊 1. 动态计算左侧环形图数据（基于当前筛选下的克隆号/试剂占比）
  const assayDistribution = useMemo(() => {
    if (hospitals.length === 0) return [];
    const counts: Record<string, number> = {};
    hospitals.forEach((h) => {
      const assay = h.assays?.[0] || "Unknown";
      counts[assay] = (counts[assay] || 0) + 1;
    });

    const total = hospitals.length;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    })).sort((a, b) => b.count - a.count);
  }, [hospitals]);

  // 📊 2. 动态计算右侧柱状图数据（基于真实 tat_days 的分布频次）
  const tatDistribution = useMemo(() => {
    const counts: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 };
    let maxCount = 0;

    hospitals.forEach((h) => {
      const days = h.tatDays || 3;
      // 归类到 2, 3, 4, 5 天
      const bucket = days <= 2 ? 2 : days >= 5 ? 5 : Math.round(days);
      if (bucket in counts) {
        counts[bucket] += 1;
      }
    });

    const list = Object.entries(counts).map(([days, count]) => {
      if (count > maxCount) maxCount = count;
      return {
        label: `${days} Days`,
        count,
      };
    });

    return { list, maxCount: maxCount || 1 };
  }, [hospitals]);

  // 🎨 环形图渐变色阵列
  const ringColors = [
    "border-cyan-500 text-cyan-400 bg-cyan-500/10",
    "border-blue-500 text-blue-400 bg-blue-500/10",
    "border-indigo-500 text-indigo-400 bg-indigo-500/10",
    "border-teal-500 text-teal-400 bg-teal-500/10",
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <h3 className="text-sm font-medium text-slate-200 tracking-tight">Market Analytics</h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Real-Time CDx Matrix</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* 🧭 左侧：20号晚上同款高颜值环形占比图 */}
        <div className="flex flex-col justify-between">
          <p className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-wider">Assay Distribution</p>
          <div className="flex items-center justify-around gap-4 h-full py-2">
            {/* 核心科技感双层圆环 */}
            <div className="relative h-32 w-32 flex items-center justify-center rounded-full border border-slate-900 bg-slate-950/50 shadow-inner">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-500/20 animate-[spin_20s_linear_infinite]" />
              {/* 环形核心数据播报 */}
              <div className="text-center z-10">
                <p className="text-2xl font-bold font-mono text-white tracking-tight">{hospitals.length}</p>
                <p className="text-[10px] font-mono text-slate-500 uppercase">Total Nodes</p>
              </div>
            </div>

            {/* 图例占比标签 */}
            <div className="space-y-2 flex-1 max-w-[180px]">
              {assayDistribution.slice(0, 4).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 truncate mr-2" title={item.name}>
                    <span className={`h-2 w-2 rounded-full ${ringColors[index % ringColors.length].split(" ")[1]}`} />
                    <span className="text-slate-400 truncate">{item.name}</span>
                  </div>
                  <span className="text-slate-200 font-bold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 📊 右侧：20号晚上同款青色立体柱状图 */}
        <div>
          <p className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-wider">TAT Distribution</p>
          <div className="flex items-end justify-between h-36 pt-4 px-2 border-b border-slate-900">
            {tatDistribution.list.map((item) => {
              const barHeight = Math.max((item.count / tatDistribution.maxCount) * 100, 8); // 兜底高度防止完全空着不好看
              return (
                <div key={item.label} className="flex flex-col items-center gap-2 flex-1 group">
                  {/* 悬浮数量气泡 */}
                  <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mb-1">
                    {item.count} sites
                  </span>
                  {/* 纯正青色科技感柱体 */}
                  <div className="w-12 sm:w-14 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-500 group-hover:from-cyan-500 group-hover:to-cyan-300"
                       style={{ height: `${barHeight}px` }} 
                  />
                  {/* 底部横轴刻度 */}
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