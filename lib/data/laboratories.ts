import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getLaboratories() {
  const { data, error } = await supabase
    .from("alvinyinchina_pdl1_demo")
    .select("*");

  return {
    hospitals: data || [],
    error,
    source: "supabase",
  };
}