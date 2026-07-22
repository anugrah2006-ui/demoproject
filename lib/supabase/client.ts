import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logAuthInfo } from "@/lib/auth/debug";
import { logSupabaseConfig } from "@/lib/supabase/config";

let browserClient: SupabaseClient | undefined;

export function createClient() {
  const { url, anonKey } = logSupabaseConfig("supabase-browser");

  if (typeof window === "undefined") {
    return createBrowserClient(url, anonKey);
  }

  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient(url, anonKey);

  logAuthInfo("supabase-browser", "Created singleton browser Supabase client", {
    hasWindow: typeof window !== "undefined",
  });

  return browserClient;
}
