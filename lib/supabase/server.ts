import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { logSupabaseConfig } from "@/lib/supabase/config";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = logSupabaseConfig("supabase-server");

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error: unknown) {
            console.warn("Failed to set cookies in Server Component", error);
          }
        },
      },
    }
  );
}
