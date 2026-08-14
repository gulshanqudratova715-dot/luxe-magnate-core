/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { z } from "zod";

let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2023-10-16" as any,
    });
  }
  return stripeClient;
}

const subscriptionSchema = z.object({
  planName: z.string(),
  interval: z.string(),
  priceUsd: z.number().positive(),
});

export const Route = createFileRoute("/api/subscription-session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const {
          data: { user },
          error: authError,
        } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
          return new Response("Unauthorized", { status: 401 });
        }

        try {
          const stripe = getStripe();
          if (!stripe) {
            console.warn("[Stripe] Missing keys. Running in MOCK mode.");
            return new Response(
              JSON.stringify({
                hasStripe: true,
                url: `${origin}/dashboard?subscription_success=true&plan=${planName}&session_id=mock_session_id`,
              }),
              { headers: { "content-type": "application/json" } },
            );
          }

          const rawBody = await request.json().catch(() => ({}));
          const parsed = subscriptionSchema.safeParse(rawBody);

          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                error: "Invalid subscription request",
                details: parsed.error.issues,
              }),
              { status: 400, headers: { "content-type": "application/json" } },
            );
          }

          const { planName, interval, priceUsd } = parsed.data;
          const userId = user.id;

          const origin = request.headers.get("origin") || "http://localhost:3000";

          // Calculate recurring price based on plan and billing interval
          const amountCents = Math.round(priceUsd * 100);

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: `LUXE MAGNATE - ${planName} Plan`,
                    description: `Private concierge subscription with priority booking and exclusive curated asset curation.`,
                  },
                  unit_amount: amountCents,
                  recurring: {
                    interval: interval === "annually" ? "year" : "month",
                  },
                },
                quantity: 1,
              },
            ],
            mode: "subscription",
            metadata: {
              userId,
              planName,
              interval,
            },
            success_url: `${origin}/dashboard?subscription_success=true&plan=${planName}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard?subscription_cancel=true`,
          });

          return new Response(JSON.stringify({ hasStripe: true, url: session.url }), {
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("Stripe Subscription Session Error:", err);
          return new Response(
            JSON.stringify({ error: err.message || "Failed to create subscription session" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
