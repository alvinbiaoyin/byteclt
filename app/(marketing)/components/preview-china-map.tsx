import hospitals from "@/data/hospitals.json";
import {
  CHINA_PROVINCE_PATHS,
  projectGeoCoord,
} from "./china-map-paths";

// Shared static China map used by the homepage platform preview frame and
// by the /platform page. Real China province geometry + dashboard colour
// palette + curated hospital nodes. Pure server-rendered SVG — no glow
// shadows, no interactivity, no extra UI chrome.

type HospitalRow = {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number];
};

const PRIMARY_NODES = (hospitals as HospitalRow[]).map((h) => {
  const [x, y] = projectGeoCoord(h.coordinates[0], h.coordinates[1]);
  return { id: h.id, label: h.city, x, y };
});

const SECONDARY_CITIES: Array<{ name: string; lon: number; lat: number }> = [
  { name: "Tianjin", lon: 117.2, lat: 39.13 },
  { name: "Shenzhen", lon: 114.06, lat: 22.54 },
  { name: "Chongqing", lon: 106.55, lat: 29.56 },
  { name: "Xi'an", lon: 108.94, lat: 34.34 },
  { name: "Qingdao", lon: 120.38, lat: 36.07 },
  { name: "Harbin", lon: 126.64, lat: 45.76 },
  { name: "Shenyang", lon: 123.43, lat: 41.81 },
  { name: "Xiamen", lon: 118.1, lat: 24.46 },
  { name: "Kunming", lon: 102.71, lat: 25.04 },
  { name: "Changsha", lon: 112.94, lat: 28.23 },
];

const SECONDARY_NODES = SECONDARY_CITIES.map((c) => {
  const [x, y] = projectGeoCoord(c.lon, c.lat);
  return { ...c, x, y };
});

// Equirectangular crop around China.
const VB_X = 340;
const VB_Y = 55;
const VB_W = 100;
const VB_H = 75;

export function PreviewChinaMap() {
  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="preview-china-glow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.16)" />
          <stop offset="60%" stopColor="rgba(34,211,238,0.04)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
        <radialGradient id="preview-node-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.7)" />
          <stop offset="55%" stopColor="rgba(34,211,238,0.18)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
        <radialGradient id="preview-cluster-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.32)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </radialGradient>
        <pattern
          id="preview-scanlines"
          width="0.6"
          height="0.6"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0.6"
            y2="0"
            stroke="rgba(148,163,184,0.05)"
            strokeWidth="0.12"
          />
        </pattern>
      </defs>

      <rect
        x={VB_X}
        y={VB_Y}
        width={VB_W}
        height={VB_H}
        fill="url(#preview-china-glow)"
      />

      <g
        fill="none"
        stroke="rgba(34,211,238,0.22)"
        strokeWidth="0.85"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {CHINA_PROVINCE_PATHS.map((p) => (
          <path key={`halo-${p.adcode}`} d={p.d} />
        ))}
      </g>

      <g
        fill="#0b1735"
        stroke="rgba(56,189,248,0.7)"
        strokeWidth="0.11"
        strokeLinejoin="round"
      >
        {CHINA_PROVINCE_PATHS.map((p) => (
          <path key={p.adcode} d={p.d} />
        ))}
      </g>

      <g>
        {SECONDARY_NODES.map((n) => (
          <g key={`s-${n.name}`}>
            <circle cx={n.x} cy={n.y} r="1.0" fill="url(#preview-node-halo)" />
            <circle cx={n.x} cy={n.y} r="0.32" fill="rgba(34,211,238,0.85)" />
            <circle cx={n.x} cy={n.y} r="0.14" fill="rgba(207,250,254,1)" />
          </g>
        ))}
      </g>

      <g>
        {PRIMARY_NODES.map((n) => (
          <g key={`p-${n.id}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r="2.4"
              fill="url(#preview-cluster-halo)"
            />
            <circle cx={n.x} cy={n.y} r="1.3" fill="url(#preview-node-halo)" />
            <circle cx={n.x} cy={n.y} r="0.48" fill="rgba(34,211,238,0.95)" />
            <circle cx={n.x} cy={n.y} r="0.2" fill="rgba(207,250,254,1)" />
          </g>
        ))}
      </g>

      <rect
        x={VB_X}
        y={VB_Y}
        width={VB_W}
        height={VB_H}
        fill="url(#preview-scanlines)"
      />
    </svg>
  );
}
