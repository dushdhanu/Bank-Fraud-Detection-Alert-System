import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel Risk Ops — Bank Fraud Detection Console" },
      {
        name: "description",
        content:
          "Rule-based transaction monitoring, device and IP fingerprint logging, alerting and investigator case management for bank fraud detection.",
      },
      { property: "og:title", content: "Sentinel Risk Ops — Bank Fraud Detection Console" },
      {
        property: "og:description",
        content:
          "Monitor simulated bank transactions, score them against fraud rules, and manage investigator cases with a full audit trail.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    code: "01",
    title: "Transaction monitoring",
    body: "A live stream of simulated bank transactions with amount, location, device and IP metadata on every row.",
  },
  {
    code: "02",
    title: "Rule-based risk scoring",
    body: "Weighted rules (new device, high value, foreign geography, odd hours) combine into a 0-100 risk score and severity band.",
  },
  {
    code: "03",
    title: "Device & IP fingerprint log",
    body: "Every event records IP, ASN, browser, device and fingerprint — the metadata investigators legally work from.",
  },
  {
    code: "04",
    title: "Alerting",
    body: "High and critical activity generates account-holder and admin alerts with the triggering context attached.",
  },
  {
    code: "05",
    title: "Case management",
    body: "Flagged activity becomes a case an analyst can review, escalate or resolve, with assignee tracking.",
  },
  {
    code: "06",
    title: "Audit trail",
    body: "Every status change is written to an append-only event log so the investigation is reconstructable.",
  },
];

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/console" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-primary glow-pulse" />
            <span className="fade-in-soft font-mono text-sm font-semibold tracking-widest text-foreground">
              SENTINEL RISK OPS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="border-b border-border py-16">
          <p className="fade-up label-xs">Fraud detection & alert system</p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="fade-up mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl"
          >
            Detect suspicious bank transactions and hand investigators a clean trail.
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="fade-up mt-4 max-w-2xl text-base text-muted-foreground"
          >
            Sentinel simulates card and transfer activity, scores it against configurable fraud
            rules, records device and network metadata, alerts the account holder, and turns the
            worst of it into a managed case file. It does not identify or attribute attackers —
            that remains a matter for law enforcement.
          </p>
          <div
            style={{ animationDelay: "240ms" }}
            className="fade-up mt-7 flex flex-wrap gap-3"
          >
            <Button asChild className="transition-transform duration-200 hover:-translate-y-0.5">
              <Link to="/auth">Open the console</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
            {[
              { k: "Rules engine", v: "6 weighted rules" },
              { k: "Severity bands", v: "low → critical" },
              { k: "Metadata", v: "IP · ASN · device" },
              { k: "Case states", v: "open → resolved" },
            ].map((s, i) => (
              <div
                key={s.k}
                style={{ animationDelay: `${300 + i * 70}ms` }}
                className="fade-up row-hover bg-card px-4 py-4 hover:bg-secondary"
              >
                <p className="label-xs">{s.k}</p>
                <p className="mt-1.5 font-mono text-sm text-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </section>


        <section className="py-14">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">What it does</h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <article
                key={f.code}
                style={{ animationDelay: `${i * 60}ms` }}
                className="fade-up float row-hover group bg-card p-5 hover:bg-secondary"
              >
                <p className="label-xs transition-colors group-hover:text-primary">{f.code}</p>
                <h3 className="mt-2 text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </article>
            ))}

          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-6">
        <p className="mx-auto max-w-5xl font-mono text-xs text-muted-foreground">
          Sentinel Risk Ops — academic demonstration system. All data is simulated.
        </p>
      </footer>
    </div>
  );
}
