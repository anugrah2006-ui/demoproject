import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const protectedRoutes = ["/dashboard", "/chat-history", "/combinations", "/manage-subscription", "/settings"];
const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

export async function proxy(request: NextRequest) {
  // 1. Update session (refreshes tokens if needed)
  const response = await updateSession(request);

  // 2. Read the session to determine auth state
  // Note: we instantiate a simple server client here just to check the session state securely.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Handled by updateSession already
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  const currentPath = request.nextUrl.pathname;
  
  // 3. Protect routes
  const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
  const isAuthRoute = authRoutes.some(route => currentPath.startsWith(route));

  if (isProtectedRoute && !user) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && user) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
