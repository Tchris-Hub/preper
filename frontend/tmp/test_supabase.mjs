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

async function checkSupabase() {
  console.log("Checking Supabase connection to:", supabaseUrl);
  
  // 1. Check if we can reach the health endpoint or a simple table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('count', { count: 'exact', head: true });

  if (profileError) {
    console.error("Error accessing 'profiles' table:", profileError.message);
    console.log("Tip: Ensure the 'profiles' table exists and has RLS policies for anonymous reads or use an admin key for testing.");
  } else {
    console.log("Successfully connected to 'profiles' table. Row count:", profileData);
  }

  // 2. Try a simple auth check
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error("Auth session check error:", authError.message);
  } else {
    console.log("Auth system is responding.");
  }
}

checkSupabase();
