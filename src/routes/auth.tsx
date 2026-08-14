import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Membership · LUXE MAGNATE" },
      { name: "description", content: "Sign in or request membership to LUXE MAGNATE." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Very strict same-origin check
      if (event.origin !== window.location.origin || event.source === null) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        try {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (error) throw error;
          if (session) {
            toast.success("Successfully logged in with Google!");
            navigate({ to: "/dashboard" });
          }
        } catch (e) {
          console.error("Failed verifying session after oauth:", e);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Welcome to LUXE MAGNATE", { description: "Check your email to confirm." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { handleGoogleSignIn } = await import("@/lib/firebase");
      const user = await handleGoogleSignIn();
      if (user) {
        toast.success("Successfully logged in with Google via Firebase!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md glass rounded-2xl p-8 sm:p-10 shadow-luxe animate-fade-up">
        <div className="grid h-12 w-12 place-items-center rounded-lg gold-gradient mx-auto mb-6 shadow-gold-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl text-center gold-text">
          {mode === "signin" ? "Welcome back" : "Request access"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2 mb-8">
          {mode === "signin" ? "Sign in to your membership." : "Create your LUXE MAGNATE account."}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-xs text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-muted/50 rounded-md px-3 py-2.5 text-sm border border-transparent focus:border-gold/40 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-muted/50 rounded-md px-3 py-2.5 text-sm border border-transparent focus:border-gold/40 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-primary-foreground py-3 rounded-md font-medium disabled:opacity-60 hover-lift"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gold/40 text-gold bg-transparent py-3 rounded-md font-medium hover:bg-gold/10 transition hover-lift disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        <div className="mt-4 pt-4 border-t border-muted/60">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("demo_mode", "true");
              toast.success("Welcome, Demo User!");
              navigate({ to: "/dashboard" });
            }}
            className="w-full bg-emerald/10 border border-emerald/40 text-emerald py-3 rounded-md font-medium hover:bg-emerald/20 transition hover-lift"
          >
            Access Demo Dashboard
          </button>
        </div>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-6 text-sm text-muted-foreground hover:text-gold transition"
        >
          {mode === "signin" ? "New here? Request access" : "Already a member? Sign in"}
        </button>
      </div>
    </div>
  );
}
