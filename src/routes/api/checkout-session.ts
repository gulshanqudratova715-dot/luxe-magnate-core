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

const checkoutSchema = z.object({
  orderId: z.string(),
  items: z
    .array(
      z.object({
        name: z.string(),
        image_url: z.string().optional().nullable(),
        price_cents: z.number(),
        qty: z.number(),
      }),
    )
    .min(1),
  tax_cents: z.number().default(0),
  currency: z.string().default("usd"),
});

export const Route = createFileRoute("/api/checkout-session")({
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
          const rawBody = await request.json().catch(() => ({}));
          const parsed = checkoutSchema.safeParse(rawBody);

          if (!parsed.success) {
            return new Response(
              JSON.stringify({
                error: "Invalid checkout request",
                details: parsed.error.issues,
              }),
              { status: 400, headers: { "content-type": "application/json" } },
            );
          }

          const { orderId, items, tax_cents, currency } = parsed.data;
          const userId = user.id;

          const origin = request.headers.get("origin") || "http://localhost:3000";

          const stripe = getStripe();
          if (!stripe) {
            console.warn("[Stripe] Missing keys. Running in MOCK mode.");
            return new Response(
              JSON.stringify({ 
                hasStripe: true, 
                url: `${origin}/dashboard?checkout_success=true&order_id=${orderId}&session_id=mock_session_id` 
              }),
              { headers: { "content-type": "application/json" } },
            );
          }

          // Build line items matching the cart contents
          const line_items = items.map((it: any) => ({
            price_data: {
              currency: (currency || "usd").toLowerCase(),
              product_data: {
                name: it.name,
                images: it.image_url
                  ? [it.image_url.startsWith("http") ? it.image_url : `${origin}${it.image_url}`]
                  : [],
              },
              unit_amount: it.price_cents,
            },
            quantity: it.qty,
          }));

          // Add tax line item if applicable
          if (tax_cents > 0) {
            line_items.push({
              price_data: {
                currency: (currency || "usd").toLowerCase(),
                product_data: {
                  name: "Estimated Tax (8%)",
                  images: [],
                },
                unit_amount: tax_cents,
              },
              quantity: 1,
            });
          }

          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            metadata: {
              orderId,
              userId,
            },
            success_url: `${origin}/dashboard?checkout_success=true&order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout?checkout_cancel=true`,
          });

          return new Response(JSON.stringify({ hasStripe: true, url: session.url }), {
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("Stripe Checkout Session Error:", err);
          return new Response(
            JSON.stringify({ error: err.message || "Failed to create checkout session" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
