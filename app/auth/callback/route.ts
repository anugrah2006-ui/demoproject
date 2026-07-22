import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  logAuthError,
  logAuthInfo,
  logAuthWarn,
  summarizeAuthError,
  summarizeSession,
  summarizeUser,
} from "@/lib/auth/debug";
import { buildAbsoluteUrl, getRequestOrigin, sanitizeNextPath } from "@/lib/auth/urls";
import { ensureUserProfile } from "@/lib/auth/profile";
import { getUserWithTrace } from "@/lib/supabase/auth-reads";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = getRequestOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const next = sanitizeNextPath(requestUrl.searchParams.get("next"));
  const providerError = requestUrl.searchParams.get("error");
  const providerErrorCode = requestUrl.searchParams.get("error_code");
  const providerErrorDescription = requestUrl.searchParams.get("error_description");
  const visibleSearchParams = Object.fromEntries(
    Array.from(requestUrl.searchParams.entries()).map(([key, value]) => [
      key,
      key === "code" ? "[redacted]" : value,
    ])
  );

  logAuthInfo("oauth-callback", "Received OAuth callback request", {
    origin,
    pathname: requestUrl.pathname,
    hasCode: Boolean(code),
    next,
    providerError,
    providerErrorCode,
    providerErrorDescription,
    searchParams: visibleSearchParams,
  });

  if (providerError) {
    logAuthWarn("oauth-callback", "OAuth provider returned an error", {
      providerError,
      providerErrorCode,
      providerErrorDescription,
      searchParams: visibleSearchParams,
    });

    const loginUrl = new URL(buildAbsoluteUrl("/login", origin));
    loginUrl.searchParams.set("error", providerError);
    if (providerErrorCode) {
      loginUrl.searchParams.set("error_code", providerErrorCode);
    }
    if (providerErrorDescription) {
      loginUrl.searchParams.set("error_description", providerErrorDescription);
    }
    loginUrl.hash = "auth-error";

    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    logAuthWarn("oauth-callback", "OAuth callback did not include an auth code", {
      searchParams: visibleSearchParams,
    });

    return NextResponse.redirect(
      buildAbsoluteUrl("/login?error=missing_auth_code", origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    logAuthInfo("oauth-callback", "Completed code exchange attempt", {
      error: summarizeAuthError(error),
      session: summarizeSession(data.session ?? null),
      user: summarizeUser(data.session?.user ?? null),
    });

    if (error) {
      logAuthError("oauth-callback", "exchangeCodeForSession failed", {
        error: summarizeAuthError(error),
      });

      return NextResponse.redirect(
        buildAbsoluteUrl("/login?error=auth_code_exchange_failed", origin)
      );
    }

    const user = data.session?.user ?? null;

    if (!user) {
      logAuthError("oauth-callback", "Code exchange succeeded without a user payload", {
        session: summarizeSession(data.session ?? null),
      });

      return NextResponse.redirect(
        buildAbsoluteUrl("/login?error=missing_user_after_exchange", origin)
      );
    }

    await ensureUserProfile(supabase, user, "oauth-callback");

    const {
      data: { user: verifiedUser },
      error: verificationError,
    } = await getUserWithTrace(supabase, "oauth-callback", {
      pathname: requestUrl.pathname,
      stage: "post-exchange-verification",
    });

    if (verificationError) {
      logAuthWarn("oauth-callback", "Unable to verify user after code exchange", {
        error: summarizeAuthError(verificationError),
      });
    } else {
      logAuthInfo("oauth-callback", "Verified session after code exchange", {
        user: summarizeUser(verifiedUser),
      });
    }

    const redirectUrl = buildAbsoluteUrl(next, origin);
    logAuthInfo("oauth-callback", "Redirecting authenticated user after callback", {
      redirectUrl,
      user: summarizeUser(user),
    });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    logAuthError("oauth-callback", "Unhandled OAuth callback exception", {
      error: summarizeAuthError(error),
      searchParams: visibleSearchParams,
    });

    return NextResponse.redirect(
      buildAbsoluteUrl("/login?error=oauth_callback_exception", origin)
    );
  }
}
