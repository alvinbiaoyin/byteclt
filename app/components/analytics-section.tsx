
"use client";

import { useMemo, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, computeAnalytics } from "@/lib/compute-analytics";
import type { Hospital } from "@/lib/hospital-types";

type AnalyticsSectionProps = {
  hospitals: Hospital[];
  allHospitals: Hospital[];
};

const tooltipStyle = {
  backgroundColor: "rgba(2, 8, 23, 0.95)",
  border: "1px solid rgba(34, 211, 238, 0.45)",
  borderRadius: "10px",
  color: "#cffafe",
};

const axisTick = { fill: "#94a3b8", fontSize: 11 };
const gridStroke = "rgba(56, 189, 248, 0.12)";

export default function AnalyticsSection({
  hospitals,
  allHospitals,
}: AnalyticsSectionProps) {
  const analytics = useMemo(
    () => computeAnalytics(hospitals, allHospitals),
    [hospitals, allHospitals]
  );

  return (
    <div className="analytics-section-enter grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Assay Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={analytics.assayDistribution}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              animationDuration={700}
            >
              {analytics.assayDistribution.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="rgba(15, 23, 42, 0.8)"
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="TAT Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={analytics.tatDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="count"
              name="Institutions"
              fill="#22d3ee"
              radius={[8, 8, 0, 0]}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Biomarker Demand Trend">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={analytics.biomarkerTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: "12px" }} />
            {analytics.biomarkerSeries.map((series, index) => (
              <Line
                key={series}
                type="monotone"
                dataKey={series}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3, fill: CHART_COLORS[index % CHART_COLORS.length] }}
                activeDot={{ r: 5 }}
                animationDuration={700}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Regional Coverage Comparison">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={analytics.regionalCoverage}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="province"
              tick={axisTick}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-18}
              textAnchor="end"
              height={56}
            />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: "12px" }} />
            <Bar
              dataKey="network"
              name="Network Total"
              fill="rgba(34, 211, 238, 0.25)"
              radius={[6, 6, 0, 0]}
              animationDuration={700}
            />
            <Bar
              dataKey="active"
              name="Active Segment"
              fill="#22d3ee"
              radius={[6, 6, 0, 0]}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-cyan-300/20 bg-slate-950/80 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
      <h4 className="text-sm font-medium text-cyan-100">{title}</h4>
      <div className="mt-3">{children}</div>
    </article>
  );
}

