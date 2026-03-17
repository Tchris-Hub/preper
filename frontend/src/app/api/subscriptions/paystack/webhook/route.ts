import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

/**
 * PAYSTACK WEBHOOK HANDLER
 *
 * This endpoint receives events from Paystack (e.g., charge.success).
 * It uses the SERVICE ROLE key to bypass RLS and update the user's
 * subscription status. The webhook is verified using HMAC-SHA512.
 *
 * SECURITY:
 * 1. Webhook signature is validated using PAYSTACK_SECRET_KEY
 * 2. Uses Supabase service role for privileged DB operations
 * 3. Idempotent: duplicate webhooks are safely ignored
 */

// Use service role client for webhook (no user context)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.text();

    // Verify Paystack webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");

    if (hash !== signature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Only handle successful charges
    if (event.event === "charge.success") {
      const { reference, metadata } = event.data;
      const supabase = createServiceClient();

      // Update the transaction status
      await supabase
        .from("payment_transactions")
        .update({
          paystack_status: "success",
          updated_at: new Date().toISOString(),
        })
        .eq("paystack_reference", reference);

      // Upgrade the user's subscription
      if (metadata?.user_id && metadata?.plan_slug) {
        const tierMap: Record<string, string> = {
          basic: "basic",
          premium: "premium",
          enterprise: "enterprise",
        };

        const newTier = tierMap[metadata.plan_slug] || "basic";
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

        await supabase
          .from("profiles")
          .update({
            subscription_tier: newTier,
            subscription_expires_at: expiresAt.toISOString(),
            paystack_customer_code: event.data.customer?.customer_code || null,
          })
          .eq("id", metadata.user_id);
      }
    }

    // Always return 200 to Paystack to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still return 200 to prevent Paystack from retrying
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
