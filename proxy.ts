import { type NextRequest, NextResponse } from "next/server";
import { copyResponseCookies, updateSession } from "@/lib/supabase/middleware";
import { logAuthInfo, summarizeAuthError, summarizeUser } from "@/lib/auth/debug";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  logAuthInfo("proxy", "Incoming request", {
    pathname: currentPath,
    search: request.nextUrl.search,
    cookieCount: request.cookies.getAll().length,
  });

  // 1. Update session (refreshes tokens if needed)
  const { response, user, error } = await updateSession(request);

  // 3. Protect routes
  const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
  const isAuthRoute = authRoutes.some(route => currentPath.startsWith(route));

  if (error) {
    logAuthInfo("proxy", "Continuing after refresh error; route guards will treat request as guest", {
      pathname: currentPath,
      error: summarizeAuthError(error),
    });
  }

  if (isProtectedRoute && !user) {
    // Redirect unauthenticated users to login
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    copyResponseCookies(response, redirectResponse);
    logAuthInfo("proxy", "Redirecting guest away from protected route", {
      pathname: currentPath,
      redirectTo: "/login",
    });
    return redirectResponse;
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users away from auth pages
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    copyResponseCookies(response, redirectResponse);
    logAuthInfo("proxy", "Redirecting authenticated user away from auth route", {
      pathname: currentPath,
      redirectTo: "/dashboard",
      user: summarizeUser(user),
    });
    return redirectResponse;
  }

  logAuthInfo("proxy", "Allowing request to continue", {
    pathname: currentPath,
    isProtectedRoute,
    isAuthRoute,
    user: summarizeUser(user),
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|json|webmanifest)$).*)",
  ],
};
