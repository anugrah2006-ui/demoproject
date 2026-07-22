import type { SupabaseClient, User } from "@supabase/supabase-js";
import { logAuthError, logAuthInfo, logAuthWarn, summarizeUser } from "@/lib/auth/debug";

type PublicSupabaseClient = SupabaseClient;

export async function ensureUserProfile(
  supabase: PublicSupabaseClient,
  user: User,
  source: string
) {
  logAuthInfo(source, "Ensuring user profile exists", {
    user: summarizeUser(user),
  });

  try {
    const { data: existingProfile, error: profileLookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileLookupError) {
      logAuthWarn(source, "Profile lookup failed; continuing without blocking auth", {
        error: profileLookupError,
        userId: user.id,
      });
      return { created: false, skipped: true };
    }

    if (existingProfile) {
      logAuthInfo(source, "Existing profile found", { userId: user.id });
      return { created: false, skipped: false };
    }

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      onboarding_completed: false,
      subscription: "free",
    });

    if (insertError) {
      logAuthWarn(
        source,
        "Profile insert failed; auth session will continue without blocking login",
        {
          error: insertError,
          userId: user.id,
        }
      );
      return { created: false, skipped: true };
    }

    logAuthInfo(source, "Profile created successfully", { userId: user.id });
    return { created: true, skipped: false };
  } catch (error) {
    logAuthError(
      source,
      "Unexpected profile creation error; continuing without blocking auth",
      {
        error,
        userId: user.id,
      }
    );
    return { created: false, skipped: true };
  }
}
