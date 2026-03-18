import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ENTERPRISE MIDDLEWARE
 *
 * Runs on every request. Handles:
 * 1. SESSION REFRESH: Refreshes Supabase auth token on each request.
 * 2. ROUTE PROTECTION: Redirects unauthenticated users from protected routes.
 * 3. AUTH REDIRECT: Redirects authenticated users away from login/register.
 *
 * NOTE: The auth check is wrapped in try/catch to prevent Edge Runtime network
 * failures from blocking ALL requests. If Supabase is unreachable, auth state
 * degrades gracefully (user is treated as unauthenticated).
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, skip auth check entirely
  if (!supabaseUrl || !supabaseKey) {
    console.error("[Middleware] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.");
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session and get user. Wrapped in try/catch to handle Edge Runtime
  // fetch failures gracefully — avoids 27-second hangs on Windows.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Edge Runtime on Windows can sometimes fail to reach external hosts.
    // Treat as unauthenticated and let the page handle auth state client-side.
    console.warn("[Middleware] Supabase fetch failed — treating as unauthenticated.");
  }

  const { pathname } = request.nextUrl;

  const protectedPaths = ["/dashboard", "/exam", "/profile", "/history", "/notebook", "/subscription"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  const authPaths = ["/login", "/register"];
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
