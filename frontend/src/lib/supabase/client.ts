import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser (Client Components).
 *
 * SECURITY NOTE: This client uses the ANON key, which is safe to expose
 * in the browser. All data access is controlled by Row Level Security (RLS)
 * policies defined in the database. The user's JWT is automatically
 * attached to every request via cookies managed by @supabase/ssr.
 *
 * Use this client ONLY for:
 * - Lightweight, non-sensitive reads
 * - Supabase Realtime subscriptions
 * - Auth state listeners (onAuthStateChange)
 *
 * For sensitive operations (grading, payments), use Server Actions instead.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
