import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PAYSTACK PAYMENT INITIALIZATION
 *
 * This route generates a Paystack checkout link for a subscription.
 * It runs on the Next.js server to protect the PAYSTACK_SECRET_KEY.
 *
 * Security:
 * - User must be authenticated (checked via Supabase session)
 * - Secret key never leaves the server
 * - Payment reference is stored in the DB for reconciliation
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planSlug } = await req.json();

    // Fetch the plan details from DB
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("slug", planSlug)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (plan.price_ngn === 0) {
      return NextResponse.json({ error: "Free plan does not require payment" }, { status: 400 });
    }

    // Generate a unique reference
    const reference = `prepwise_${user.id.slice(0, 8)}_${Date.now()}`;

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: plan.price_ngn * 100, // Paystack uses kobo
        reference,
        currency: "NGN",
        callback_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(req.url).origin : "http://localhost:3000"}/dashboard?payment=success`,
        metadata: {
          user_id: user.id,
          plan_id: plan.id,
          plan_slug: plan.slug,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
    }

    // Record the pending transaction in our DB
    await supabase.from("payment_transactions").insert({
      user_id: user.id,
      plan_id: plan.id,
      paystack_reference: reference,
      paystack_status: "pending",
      amount_ngn: plan.price_ngn,
      metadata: { paystack_access_code: paystackData.data.access_code },
    });

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
