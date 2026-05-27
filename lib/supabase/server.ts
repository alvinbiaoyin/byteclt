import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

export function createSupabaseServerClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured || !url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
