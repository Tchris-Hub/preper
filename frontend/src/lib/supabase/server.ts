import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and API Route Handlers.
 *
 * SECURITY MODEL:
 * 1. The user's auth session is stored in HTTP-only cookies (not localStorage).
 *    This prevents XSS attacks from stealing tokens.
 * 2. The server reads the cookie and passes the JWT to Supabase.
 * 3. Supabase enforces Row Level Security (RLS) using this JWT.
 * 4. Even if someone bypasses the Next.js server, the database itself
 *    will reject unauthorized access.
 *
 * This is a DOUBLE LAYER of security:
 * Layer 1: Next.js Server validates and processes requests.
 * Layer 2: Supabase RLS validates at the database level.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "MISSING SUPABASE ENV VARS: Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment."
    );
  }

  return createServerClient(
    supabaseUrl || "",
    supabaseAnonKey || "",
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
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
