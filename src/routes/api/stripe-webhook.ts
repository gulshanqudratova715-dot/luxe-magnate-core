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

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const stripe = getStripe();
          if (!stripe) {
            return new Response("Stripe not configured", { status: 500 });
          }

          const sig = request.headers.get("stripe-signature");
          const rawBody = await request.text();

          let event: Stripe.Event;

          // Verify signature if Webhook Secret is provided
          const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
          if (webhookSecret) {
            if (!sig) {
              return new Response("Missing Stripe signature header", { status: 400 });
            }
            try {
              event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
            } catch (err: any) {
              console.error("Webhook signature verification failed:", err.message);
              return new Response(`Webhook Error: ${err.message}`, { status: 400 });
            }
          } else {
            // No secret configured, parse body directly (only recommended for testing/dev environments)
            console.warn(
              "STRIPE_WEBHOOK_SECRET is not configured. Trusting raw payload (developer test mode).",
            );
            event = JSON.parse(rawBody) as Stripe.Event;
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Handle checkout.session.completed
          if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session.metadata;

            if (metadata) {
              // 1. Cart Order completed
              if (metadata.orderId) {
                console.log(`Processing completed order: ${metadata.orderId}`);
                const { error } = await supabaseAdmin
                  .from("orders")
                  .update({
                    status: "paid",
                    stripe_payment_intent:
                      typeof session.payment_intent === "string" ? session.payment_intent : null,
                    stripe_session_id: session.id,
                  })
                  .eq("id", metadata.orderId);

                if (error) {
                  console.error("Failed to update order status in Supabase:", error);
                  return new Response("Database update failed", { status: 500 });
                }
                console.log(`Order ${metadata.orderId} updated to paid successfully.`);
              }

              // 2. Subscription Membership completed
              if (metadata.userId && metadata.planName) {
                console.log(
                  `Processing subscription upgrade for user: ${metadata.userId} to ${metadata.planName}`,
                );
                const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(
                  metadata.userId,
                  {
                    user_metadata: {
                      subscription_tier: metadata.planName,
                      subscription_status: "active",
                    },
                  },
                );

                if (authErr) {
                  console.error(
                    "Failed to update user subscription metadata in Supabase:",
                    authErr,
                  );
                  return new Response("User metadata update failed", { status: 500 });
                }

                // Sync to profiles database table
                const { error: profileErr } = await supabaseAdmin
                  .from("profiles")
                  .update({
                    subscription_tier: metadata.planName,
                  })
                  .eq("id", metadata.userId);

                if (profileErr) {
                  console.error("Failed to update profile subscription tier:", profileErr);
                } else {
                  console.log(
                    `User ${metadata.userId} profile updated to ${metadata.planName} tier.`,
                  );
                }
              }
            }
          }

          // Handle customer.subscription.updated
          if (event.type === "customer.subscription.updated") {
            const subscription = event.data.object as Stripe.Subscription;
            const metadata = subscription.metadata || {};
            const userId = metadata.userId;
            const planName = metadata.planName;
            const status = subscription.status; // active, past_due, unpaid, canceled, trialing

            console.log(`Subscription updated for sub_id=${subscription.id}, status=${status}`);

            if (userId) {
              await supabaseAdmin.auth.admin.updateUserById(userId, {
                user_metadata: {
                  subscription_status: status,
                  ...(planName ? { subscription_tier: planName } : {}),
                },
              });

              if (planName) {
                await supabaseAdmin
                  .from("profiles")
                  .update({ subscription_tier: planName })
                  .eq("id", userId);
              }
            }
          }

          // Handle customer.subscription.deleted
          if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object as Stripe.Subscription;
            const metadata = subscription.metadata || {};
            const userId = metadata.userId;

            console.log(`Subscription canceled/deleted for sub_id=${subscription.id}`);

            if (userId) {
              await supabaseAdmin.auth.admin.updateUserById(userId, {
                user_metadata: {
                  subscription_status: "canceled",
                  subscription_tier: "Member",
                },
              });

              await supabaseAdmin
                .from("profiles")
                .update({ subscription_tier: "Member" })
                .eq("id", userId);
            }
          }

          // Handle invoice.payment_failed
          if (event.type === "invoice.payment_failed") {
            const invoice = event.data.object as Stripe.Invoice;
            console.warn(
              `Invoice payment failed for invoice_id=${invoice.id}, customer=${invoice.customer}`,
            );

            const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
            if (customerId && stripe) {
              try {
                const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
                if (!customer.deleted && customer.metadata?.userId) {
                  const userId = customer.metadata.userId;
                  await supabaseAdmin.auth.admin.updateUserById(userId, {
                    user_metadata: {
                      subscription_status: "past_due",
                    },
                  });
                }
              } catch (e) {
                console.error("Error retrieving customer on invoice.payment_failed:", e);
              }
            }
          }

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err: any) {
          console.error("Webhook endpoint exception:", err);
          return new Response(`Webhook Server Error: ${err.message}`, { status: 500 });
        }
      },
    },
  },
});
