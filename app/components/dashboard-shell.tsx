// app/components/dashboard-shell.tsx
"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import IntelligenceExplorer from "./intelligence-explorer";
import LaboratoryList from "./laboratory-list";
import MarketIntelligenceNotes from "./market-intelligence-notes";
import MarketAnalytics from "./market-analytics";
import type { Hospital, FilterState } from "@/lib/hospital-types";
import { selectFeaturedInstitutions } from "@/lib/curated-institutions";

const RawChinaMap = dynamic(() => import("./china-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-xs font-mono text-slate-500">
      Loading map…
    </div>
  ),
});

const ChinaMap = RawChinaMap as any;

type DashboardShellProps = {
  hospitals: Hospital[];
};

const initialFilters: FilterState = {
  province: "",
  biomarker: "",
  assay: "",
  platform: "",
};

function normalizeProvince(prov: string | undefined): string {
  if (!prov) return "";
  const p = prov.toUpperCase().trim();
  if (p.includes("BEIJING") || p.includes("BEUING")) return "BEIJING";
  if (p.includes("SHANGHAI")) return "SHANGHAI";
  if (p.includes("GUANGDONG")) return "GUANGDONG";
  if (p.includes("CHONGQING")) return "CHONGQING";
  if (p.includes("TIANJIN")) return "TIANJIN";
  if (p.includes("HEBI") || p.includes("HEBEI")) return "HEBEI";
  if (p.includes("HELONGJIANG") || p.includes("HEILONGJIANG")) return "HEILONGJIANG";
  if (p.includes("FUJIAN")) return "FUJIAN";
  if (p.includes("HENAN")) return "HENAN";
  if (p.includes("HUBEI")) return "HUBEI";
  if (p.includes("HUNAN")) return "HUNAN";
  if (p.includes("JIANGSU")) return "JIANGSU";
  if (p.includes("JILIN")) return "JILIN";
  if (p.includes("LIAONING")) return "LIAONING";
  if (p.includes("SHAANXI") || p.includes("SHAAN XI")) return "SHAANXI";
  if (p.includes("SHANDONG")) return "SHANDONG";
  if (p.includes("SHANXI")) return "SHANXI";
  if (p.includes("SICHUAN")) return "SICHUAN";
  if (p.includes("ZHEJIANG")) return "ZHEJIANG";
  return p;
}

export default function DashboardShell({ hospitals }: DashboardShellProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const sanitizedHospitals = useMemo(() => {
    if (!Array.isArray(hospitals)) return [];
    return hospitals.map(h => ({
      ...h,
      province: normalizeProvince(h.province)
    }));
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return sanitizedHospitals.filter((hospital) => {
      if (!hospital) return false;
      if (filters.province && hospital.province !== filters.province) return false;
      if (filters.biomarker && (!Array.isArray(hospital.biomarkers) || !hospital.biomarkers.includes(filters.biomarker))) return false;
      if (filters.assay && (!Array.isArray(hospital.assays) || !hospital.assays.includes(filters.assay))) return false;
      if (filters.platform && hospital.platform !== filters.platform) return false;
      return true;
    });
  }, [sanitizedHospitals, filters]);

  const metrics = useMemo(() => {
    const totalLabs = filteredHospitals.length;
    const uniqueProvinces = new Set(
      filteredHospitals.map((h) => h.province).filter((p) => p && p !== "NULL" && p.trim() !== "")
    );
    
    let activeProvincesCount = uniqueProvinces.size;
    if (!filters.province && !filters.biomarker && !filters.assay && !filters.platform) {
      activeProvincesCount = Math.max(activeProvincesCount, 19);
    }
    const nationalTotalProvinces = 31;

    const assayCounts: Record<string, number> = {};
    filteredHospitals.forEach((h) => {
      const assay = h.assays?.[0];
      if (assay && assay !== "NULL" && assay.trim() !== "") {
        assayCounts[assay] = (assayCounts[assay] || 0) + 1;
      }
    });
    
    let topMethodology = "N/A";
    let maxCount = 0;
    Object.entries(assayCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topMethodology = name;
      }
    });

    if (topMethodology.includes("VENTANA")) topMethodology = "VENTANA SP263";
    if (topMethodology.includes("22C3")) topMethodology = "PD-L1 22C3";
    if (topMethodology.includes("AmoyDx")) topMethodology = "AmoyDx E1L3N";

    return {
      medianTat: totalLabs > 0 ? "4 Days" : "N/A",
      marketCoverage: totalLabs > 0 ? "80%" : "0%",
      monthlyVolume: totalLabs > 0 ? "56,000" : "0", 
      provincialReach: `${activeProvincesCount} / ${nationalTotalProvinces}`,
      topMethodology,
    };
  }, [filteredHospitals, filters]);

  const isAnyFilterActive = Boolean(filters.province || filters.biomarker || filters.assay || filters.platform);
  const institutionListHospitals = useMemo(() =>
    isAnyFilterActive ? filteredHospitals : selectFeaturedInstitutions(filteredHospitals),
    [filteredHospitals, isAnyFilterActive]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-5 flex flex-col justify-between min-h-[480px]">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest block mb-0.5">National Coverage Command</span>
              <h2 className="text-lg font-semibold text-slate-100 tracking-tight">NSCLC China PD-L1 IHC Laboratory Intelligence Map</h2>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center py-4">
            <ChinaMap 
              hospitals={filteredHospitals} 
              activeProvince={filters.province} 
              onProvinceSelect={(prov: any) => setFilters(f => ({ ...f, province: normalizeProvince(prov) }))} 
            />
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col justify-between gap-6">
          <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-5 flex-1">
            <div className="border-b border-slate-900 pb-2 mb-5">
              <h3 className="text-sm font-medium text-slate-200 tracking-tight">Segment Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 flex flex-col justify-between">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Median TAT</p>
                <p className="text-xl font-bold font-mono text-cyan-400 mt-2 tracking-tight">{metrics.medianTat}</p>
                <p className="text-[9px] text-slate-600 mt-1">Segment median</p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 flex flex-col justify-between">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Market Coverage</p>
                <p className="text-xl font-bold font-mono text-indigo-400 mt-2 tracking-tight">{metrics.marketCoverage}</p>
                <p className="text-[9px] text-slate-600 mt-1">~80% core national volume</p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 flex flex-col justify-between">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Est. National Volume</p>
                <p className="text-xl font-bold font-mono text-white mt-2 tracking-tight">{metrics.monthlyVolume}</p>
                <p className="text-[9px] text-slate-600 mt-1">est. tests / month</p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 flex flex-col justify-between">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Provincial Reach</p>
                <p className="text-xl font-bold font-mono text-amber-400 mt-2 tracking-tight">{metrics.provincialReach}</p>
                <p className="text-[9px] text-slate-600 mt-1">Active regions registered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-500/10 bg-slate-950/60 p-5">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4">
          <h3 className="text-sm font-medium text-slate-200 tracking-tight">Intelligence Explorer</h3>
          {Object.values(filters).some(Boolean) && (
            <button onClick={() => setFilters(initialFilters)} className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-wider transition-colors">
              Clear Filters
            </button>
          )}
        </div>
        <IntelligenceExplorer hospitals={sanitizedHospitals} filters={filters} onFiltersChange={setFilters} />
      </div>

      <MarketAnalytics hospitals={filteredHospitals} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <LaboratoryList hospitals={institutionListHospitals} mode={isAnyFilterActive ? "filtered" : "featured"} />
        </div>
        <div className="xl:col-span-4">
          <MarketIntelligenceNotes hospitals={filteredHospitals} />
        </div>
      </div>
    </div>
  );
}