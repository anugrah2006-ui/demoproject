"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { logAuthInfo, logAuthWarn, summarizeAuthError } from "@/lib/auth/debug";
import { getSupabaseConfig } from "@/lib/supabase/config";

const AUTH_STORAGE_KEY_PATTERN = /^sb-.*(?:auth-token|code-verifier)(?:\..+)?$/;

function getSupabaseLocalStorageKeys() {
  if (typeof window === "undefined") return [];

  return Object.keys(window.localStorage).filter((key) =>
    AUTH_STORAGE_KEY_PATTERN.test(key)
  );
}

function getSupabaseCookieNames() {
  if (typeof document === "undefined") return [];

  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name.startsWith("sb-"));
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;

  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${name}=; expires=${expires}; path=/`;
  document.cookie = `${name}=; expires=${expires}; path=/; domain=${window.location.hostname}`;
}

export function isRecoverableAuthStateError(error: unknown) {
  const summary = summarizeAuthError(error) as
    | {
        name?: string | null;
        message?: string | null;
        code?: string | null;
        status?: number | string | null;
      }
    | null;

  if (!summary) return false;

  const name = `${summary.name ?? ""}`.toLowerCase();
  const message = `${summary.message ?? ""}`.toLowerCase();
  const code = `${summary.code ?? ""}`.toLowerCase();
  const status =
    typeof summary.status === "number"
      ? summary.status
      : Number(summary.status ?? Number.NaN);

  // Normal missing session state (i.e. guest user) is not an invalid/corrupt session that requires recovery
  if (name.includes("sessionmissing") || message.includes("session missing")) {
    return false;
  }

  return (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    message.includes("jwt") ||
    message.includes("session") ||
    message.includes("refresh token") ||
    message.includes("user from sub claim") ||
    code.includes("invalid") ||
    code.includes("session")
  );
}

export async function recoverFromInvalidBrowserSession(
  supabase: SupabaseClient,
  error: unknown,
  scope: string
) {
  const { storageKey } = getSupabaseConfig();
  const localStorageKeys = getSupabaseLocalStorageKeys();
  const cookieNames = getSupabaseCookieNames();

  logAuthWarn(scope, "Detected invalid Supabase auth state; clearing browser session", {
    currentStorageKey: storageKey,
    localStorageKeys,
    cookieNames,
    error: summarizeAuthError(error),
  });

  const { error: signOutError } = await supabase.auth.signOut({ scope: "local" });

  if (signOutError) {
    logAuthWarn(scope, "Local signOut failed during auth recovery; continuing with manual cleanup", {
      error: summarizeAuthError(signOutError),
    });
  }

  localStorageKeys.forEach((key) => window.localStorage.removeItem(key));
  cookieNames.forEach(clearCookie);

  logAuthInfo(scope, "Cleared invalid Supabase browser auth state", {
    clearedLocalStorageKeys: localStorageKeys,
    clearedCookies: cookieNames,
  });

  return {
    clearedLocalStorageKeys: localStorageKeys,
    clearedCookies: cookieNames,
  };
}
