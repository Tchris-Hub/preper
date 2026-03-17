import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * SUBSCRIPTION PLANS API
 *
 * Returns all active subscription plans from the database.
 * This is a public endpoint (plans are not sensitive data).
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Plans fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
