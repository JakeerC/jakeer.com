import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabasePublishableKey } from "@/lib/env";
import type { Database } from "./database.types";

export function createClient() {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey()
  );
}
