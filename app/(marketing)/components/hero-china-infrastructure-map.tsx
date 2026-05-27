import hospitals from "@/data/hospitals.json";
import {
  CHINA_PROVINCE_PATHS,
  projectGeoCoord,
} from "./china-map-paths";
import {
  WORLD_MAP_MAIN,
  WORLD_MAP_OCEANIA,
} from "./world-map-paths";

// ─────────────────────────────────────────────────────────────────────────
// Hero visual — China diagnostics network on a faded world backdrop.
//
// One shared equirectangular projection (the Tom-b world map's native
// coord system) drives every layer, so the China highlight, the world
// silhouette, the hospital network, the intercity backbone, and the
// international routes are all geographically real — not decorative.
//
// Composition (back → front):
//   1. atmospheric base    — single radial wash (no blur, no stacked layers)
//   2. tactical graticule  — extremely faint parallels + meridians
//   3. world silhouette    — slate, low opacity
//   4. international routes — dashed arcs from China hubs to APAC hubs
//   5. China provinces     — navy fill + crisp cyan border
//   6. intercity backbone  — dashed cyan corridors between primary hubs
//   7. tertiary nodes      — flat provincial-capital dots
//   8. secondary nodes     — operational dots
//   9. primary nodes       — bright cyan with flat halo (no radial gradient)
//  10. edge vignette       — grounds the visual into the dark hero band
//
// Server-rendered SVG. No client JS, no ECharts, no animations, no SVG
// filters — every layer is a flat fill or stroke so the entire hero
// repaints in a single cheap composite pass.
// ─────────────────────────────────────────────────────────────────────────

// Window cropped to East Asia + Pacific.
// In world equirectangular units: x = (lon+180)*1.374, y = (90-lat)*1.716
// Visible region: lon ~60E → ~166E,  lat ~70N → ~-32S
const VB_X = 330;
const VB_Y = 35;
const VB_W = 145;
const VB_H = 180;

// ─── Curated network ────────────────────────────────────────────────────

type HospitalRow = {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number];
};

const PRIMARY = (hospitals as HospitalRow[]).map((h) => {
  const [x, y] = projectGeoCoord(h.coordinates[0], h.coordinates[1]);
  return { id: h.id, label: h.city, x, y };
});
const primaryById = Object.fromEntries(PRIMARY.map((n) => [n.id, n]));

// Secondary tier — major metropolitan testing centers beyond the curated
// fixture. Adds operational density without overwhelming the foreground.
const SECONDARY_CITIES: Array<{ name: string; lon: number; lat: number }> = [
  { name: "Tianjin", lon: 117.20, lat: 39.13 },
  { name: "Shenzhen", lon: 114.06, lat: 22.54 },
  { name: "Chongqing", lon: 106.55, lat: 29.56 },
  { name: "Xi'an", lon: 108.94, lat: 34.34 },
  { name: "Qingdao", lon: 120.38, lat: 36.07 },
  { name: "Harbin", lon: 126.64, lat: 45.76 },
  { name: "Shenyang", lon: 123.43, lat: 41.81 },
  { name: "Changchun", lon: 125.32, lat: 43.82 },
  { name: "Xiamen", lon: 118.10, lat: 24.46 },
  { name: "Suzhou", lon: 120.62, lat: 31.32 },
  { name: "Fuzhou", lon: 119.30, lat: 26.08 },
  { name: "Kunming", lon: 102.71, lat: 25.04 },
];
const SECONDARY = SECONDARY_CITIES.map((c) => {
  const [x, y] = projectGeoCoord(c.lon, c.lat);
  return { ...c, x, y };
});

