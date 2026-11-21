import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Panel } from "@/components/AppShell";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import {
  getConsoleSnapshot,
  getTransactionDetail,
  simulateTransaction,
} from "@/lib/fraud.functions";
import { ago, money, maskAccount, type Severity } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/console")({
  head: () => ({
    meta: [
      { title: "Monitoring Console — BankGuard" },
      {
        name: "description",
        content:
          "Live transaction stream with risk scores, rule hits and device fingerprint metadata for fraud analysts.",
      },
      { property: "og:title", content: "Monitoring Console — BankGuard" },
      {
        property: "og:description",
        content: "Live transaction monitoring and risk scoring for the fraud operations team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsolePage,
});

function ConsolePage() {
  const qc = useQueryClient();
  const snapshotFn = useServerFn(getConsoleSnapshot);
  const detailFn = useServerFn(getTransactionDetail);
  const simulateFn = useServerFn(simulateTransaction);
  const [scenario, setScenario] = useState("normal");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["snapshot"],
    queryFn: () => snapshotFn({}),
  });

  const { data: detail } = useQuery({
    queryKey: ["txn", selectedId],
    queryFn: () => detailFn({ data: { transactionId: selectedId! } }),
    enabled: Boolean(selectedId),
  });

  const simulate = useMutation({
    mutationFn: () => simulateFn({ data: { eventId: crypto.randomUUID(), scenario: scenario as "normal" | "large_transfer" | "new_device" | "suspicious_transfer" | "unusual_hour" } }),
    onSuccess: (res) => {
      toast.success(
        `${res.txnRef} scored ${res.riskScore} (${res.severity})${res.caseRef ? ` · ${res.caseRef} opened` : ""}`,
      );
      qc.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Simulation failed"),
  });

  const txns = data?.transactions ?? [];
  const openCases = (data?.cases ?? []).filter((c) => c.status !== "resolved");
  const flagged = txns.filter((t) => t.status !== "cleared");
  const critical = txns.filter((t) => t.severity === "critical");

  return (
    <AppShell
      title="Monitoring console"
      subtitle="SIMULATED DATA · Prototype scores. No real accounts connected or blocked."
      actions={
        <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="scenario" className="sr-only">Synthetic scenario</label>
        <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="rounded border border-border bg-card p-2 text-sm">
          <option value="normal">Normal payment</option><option value="large_transfer">Large transfer</option>
          <option value="new_device">Unfamiliar device</option><option value="suspicious_transfer">Large transfer + new device</option>
          <option value="unusual_hour">Unusual local hour</option>
        </select><Button onClick={() => simulate.mutate()} disabled={simulate.isPending}>
          {simulate.isPending ? "Simulating…" : "Simulate transaction"}
        </Button></div>
      }
    >
      {isError && <div role="alert" className="mb-4 rounded border border-destructive p-4">Could not load transactions. Check the database configuration. <Button variant="outline" onClick={() => refetch()}>Retry</Button></div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Transactions (recent)" value={String(txns.length)} delay={0} />
        <Kpi label="Flagged for review" value={String(flagged.length)} tone="high" delay={60} />
        <Kpi label="Critical severity" value={String(critical.length)} tone="critical" delay={120} />
        <Kpi label="High / critical alerts" value={String(data?.alerts.length ?? 0)} delay={180} />
      </div>


      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Panel title={`Transaction stream · ${txns.length}`}>
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left">
                  {["Ref", "Account", "Amount", "Location", "Risk", "Status", "Age"].map((h) => (
                    <th key={h} className="label-xs px-3 py-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td className="px-3 py-6 text-muted-foreground" colSpan={7}>
                      Loading stream…
                    </td>
                  </tr>
                ) : (
                  txns.map((t, i) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      tabIndex={0}
                      aria-label={`Inspect ${t.txn_ref}`}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedId(t.id); } }}
                      style={{ animationDelay: `${Math.min(i, 15) * 25}ms` }}
                      className={`fade-up row-hover cursor-pointer border-b border-border/60 hover:bg-secondary ${
                        selectedId === t.id
                          ? "bg-secondary shadow-[inset_2px_0_0_0_var(--brand)]"
                          : ""
                      }`}
                    >

                      <td className="px-3 py-2 font-mono text-xs text-foreground">{t.txn_ref}</td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {t.accounts ? maskAccount(t.accounts.account_number) : "—"}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {money(t.amount, t.currency)}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {t.city}, {t.country}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-foreground">{t.risk_score}</span>
                          <SeverityBadge severity={t.severity as Severity} />
                        </div>
                      </td>
                      <td className="px-3 py-2 font-mono text-[11px] uppercase text-muted-foreground">
                        {t.status}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {ago(t.occurred_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Transaction detail">
            {!selectedId ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                Select a transaction to inspect its rule hits and device metadata.
              </p>
            ) : !detail ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">Loading…</p>
            ) : (
              <div key={detail.transaction.id} className="fade-up space-y-4 px-4 py-4">

                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">
                    {detail.transaction.txn_ref}
                  </span>
                  <SeverityBadge severity={detail.transaction.severity as Severity} />
                </div>
                <dl className="grid grid-cols-2 gap-y-2 text-xs">
                  <Field k="Holder" v={detail.transaction.accounts?.holder_name ?? "—"} />
                  <Field k="Amount" v={money(detail.transaction.amount, detail.transaction.currency)} />
                  <Field k="Merchant" v={detail.transaction.merchant ?? "—"} />
                  <Field k="Risk score" v={String(detail.transaction.risk_score)} />
                  <Field k="IP" v={detail.transaction.ip_address ?? "—"} />
                  <Field k="ASN" v={detail.transaction.asn ?? "—"} />
                  <Field k="Device" v={detail.transaction.device ?? "—"} />
                  <Field k="Browser" v={detail.transaction.browser ?? "—"} />
                  <Field k="Fingerprint" v={detail.transaction.fingerprint ?? "—"} />
                  <Field k="New device" v={detail.transaction.new_device ? "yes" : "no"} />
                </dl>

                <div>
                  <p className="label-xs">Rule hits</p>
                  <ul className="mt-2 space-y-1.5">
                    {detail.ruleHits.length === 0 ? (
                      <li className="text-xs text-muted-foreground">No rules fired.</li>
                    ) : (
                      detail.ruleHits.map((h, i) => (
                        <li
                          key={h.id}
                          style={{ animationDelay: `${i * 50}ms` }}
                          className="fade-up row-hover flex items-center justify-between rounded border border-border bg-secondary px-2.5 py-1.5 hover:border-primary/40"
                        >

                          <span className="text-xs text-foreground">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {h.rule_code}
                            </span>{" "}
                            {h.label}
                          </span>
                          <span className="font-mono text-xs text-foreground">+{h.points}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {detail.linkedCase ? (
                  <p className="font-mono text-xs text-muted-foreground">
                    Linked case {detail.linkedCase.case_ref} · {detail.linkedCase.status}
                  </p>
                ) : null}
              </div>
            )}
          </Panel>

          <Panel title={`Open cases · ${openCases.length}`}>
            <ul className="divide-y divide-border">
              {openCases.slice(0, 6).map((c, i) => (
                <li
                  key={c.id}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className="fade-up row-hover flex items-start gap-3 px-4 py-2.5 hover:bg-secondary"
                >

                  <SeverityBadge severity={c.severity as Severity} />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-foreground">{c.case_ref}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.summary}</p>
                  </div>
                </li>
              ))}
              {openCases.length === 0 ? (
                <li className="px-4 py-6 text-sm text-muted-foreground">No open cases.</li>
              ) : null}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Kpi({
  label,
  value,
  tone,
  delay = 0,
}: {
  label: string;
  value: string;
  tone?: Severity;
  delay?: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="fade-up lift rounded-lg border border-border bg-card px-4 py-3 hover:-translate-y-0.5 hover:border-primary/40"
    >
      <p className="label-xs">{label}</p>
      <p
        className={`mt-1.5 font-mono text-2xl tabular-nums ${
          tone === "critical" ? "text-critical" : tone === "high" ? "text-high" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}


function Field({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="label-xs self-center">{k}</dt>
      <dd className="truncate font-mono text-xs text-foreground">{v}</dd>
    </>
  );
}
