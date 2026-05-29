"use client";

import { useMemo } from "react";
import { computeIntelligence } from "@/lib/compute-intelligence";
import type { Hospital } from "@/lib/hospital-types";

type SegmentKpisProps = {
  hospitals: Hospital[];
  allHospitals: Hospital[]; // still accepted but not used in compute
  mapVisibleCount: number;
};

export default function SegmentKpis({
  hospitals,
  allHospitals,
  mapVisibleCount,
}: SegmentKpisProps) {
  const snapshot = useMemo(
    () => computeIntelligence(hospitals),
    [hospitals]
  );

  const topAssay = snapshot.assayMix[0];

  const items = [
    {
      label: "Provinces",
      value: String(snapshot.provinceCount),
      detail: "Distinct provinces in segment",
    },
    {
      label: "Map Visibility",
      value: String(mapVisibleCount),
      detail: "Institutions on map",
    },
    {
      label: "Assay Types",
      value: String(snapshot.assayMix.length),
      detail: "Unique assays detected",
    },
    {
      label: "Lead Assay",
      value: topAssay ? topAssay.name : "—",
      detail: topAssay ? `${topAssay.value} hospitals` : "No assay data",
    },
    {
      label: "Total Nodes",
      value: String(hospitals.length),
      detail: "In filtered segment",
    },
    {
      label: "Insight",
      value: "—",
      detail: snapshot.insights[0] ?? "No insight available",
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