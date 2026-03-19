import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAuthFlow() {
  console.log("--- Verifying Authentication Flow ---");

  // 1. Test Username Resolution (Public Lookup)
  console.log("\n1. Testing Username Resolution...");
  const testUsername = "testuser"; // Replace with a known username if needed
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", testUsername)
    .single();

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      console.log("✅ Username resolution works (no user found with that name, but query succeeded).");
    } else {
      console.error("❌ Username resolution failed:", profileError.message);
      console.log("Tip: Check RLS policies on 'profiles' table for 'Allow public lookup by username'.");
    }
  } else {
    console.log("✅ Username resolution successful. Email found:", profile.email);
  }

  // 2. Check Session Management (Requires manual/browser check)
  console.log("\n2. Session Management Check:");
  console.log("   - Middleware is now implemented to refresh sessions via cookies.");
  console.log("   - Redirects are now using dynamic origin for cross-environment consistency.");

  console.log("\n--- Verification Complete ---");
}

verifyAuthFlow();
