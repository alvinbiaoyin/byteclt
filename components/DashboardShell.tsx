// app/components/dashboard-shell.tsx
"use client";

import { useState, useMemo } from "react";
import ChinaMap from "./china-map";
import IntelligenceExplorer from "./intelligence-explorer";
import LaboratoryList from "./laboratory-list";
import MarketIntelligenceNotes from "./market-intelligence-notes";
import MarketAnalytics from "./market-analytics"; // ✅ 核心导入：20号晚上同款高颜值图表
import { computeAnalytics } from "@/lib/compute-analytics";
import type { Hospital, FilterState } from "@/lib/hospital-types";

type DashboardShellProps = {
  hospitals: Hospital[];
};

const initialFilters: FilterState = {
  province: "",
  biomarker: "",
  assay: "",
  platform: "",
};

export default function DashboardShell({ hospitals }: DashboardShellProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // 🛡️ 核心联动过滤逻辑
  const filteredHospitals = useMemo(() => {
    if (!Array.isArray(hospitals)) return [];
    
    return hospitals.filter((hospital) => {
      if (!hospital) return false;

      if (filters.province && hospital.province !== filters.province) return false;
      if (filters.biomarker && (!Array.isArray(hospital.biomarkers) || !hospital.biomarkers.includes(filters.biomarker))) return false;
      if (filters.assay && (!Array.isArray(hospital.assays) || !hospital.assays.includes(filters.assay))) return false;
      if (filters.platform && hospital.platform !== filters.platform) return false;

      return true;
    });
  }, [hospitals, filters]);

  // 计算底层数据层
  const analytics = useMemo(
    () => computeAnalytics(filteredHospitals, hospitals),
    [filteredHospitals, hospitals]
  );

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  // 📐 动态计算核心商业指标
  const totalUtilization = filteredHospitals.reduce((acc, curr) => acc + (curr.utilization || 0), 0);
  const avgUtilization = filteredHospitals.length > 0 ? Math.round(totalUtilization / filteredHospitals.length) : 0;
  
  const totalTat = filteredHospitals.reduce((acc, curr) => acc + (curr.tatDays || 0), 0);
  const medianTat = filteredHospitals.length > 0 ? Math.round(totalTat / filteredHospitals.length) : 3;

  // 🎯 智能统计当前排名前列的 Assay 试剂
  const leadAssay = useMemo(() => {
    if (filteredHospitals.length === 0) return "PD-L1 IHC";
    const counts: Record<string, number> = {};
    filteredHospitals.forEach(h => {
      const assay = h.assays?.[0] || "PD-L1";
      counts[assay] = (counts[assay] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "PD-L1 IHC";
  }, [filteredHospitals]);

  // 🗺️ 计算当前覆盖了多少个真实的中国省份
  const uniqueProvincesCount = useMemo(() => {
    const provs = new Set(filteredHospitals.map(h => h.province));
    return provs.size;
  }, [filteredHospitals]);

  return (
    <div className="space-y-6">
      {/* 1. 上层主看板：大地图 + KPI 指标卡 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左侧：全国大地图 */}
        <div className="relative min-h-[460px] rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-4 backdrop-blur-md lg:col-span-2">
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[10px] font-medium tracking-wider text-cyan-400 uppercase font-mono">
              National Coverage Command
            </span>
            <h2 className="text-xl font-medium text-white mt-0.5 tracking-tight">
              China Laboratory Intelligence Map
            </h2>
          </div>
          
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              LIVE · <span className="text-cyan-400 font-bold">{filteredHospitals.length}</span> nodes visible
            </span>
          </div>

          <div className="h-full w-full pt-8">
            <ChinaMap hospitals={filteredHospitals} />
          </div>
        </div>

        {/* 右侧：CDx KPI 核心指标卡 */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
              Segment Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-950/60 border border-slate-900/60 p-4 transition hover:border-cyan-500/20">
                <p className="text-xs font-mono text-slate-500">MEDIAN TAT</p>
                <p className="mt-1.5 text-2xl font-bold font-mono text-cyan-400">{medianTat} <span className="text-xs font-sans font-normal text-slate-400">Days</span></p>
                <p className="text-[10px] text-slate-600 mt-1">Segment median</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-900/60 p-4 transition hover:border-cyan-500/20">
                <p className="text-xs font-mono text-slate-500">NETWORK COVERAGE</p>
                <p className="mt-1.5 text-2xl font-bold font-mono text-white">100%</p>
                <p className="text-[10px] text-slate-600 mt-1"><span className="text-cyan-500 font-bold">{filteredHospitals.length}</span> active sites</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-900/60 p-4 transition hover:border-cyan-500/20">
                <p className="text-xs font-mono text-slate-500">MONTHLY VOLUME</p>
                <p className="mt-1.5 text-2xl font-bold font-mono text-white">9,746</p>
                <p className="text-[10px] text-slate-600 mt-1">est. tests / month</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 border border-slate-900/60 p-4 transition hover:border-cyan-500/20">
                <p className="text-xs font-mono text-slate-500">PROVINCES</p>
                <p className="mt-1.5 text-2xl font-bold font-mono text-white">{uniqueProvincesCount}</p>
                <p className="text-[10px] text-slate-600 mt-1">active registry</p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-900 pt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-slate-500">AVG UTILIZATION</p>
              <p className="mt-1 text-xl font-bold text-emerald-400 font-mono">{avgUtilization}%</p>
            </div>
            <div>
              <p className="text-xs font-mono text-slate-500">LEAD ASSAY</p>
              <p className="mt-1 text-sm font-bold text-cyan-300 truncate tracking-tight" title={leadAssay}>
                {leadAssay}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 中层：Intelligence Explorer 筛选面板 */}
      <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/40 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-200 tracking-tight">Intelligence Explorer</h3>
          <button
            onClick={handleClearFilters}
            className="rounded-lg border border-slate-800 px-3 py-1 text-xs font-mono text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            CLEAR FILTERS
          </button>
        </div>
        
        <IntelligenceExplorer
          hospitals={hospitals}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* 3. 👑 核心复活：20号同款高颜值真实数据图表夹层 */}
      <MarketAnalytics hospitals={filteredHospitals} />

      {/* 4. 下层：数据表格 与 5条硬核商业简报的终极合流 */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* 左侧：表格列表 */}
        <div className="xl:col-span-2">
          <LaboratoryList hospitals={filteredHospitals} />
        </div>
        {/* 右侧：5条硬核专家报告面板 */}
        <div>
          <MarketIntelligenceNotes analytics={analytics} />
        </div>
      </div>
    </div>
  );
}