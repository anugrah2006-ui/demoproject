import type { SupabaseClient } from "@supabase/supabase-js";
import {
  logAuthError,
  logAuthInfo,
  summarizeAuthError,
  summarizeSession,
  summarizeUser,
} from "@/lib/auth/debug";

export async function getSessionWithTrace(
  supabase: SupabaseClient,
  scope: string,
  details?: Record<string, unknown>
) {
  logAuthInfo(scope, "Calling supabase.auth.getSession()", details);
  const result = await supabase.auth.getSession();

  if (result.error) {
    logAuthError(scope, "supabase.auth.getSession() failed", {
      ...details,
      error: summarizeAuthError(result.error),
    });
  } else {
    logAuthInfo(scope, "supabase.auth.getSession() succeeded", {
      ...details,
      session: summarizeSession(result.data.session),
    });
  }

  return result;
}

export async function getUserWithTrace(
  supabase: SupabaseClient,
  scope: string,
  details?: Record<string, unknown>
) {
  logAuthInfo(scope, "Calling supabase.auth.getUser()", details);
  const result = await supabase.auth.getUser();

  if (result.error) {
    const isSessionMissing =
      result.error.name === "AuthSessionMissingError" ||
      result.error.message?.includes("session missing") ||
      result.error.message?.includes("Session missing");

    if (isSessionMissing) {
      logAuthInfo(scope, "supabase.auth.getUser() - no active session found (user is guest)", {
        ...details,
      });
    } else {
      logAuthError(scope, "supabase.auth.getUser() failed", {
        ...details,
        error: summarizeAuthError(result.error),
      });
    }
  } else {
    logAuthInfo(scope, "supabase.auth.getUser() succeeded", {
      ...details,
      user: summarizeUser(result.data.user),
    });
  }

  return result;
}
