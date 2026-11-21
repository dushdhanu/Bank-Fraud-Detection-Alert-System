import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getViewerContext } from "@/lib/fraud.functions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { to: "/console", label: "Console" },
  { to: "/cases", label: "Cases" },
  { to: "/rules", label: "Rules" },
  { to: "/devices", label: "Devices" },
  { to: "/alerts", label: "Alerts" },
  { to: "/audit", label: "Audit" },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const viewer = useServerFn(getViewerContext);
  const { data } = useQuery({ queryKey: ["viewer"], queryFn: () => viewer({}) });

  async function signOut() {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/console" className="group flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-primary" />
            <span className="font-mono text-sm font-semibold tracking-widest text-foreground transition-colors group-hover:text-primary">
              BANKGUARD
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {NAV.filter(item => data?.isStaff || ["/console", "/alerts", "/devices", "/rules"].includes(item.to)).map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                style={{ animationDelay: `${i * 40}ms` }}
                className="fade-in-soft relative rounded px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:bg-secondary hover:text-foreground after:absolute after:inset-x-2 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
                activeProps={{ className: "bg-secondary text-foreground after:scale-x-100" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
              {data?.email ?? "…"} · {data?.roles?.join(", ") || "no role"}
            </span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <p className="mb-4 rounded border border-border bg-secondary p-3 text-sm">Demonstration only · Synthetic transactions · Mobile delivery and financial data providers pending configuration.</p>
        <div className="fade-up mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="fade-up lift overflow-hidden rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--brand)_45%,transparent)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="label-xs">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

