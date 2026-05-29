// app/components/china-map.tsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";
import type { Hospital } from "@/lib/hospital-types";

type ChinaMapProps = {
  hospitals: Hospital[];
};

export default function ChinaMap({ hospitals }: ChinaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [mapGeoJson, setMapGeoJson] = useState<any>(null);

  // 1. 规整散点数据格式
  const mapPoints = useMemo(() => {
    if (!Array.isArray(hospitals)) return [];
    return hospitals
      .filter((h) => h && h.coordinates)
      .map((h) => ({
        name: h.name,
        value: [Number(h.coordinates[0]), Number(h.coordinates[1]), Number(h.utilization || 80)],
        province: h.province,
        biomarkers: h.biomarkers || [],
        assays: h.assays || [],
        platform: h.platform || "",
        utilization: h.utilization || 0,
        tatDays: h.tatDays || 0,
      }));
  }, [hospitals]);

  // 2. 异步加载中国地图底图数据
  useEffect(() => {
    async function fetchGeoJson() {
      try {
        const res = await fetch("/maps/china.json");
        if (!res.ok) throw new Error("Primary map source offline");
        const json = await res.json();
        setMapGeoJson(json);
      } catch (err) {
        try {
          const resFallback = await fetch("https://unpkg.com/echarts@5.4.3/map/json/china.json");
          const jsonFallback = await resFallback.json();
          setMapGeoJson(jsonFallback);
        } catch (e) {
          console.error("All geo sources failed", e);
        }
      }
    }
    fetchGeoJson();
  }, []);

  // 3. 核心渲染逻辑：当底图好了、或者医院数据变了，直接铁血重绘
  useEffect(() => {
    if (!chartRef.current || !mapGeoJson) return;

    // 注册地图
    echarts.registerMap("china", mapGeoJson);

    // 初始化或获取已有实例
    let myChart = echarts.getInstanceByDom(chartRef.current);
    if (!myChart) {
      myChart = echarts.init(chartRef.current);
    }

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(2, 8, 23, 0.95)",
        borderColor: "rgba(34, 211, 238, 0.65)",
        borderWidth: 1,
        textStyle: { color: "#cffafe", fontSize: 12 },
        formatter: (params: any) => {
          const data = params.data;
          if (!data) return params.name ?? "";
          return [
            `<strong style="color: #22d3ee; font-size: 14px;">${data.name}</strong>`,
            `• Province: ${data.province}`,
            `• Utilization: ${data.utilization}%`,
            `• TAT: ${data.tatDays} Days`,
            `• Biomarkers: ${data.biomarkers.join(", ")}`,
            `• Assays: ${data.assays.join(", ")}`,
            `• Platform: ${data.platform}`,
          ].join("<br/>");
        },
      },
      geo: {
        map: "china",
        roam: true,
        zoom: 1.1,
        label: { show: false },
        itemStyle: {
          areaColor: "#0b1735",
          borderColor: "#38bdf8",
          borderWidth: 1.2,
          shadowColor: "rgba(34, 211, 238, 0.15)",
          shadowBlur: 10,
        },
        emphasis: {
          itemStyle: { areaColor: "#123968", borderColor: "#67e8f9" },
          label: { show: false }
        },
      },
      series: [
        {
          name: "Hospital Nodes",
          type: "effectScatter",
          coordinateSystem: "geo",
          rippleEffect: {
            brushType: "stroke",
            scale: 4,
            period: 4,
          },
          showEffectOn: "render",
          symbolSize: (val: number[]) => Math.max(12, (val[2] || 0) / 6),
          itemStyle: {
            color: "#22d3ee",
            shadowBlur: 15,
            shadowColor: "rgba(34, 211, 238, 0.9)",
          },
          data: mapPoints,
          zlevel: 2,
        },
      ],
    };

    myChart.setOption(option, true); // true 表示不合并旧数据，全量干净重绘

    // 响应窗口大小变化
    const handleResize = () => myChart?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mapGeoJson, mapPoints]);

  return (
    <div className="h-full w-full relative">
      {!mapGeoJson && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-cyan-100/60 bg-slate-950/80 z-10">
          Establishing link to National Map Intelligence...
        </div>
      )}
      <div ref={chartRef} className="h-full w-full" />
    </div>
  );
}