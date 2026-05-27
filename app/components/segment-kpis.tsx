"use client";

import { useMemo } from "react";
import { computeIntelligence } from "@/lib/compute-intelligence";
import type { Hospital } from "@/lib/hospital-types";

type SegmentKpisProps = {
  hospitals: Hospital[];
  allHospitals: Hospital[];
  mapVisibleCount: number;
};

export default function SegmentKpis({
  hospitals,
  allHospitals,
  mapVisibleCount,
}: SegmentKpisProps) {
  const snapshot = useMemo(
    () => computeIntelligence(hospitals, allHospitals),
    [hospitals, allHospitals]
  );

  const topAssay = snapshot.assayMix[0];

  const items = [
    {
      label: "Network Coverage",
      value: `${snapshot.networkCoverage.coveragePercent}%`,
      detail: `${snapshot.networkCoverage.sitesActive} active sites`,
    },
    {
      label: "Map Visibility",
      value: String(mapVisibleCount),
      detail: "Institutions on map",
    },
    {
      label: "Median TAT",
      value: `${snapshot.medianTatDays} Days`,
      detail: "Segment median",
    },
    {
      label: "Provinces",
      value: `${snapshot.networkCoverage.provincesCovered}`,
      detail: `of ${snapshot.networkCoverage.provincesTotal} covered`,
    },
    {
      label: "Monthly Volume",
      value: snapshot.estimatedMonthlyVolume.toLocaleString(),
      detail: "Est. tests / month",
    },
    {
      label: "Lead Assay",
      value: topAssay ? `${topAssay.share}%` : "—",
      detail: topAssay?.assay ?? "No assay data",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-cyan-300/15 bg-slate-950/80 px-3 py-2.5 transition duration-300 hover:border-cyan-300/35"
        >
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            {item.label}
          </p>
          <p className="mt-1 text-lg font-semibold leading-none text-cyan-200">
            {item.value}
          </p>
          <p className="mt-1 truncate text-[10px] text-slate-500">
            {item.detail}
          </p>
        </article>
      ))}
    </div>
  );
}
