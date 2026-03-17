import { createClient } from "@/lib/supabase/server";

/**
 * Tracks AI usage for a user.
 * 
 * @param feature The type of AI feature being used.
 * @param cost Optional cost estimate in USD.
 */
export async function logAIUsage(feature: string, cost: number = 0) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  await supabase
    .from("ai_usage_logs")
    .insert({
      user_id: user.id,
      feature_type: feature,
      cost_estimate: cost
    });
}
