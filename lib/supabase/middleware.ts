import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import {
  logAuthError,
  logAuthInfo,
  summarizeAuthError,
  summarizeUser,
} from "@/lib/auth/debug";
import { logSupabaseConfig } from "@/lib/supabase/config";

function createProxyResponse(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export function copyResponseCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });

  return to;
}

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = createProxyResponse(request);
  const { url, anonKey } = logSupabaseConfig("supabase-proxy");

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          logAuthInfo("proxy-session", "Supabase updated auth cookies", {
            pathname: request.nextUrl.pathname,
            cookies: cookiesToSet.map((cookie) => cookie.name),
          });

          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = createProxyResponse(request);
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    const isSessionMissing =
      error.name === "AuthSessionMissingError" ||
      error.message?.includes("session missing") ||
      error.message?.includes("Session missing");

    if (isSessionMissing) {
      logAuthInfo("proxy-session", "No active session during proxy check", {
        pathname: request.nextUrl.pathname,
      });
    } else {
      logAuthError("proxy-session", "Failed to fetch user during session refresh", {
        pathname: request.nextUrl.pathname,
        error: summarizeAuthError(error),
      });
    }
  } else {
    logAuthInfo("proxy-session", "Session refresh complete", {
      pathname: request.nextUrl.pathname,
      user: summarizeUser(user as User | null),
      cookieCount: request.cookies.getAll().length,
    });
  }

  return {
    response: supabaseResponse,
    user: (user as User | null) ?? null,
    error,
  };
}
