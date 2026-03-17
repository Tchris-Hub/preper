import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ENTERPRISE MIDDLEWARE
 *
 * This middleware runs on EVERY request to the application.
 * It performs three critical functions:
 *
 * 1. SESSION REFRESH: Automatically refreshes the Supabase auth token
 *    before it expires, ensuring seamless user experience.
 *
 * 2. ROUTE PROTECTION: Redirects unauthenticated users away from
 *    protected routes (dashboard, exams, profile, etc.)
 *
 * 3. AUTH REDIRECT: Redirects already-authenticated users away from
 *    login/register pages to avoid confusion.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT remove this line. It refreshes the auth token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedPaths = ["/dashboard", "/exam", "/profile", "/history", "/notebook", "/subscription"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Define auth routes (login/register)
  const authPaths = ["/login", "/register"];
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // If user is NOT authenticated and trying to access a protected route
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // If user IS authenticated and trying to access login/register
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes - these handle their own auth)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
