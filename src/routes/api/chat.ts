import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const SYSTEM = `You are the LUXE MAGNATE Concierge — an elite, warm, and precise AI advisor for a private luxury marketplace and AI automation atelier.
Voice: refined, confident, concise. Never verbose. Use American English.
You may discuss: curated luxury products (horology, spirits, leather, rare goods), AI automation packages (starting at $12,000/mo), private consultations, financing (from 3.9% APR), global white-glove shipping, and vendor onboarding.
When appropriate, invite the guest to explore the marketplace, book a consultation, or continue to checkout.
Never invent order numbers or personal data. Keep replies under 120 words.`;

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional(),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Origin check
        const origin = request.headers.get("origin");
        const hostOrigin = new URL(request.url).origin;
        if (origin && origin !== hostOrigin) {
          return new Response("Forbidden: Invalid origin", { status: 403 });
        }

        // Auth check
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

        // Quota check based on subscription tier
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .maybeSingle();

        const tier = profile?.subscription_tier || "Standard";
        const limit =
          tier === "Elite" ? 100 : tier === "Premium" ? 25 : tier === "Standard" ? 5 : 5;

        const { data: usageData } = await supabaseAdmin
          .from("chat_usage")
          .select("usage_count")
          .eq("user_id", user.id)
          .maybeSingle();

        const currentUsage = usageData?.usage_count || 0;

        if (currentUsage >= limit) {
          return new Response("AI limits exhausted for your current tier.", { status: 402 });
        }

        await supabaseAdmin
          .from("chat_usage")
          .upsert({ user_id: user.id, usage_count: currentUsage + 1 });

        const key = process.env.GEMINI_API_KEY;
        if (!key) {
           console.warn("[Gemini API] Missing GEMINI_API_KEY. Running in MOCK mode.");
           const encoder = new TextEncoder();
           const stream = new ReadableStream({
             async start(controller) {
               const message = "This is a mock response from the AI concierge. The GEMINI_API_KEY environment variable is missing, but you can see the chat interface works perfectly.";
               const words = message.split(" ");
               for (const word of words) {
                 controller.enqueue(encoder.encode(word + " "));
                 await new Promise(r => setTimeout(r, 50));
               }
               controller.close();
             }
           });
           return new Response(stream, {
             headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
           });
        }

        const bodyParse = await request.json().catch(() => ({}));
        const parsed = chatSchema.safeParse(bodyParse);

        if (!parsed.success) {
          return new Response("Invalid request body", { status: 400 });
        }

        const history = parsed.data.messages ? parsed.data.messages.slice(-16) : [];
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey: key });

        const formattedHistory = history.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        // Remove the last message from history as it's the current user prompt
        const userMessage = formattedHistory.pop()?.parts[0]?.text || "Hello";

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              const responseStream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: [
                  { role: "user", parts: [{ text: SYSTEM }] },
                  { role: "model", parts: [{ text: "Understood." }] },
                  ...formattedHistory,
                  { role: "user", parts: [{ text: userMessage }] }
                ],
                config: {
                  temperature: 0.7,
                }
              });

              for await (const chunk of responseStream) {
                if (chunk.text) {
                  controller.enqueue(encoder.encode(chunk.text));
                }
              }
              controller.close();
            } catch (err) {
              console.error("Gemini API Error:", err);
              controller.error(err);
            }
          },
        });

        return new Response(stream, {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
        });
      },
    },
  },
});