// Tertiary tier — provincial capitals as atmospheric coverage dots.
const TERTIARY_CITIES: Array<{ name: string; lon: number; lat: number }> = [
  { name: "Lanzhou", lon: 103.82, lat: 36.06 },
  { name: "Urumqi", lon: 87.62, lat: 43.83 },
  { name: "Lhasa", lon: 91.13, lat: 29.65 },
  { name: "Hohhot", lon: 111.75, lat: 40.84 },
  { name: "Yinchuan", lon: 106.27, lat: 38.47 },
  { name: "Xining", lon: 101.78, lat: 36.62 },
  { name: "Nanning", lon: 108.37, lat: 22.82 },
  { name: "Haikou", lon: 110.20, lat: 20.04 },
  { name: "Guiyang", lon: 106.71, lat: 26.58 },
  { name: "Nanchang", lon: 115.89, lat: 28.68 },
  { name: "Hefei", lon: 117.28, lat: 31.86 },
  { name: "Shijiazhuang", lon: 114.50, lat: 38.05 },
  { name: "Taiyuan", lon: 112.55, lat: 37.87 },
  { name: "Zhengzhou", lon: 113.65, lat: 34.76 },
  { name: "Changsha", lon: 112.94, lat: 28.23 },
];
const TERTIARY = TERTIARY_CITIES.map((c) => {
  const [x, y] = projectGeoCoord(c.lon, c.lat);
  return { ...c, x, y };
});

// In-China backbone corridors between primary hubs.
const CORRIDORS: Array<[string, string]> = [
  ["bj-precision", "sh-translational"],
  ["bj-precision", "gz-molecular"],
  ["bj-precision", "cd-oncology"],
  ["sh-translational", "wh-central"],
  ["sh-translational", "gz-molecular"],
  ["wh-central", "cd-oncology"],
];

// International hubs visible in the cropped viewBox.
const INTL_HUBS: Record<string, [number, number]> = {
  Tokyo: [139.65, 35.68],
  Seoul: [126.98, 37.57],
  Singapore: [103.82, 1.35],
  Sydney: [151.21, -33.87],
  Bangkok: [100.50, 13.75],
  Mumbai: [72.83, 19.08],
};

// Origin (lon, lat) → destination key. Anchored to real diagnostics hubs.
const INTL_ROUTES: Array<{ from: [number, number]; to: keyof typeof INTL_HUBS }> = [
  { from: [121.4737, 31.2304], to: "Tokyo" },     // Shanghai → Tokyo
  { from: [121.4737, 31.2304], to: "Singapore" }, // Shanghai → Singapore
  { from: [121.4737, 31.2304], to: "Sydney" },    // Shanghai → Sydney
  { from: [116.4074, 39.9042], to: "Seoul" },     // Beijing  → Seoul
  { from: [113.2644, 23.1291], to: "Bangkok" },   // Guangzhou → Bangkok
  { from: [116.4074, 39.9042], to: "Mumbai" },    // Beijing  → Mumbai
];

