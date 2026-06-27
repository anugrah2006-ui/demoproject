import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Using dummy values if env vars are missing to prevent crash during UI development
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
