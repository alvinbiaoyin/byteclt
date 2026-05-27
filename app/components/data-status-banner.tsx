type DataStatusBannerProps = {
  error: string | null;
  count: number;
  source: "supabase" | "unconfigured";
};

export default function DataStatusBanner({
  error,
  count,
  source,
}: DataStatusBannerProps) {
  if (!error && count > 0) {
    return (
      <div className="rounded-lg border border-cyan-300/15 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-100/80">
        Live data · {count} laboratories loaded from Supabase
      </div>
    );
  }

  if (source === "unconfigured") {
    return (
      <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        Supabase is not configured. Add{" "}
        <code className="text-amber-200">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-amber-200">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
        <code className="text-amber-200">.env.local</code>, then run{" "}
        <code className="text-amber-200">supabase/schema.sql</code> and{" "}
        <code className="text-amber-200">supabase/seed.sql</code>.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
      Failed to load laboratory data: {error}
    </div>
  );
}
