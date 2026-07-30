import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth-callback")({
  head: () => ({
    meta: [{ title: "Authenticating · LUXE MAGNATE" }],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const [status, setStatus] = useState("Verifying authorization...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let handled = false;

    async function processSession(session: Session | null) {
      if (handled) return;
      handled = true;
      setStatus("Authentication successful! Connecting...");

      if (window.opener) {
        try {
          window.opener.postMessage(
            {
              type: "OAUTH_AUTH_SUCCESS",
              session: session
                ? {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                  }
                : null,
            },
            window.location.origin,
          );
          setTimeout(() => {
            window.close();
          }, 300);
          return;
        } catch (e) {
          console.error("Failed to post message to opener:", e);
        }
      }
      navigate({ to: "/dashboard" });
    }

    async function handleCallback() {
      try {
        // 1. Check for provider error in query or hash
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.startsWith("#")
            ? window.location.hash.substring(1)
            : window.location.hash,
        );

        const oauthError =
          searchParams.get("error_description") ||
          searchParams.get("error") ||
          hashParams.get("error_description") ||
          hashParams.get("error");

        if (oauthError) {
          setErrorMessage(oauthError);
          setStatus(`Authentication failed: ${oauthError}`);
          return;
        }

        // 2. Check if session already exists
        const {
          data: { session: existingSession },
          error: existingErr,
        } = await supabase.auth.getSession();

        if (existingErr) {
          console.error("Error getting session:", existingErr);
        }

        if (existingSession) {
          await processSession(existingSession);
          return;
        }

        // 3. Check for auth code parameter
        const code = searchParams.get("code") || hashParams.get("code");

        if (code) {
          setStatus("Exchanging authorization code...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (!error && data?.session) {
            await processSession(data.session);
            return;
          }

          if (error) {
            console.error("exchangeCodeForSession error:", error);
            // Re-check session in case detectSessionInUrl exchanged it automatically
            const {
              data: { session: autoSession },
            } = await supabase.auth.getSession();

            if (autoSession) {
              await processSession(autoSession);
              return;
            }
            setStatus("Authenticating session with provider...");
          }
        }

        // 4. Listen for auth state changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (
            session &&
            (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION")
          ) {
            await processSession(session);
          }
        });

        // 5. Grace period for session detection
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const {
          data: { session: finalSession },
        } = await supabase.auth.getSession();

        if (finalSession) {
          subscription.unsubscribe();
          await processSession(finalSession);
        } else if (!handled) {
          subscription.unsubscribe();
          if (!code && !searchParams.get("access_token")) {
            setStatus("No authorization parameters detected.");
            setErrorMessage(
              "No authorization code or session parameter was present in the callback URL.",
            );
          } else if (!errorMessage) {
            setStatus("Session exchange timed out.");
            setErrorMessage("Could not establish a session from the provided authorization code.");
          }
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
        setStatus(`Authentication error: ${msg}`);
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="text-center space-y-4 max-w-md w-full">
        {!errorMessage && <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />}
        <h1 className="text-xl font-medium tracking-tight">LUXE MAGNATE</h1>
        <p className="text-sm text-gray-400">{status}</p>
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200 text-left overflow-auto max-h-40 shadow-lg">
            <span className="font-semibold block mb-1 text-red-400">Error Details:</span>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
