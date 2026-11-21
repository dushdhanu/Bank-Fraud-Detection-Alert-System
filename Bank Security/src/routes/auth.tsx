import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Analyst Sign In — BankGuard" },
      {
        name: "description",
        content:
          "Sign in to the BankGuard console to review flagged transactions, cases and fraud alerts.",
      },
      { property: "og:title", content: "Analyst Sign In — BankGuard" },
      {
        property: "og:description",
        content: "Secure access to the fraud detection and case management console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/console" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/console`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Check your inbox to verify your email before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/console" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-mono text-sm font-semibold tracking-widest text-foreground">
            BANKGUARD
          </span>
        </Link>

        <div className="rounded-lg border border-border bg-card p-6">
          <h1 className="text-lg font-semibold text-foreground">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Synthetic data only. Staff privileges require separate authorization.
          </p>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            {mode === "signup" ? (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ada Analyst"
                  required
                />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={mode === "signup" ? 12 : 1}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
