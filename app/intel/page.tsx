// app/intel/page.tsx
// Intelligence Dashboard route — moved verbatim from app/page.tsx as part of
// the v2 productization split (landing layer at "/", dashboard at "/intel").
// The DashboardShell + dependent components are NOT modified.
import DashboardShell from "../components/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Hospital } from "@/lib/hospital-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jianji™ CDx Intelligence Platform",
  description: "Powered by BYTEclt Consulting",
};

// 🌐 省份中文与坐标映射
const PROVINCE_MAP: Record<string, { cn: string; coords: [number, number] }> = {
  "BEIJING": { cn: "北京", coords: [116.4074, 39.9042] },
  "SHANGHAI": { cn: "上海", coords: [121.4737, 31.2304] },
  "GUANGDONG": { cn: "广东", coords: [113.2644, 23.1292] },
  "JIANGSU": { cn: "江苏", coords: [118.7674, 32.0415] },
  "ZHEJIANG": { cn: "浙江", coords: [120.1536, 30.2875] },
  "SHANDONG": { cn: "山东", coords: [117.0009, 36.6758] },
  "ANHUI": { cn: "安徽", coords: [117.2830, 31.8612] },
  "HUBEI": { cn: "湖北", coords: [114.2986, 30.5844] },
  "HUNAN": { cn: "湖南", coords: [112.9388, 28.2280] },
  "SICHUAN": { cn: "四川", coords: [104.0657, 30.6594] },
  "CHONGQING": { cn: "重庆", coords: [106.5516, 29.5630] },
  "FUJIAN": { cn: "福建", coords: [119.3063, 26.0753] },
  "TIANJIN": { cn: "天津", coords: [117.2008, 39.0841] },
  "HENAN": { cn: "河南", coords: [113.6654, 34.7579] },
  "HEBEI": { cn: "河北", coords: [114.4995, 38.0428] },
  "SHANXI": { cn: "山西", coords: [112.5489, 37.8706] },
  "SHAANXI": { cn: "陕西", coords: [108.9402, 34.3416] },
  "LIAONING": { cn: "辽宁", coords: [123.4291, 41.7968] },
  "JILIN": { cn: "吉林", coords: [125.3245, 43.8868] },
  "HELONGJIANG": { cn: "黑龙江", coords: [126.6425, 45.7569] },
};

const DEFAULT_NODE = { cn: "北京", coords: [116.4074, 39.9042] };

export const revalidate = 0; 

export default async function IntelPage() {
  const supabase = createSupabaseServerClient();
  let rawData: any[] = [];
  let errorMessage = "";

  try {
    // 📡 铁血直连：按照线上真实的 "id" 字段进行升序排序
    const response = await supabase
      .from("alvinyinchina_pdl1_demo")
      .select("*")
      .order("id", { ascending: true }); // ✅ 修复：由 lab_id 改为线上真实存在的 id

    if (response.error) {
      errorMessage = `${response.error.code}: ${response.error.message}`;
      console.error("Supabase Matrix Error:", response.error);
    } else {
      rawData = response.data || [];
    }
  } catch (catchErr: any) {
    errorMessage = catchErr?.message || "Critical connection crash";
  }

  // 🧪 数据转换管道
  const hospitals: Hospital[] = rawData.map((row: any) => {
    const rawKey = String(row.province || "BEIJING").toUpperCase().trim();
    const provKey = rawKey === "HEBEI PROVINCE" ? "HEBEI" : rawKey;
    const mappedProvince = PROVINCE_MAP[provKey];
    if (!mappedProvince) {
      console.warn(`[Jianji] Unrecognized province key: "${rawKey}" — falling back to ${DEFAULT_NODE.cn}.`);
    }
    const matchedProvince = mappedProvince || DEFAULT_NODE;

    let cleanPlatform = "VENTANA";
    const rawPlatform = String(row.lab_level_ihc_platforms || "").toUpperCase();
    if (rawPlatform.includes("VENTANA")) cleanPlatform = "VENTANA";
    else if (rawPlatform.includes("DAKO")) cleanPlatform = "DAKO";
    else if (rawPlatform.includes("LEICA")) cleanPlatform = "LEICA";

    const rawAssay = row.commercial_assays || row.assay_name || "PD-L1 (22C3)";
    const cleanAssay = rawAssay.replace("pharmDx", "").replace("Assay", "").trim();

    const reimbursementStatus =
      row.reimbursement_status === "YES" || row.reimbursement_status === "NO"
        ? row.reimbursement_status
        : null;
    const reimbursementCny =
      typeof row.reimbursement_cny === "number" ? row.reimbursement_cny : null;

    return {
      id: row.id || Math.random(), // ✅ 修复：完全读取线上的 id
      name: row.hospital_name || "Unknown Laboratory Node",
      province: matchedProvince.cn,
      city: row.city || "城市",
      street: row.street || "",
      labType: row.lab_type || "HOSPITAL",
      biomarkers: ["PD-L1"],
      assays: [cleanAssay],
      platform: cleanPlatform,
      coordinates: matchedProvince.coords,
      utilization: row.lab_type === "COMMERCIAL" ? 92 : 85,
      tatDays: row.tat_days ? Number(row.tat_days) : 3,
      reimbursementStatus,
      reimbursementCny,
    };
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 selection:bg-cyan-500/30">
      {/* 👑 智能品牌顶栏 */}
      <div className="mb-6 p-3 rounded-xl border border-cyan-500/20 bg-cyan-950/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${errorMessage ? 'bg-amber-400' : 'bg-cyan-400'}`} />
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm font-bold tracking-wider text-slate-100">
              Jianji™ CDx Intelligence Platform
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              v1.0
            </span>
          </div>
        </div>
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Powered by</span>
          <span className="text-cyan-300 font-bold">BYTEclt Consulting</span>
        </div>
      </div>

      {/* 🚨 管道错误显示栏 */}
      {errorMessage && (
        <div className="mb-6 p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs font-mono text-amber-300">
          ⚠️ <strong>Pipeline Warning:</strong> {errorMessage}
        </div>
      )}

      {/* 核心大屏外壳 */}
      <DashboardShell hospitals={hospitals} />
    </main>
  );
}
