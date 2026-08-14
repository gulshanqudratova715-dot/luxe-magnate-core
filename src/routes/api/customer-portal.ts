/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

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

export const Route = createFileRoute("/api/customer-portal")({
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
                url: `${origin}/dashboard?portal_success=true`,
              }),
              { headers: { "content-type": "application/json" } },
            );
          }

          const userId = user.id;
          const email = user.email;

          if (!email) {
            return new Response(
              JSON.stringify({ error: "Email is required for customer portal." }),
              { status: 400, headers: { "content-type": "application/json" } },
            );
          }

          const origin = request.headers.get("origin") || "http://localhost:3000";

          // Look up or create customer in Stripe
          let customerId = "";
          const customers = await stripe.customers.list({
            email,
            limit: 1,
          });

          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
          } else {
            const customer = await stripe.customers.create({
              email,
              metadata: {
                userId,
              },
            });
            customerId = customer.id;
          }

          // Create billing portal session
          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/dashboard`,
          });

          return new Response(JSON.stringify({ hasStripe: true, url: session.url }), {
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("Stripe Customer Portal Error:", err);
          return new Response(
            JSON.stringify({ error: err.message || "Failed to create portal session" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