// Quadratic Bezier control point offset perpendicular from the midpoint —
// produces a clean great-circle-feeling arc bowing away from the line.
function arcPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular (-dy, dx) normalized; arc always bows "upward" (toward
  // the smaller y) for international routes, which reads as an over-the-
  // top great circle.
  const px = -dy / len;
  const py = dx / len;
  const off = len * curvature * (py < 0 ? 1 : -1);
  return `M${x1.toFixed(2)},${y1.toFixed(2)} Q${(mx + px * off).toFixed(2)},${(my + py * off).toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

export default function HeroChinaInfrastructureMap() {
  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        {/* Single atmospheric wash centered on China — replaces the previous
            multi-radial / blur-filter stack to keep paint cost minimal. */}
        <radialGradient id="hero-china-atmosphere" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
          <stop offset="55%" stopColor="rgba(8,47,73,0.32)" />
          <stop offset="100%" stopColor="rgba(2,6,23,0)" />
        </radialGradient>
        {/* Edge vignette grounds the visual into the dark hero band */}
        <radialGradient id="hero-vignette" cx="50%" cy="50%" r="62%">
          <stop offset="65%" stopColor="rgba(2,6,23,0)" />
          <stop offset="100%" stopColor="rgba(2,6,23,0.85)" />
        </radialGradient>
      </defs>

      {/* ── 1. Atmospheric base — single radial wash, no blur ─────────── */}
      <rect
        x={VB_X}
        y={VB_Y}
        width={VB_W}
        height={VB_H}
        fill="url(#hero-china-atmosphere)"
      />

      {/* ── 2. Tactical graticule — very faint ────────────────────────── */}
      <g
        stroke="rgba(148,163,184,0.045)"
        strokeWidth="0.12"
        strokeDasharray="0.6 1.4"
      >
        {/* Parallels every 15° */}
        {[60, 45, 30, 15, 0, -15, -30].map((lat) => {
          const y = (90 - lat) * 1.716;
          if (y < VB_Y || y > VB_Y + VB_H) return null;
          return (
            <line key={`p-${lat}`} x1={VB_X} y1={y} x2={VB_X + VB_W} y2={y} />
          );
        })}
        {/* Meridians every 15° */}
        {[75, 90, 105, 120, 135, 150].map((lon) => {
          const x = (lon + 180) * 1.374;
          if (x < VB_X || x > VB_X + VB_W) return null;
          return (
            <line key={`m-${lon}`} x1={x} y1={VB_Y} x2={x} y2={VB_Y + VB_H} />
          );
        })}
      </g>

      {/* ── 3. World silhouette — infrastructure backdrop ─────────────── */}
      <g
        fill="rgba(100,116,139,0.10)"
        fillRule="evenodd"
        stroke="rgba(100,116,139,0.10)"
        strokeWidth="0.12"
      >
        <path d={WORLD_MAP_MAIN} />
        <path d={WORLD_MAP_OCEANIA} />
      </g>

      {/* ── 4. International routes — faint dashed great-circle arcs ──── */}
      <g fill="none" strokeLinecap="round">
        {INTL_ROUTES.map((r, i) => {
          const [x1, y1] = projectGeoCoord(r.from[0], r.from[1]);
          const [x2, y2] = projectGeoCoord(INTL_HUBS[r.to][0], INTL_HUBS[r.to][1]);
          const d = arcPath(x1, y1, x2, y2, 0.16);
          return (
            <g key={`intl-${i}`}>
              <path
                d={d}
                stroke="rgba(34,211,238,0.38)"
                strokeWidth="0.13"
                strokeDasharray="0.45 0.9"
              />
              <circle cx={x2} cy={y2} r="0.5" fill="rgba(34,211,238,0.85)" />
            </g>
          );
        })}
      </g>

      {/* ── 5. China provinces — navy fill, sharp cyan border ──────────── */}
      <g
        fill="#0b1735"
        stroke="rgba(56,189,248,0.65)"
        strokeWidth="0.18"
        strokeLinejoin="round"
      >
        {CHINA_PROVINCE_PATHS.map((p) => (
          <path key={p.adcode} d={p.d} />
        ))}
      </g>

      {/* ── 6. Intercity backbone corridors ───────────────────────────── */}
      <g fill="none" strokeLinecap="round">
        {CORRIDORS.map(([a, b], i) => {
          const fa = primaryById[a];
          const fb = primaryById[b];
          if (!fa || !fb) return null;
          const d = arcPath(fa.x, fa.y, fb.x, fb.y, 0.05);
          return (
            <path
              key={`corridor-${i}`}
              d={d}
              stroke="rgba(34,211,238,0.42)"
              strokeWidth="0.12"
              strokeDasharray="0.35 0.7"
            />
          );
        })}
      </g>

      {/* ── 7. Tertiary atmospheric nodes — flat circles, no halo ─────── */}
      <g fill="rgba(165,243,252,0.55)">
        {TERTIARY.map((n) => (
          <circle key={`t-${n.name}`} cx={n.x} cy={n.y} r="0.28" />
        ))}
      </g>

      {/* ── 8. Secondary nodes ────────────────────────────────────────── */}
      <g>
        {SECONDARY.map((n) => (
          <g key={`s-${n.name}`}>
            <circle cx={n.x} cy={n.y} r="0.55" fill="rgba(34,211,238,0.85)" />
            <circle cx={n.x} cy={n.y} r="0.22" fill="rgba(207,250,254,1)" />
          </g>
        ))}
      </g>

      {/* ── 9. Primary nodes — brightest, no radial-gradient halo ─────── */}
      <g>
        {PRIMARY.map((n) => (
          <g key={`p-${n.id}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r="1.4"
              fill="rgba(34,211,238,0.22)"
            />
            <circle cx={n.x} cy={n.y} r="0.75" fill="rgba(34,211,238,0.98)" />
            <circle cx={n.x} cy={n.y} r="0.3" fill="rgba(207,250,254,1)" />
          </g>
        ))}
      </g>

      {/* ── 10. Edge vignette ─────────────────────────────────────────── */}
      <rect
        x={VB_X}
        y={VB_Y}
        width={VB_W}
        height={VB_H}
        fill="url(#hero-vignette)"
      />
    </svg>
  );
}
