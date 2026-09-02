import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, Panel } from "@/components/AppShell";
import { getAuditTrail } from "@/lib/fraud.functions";
import { ago } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({
    meta: [
      { title: "Audit Trail — Sentinel Risk Ops" },
      {
        name: "description",
        content:
          "Append-only log of every analyst action taken on fraud cases, with actor, action and timestamp.",
      },
      { property: "og:title", content: "Audit Trail — Sentinel Risk Ops" },
      {
        property: "og:description",
        content: "Reconstruct any investigation from the append-only case event log.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const auditFn = useServerFn(getAuditTrail);
  const { data } = useQuery({ queryKey: ["audit"], queryFn: () => auditFn({}) });
  const events = data ?? [];

  return (
    <AppShell title="Audit trail" subtitle="Append-only record of analyst actions across all cases.">
      <Panel title={`Events · ${events.length}`}>
        <ol className="divide-y divide-border">
          {events.map((e) => (
            <li key={e.id} className="px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-mono text-xs text-foreground">
                  {e.cases?.case_ref ?? "—"}
                </span>
                <span className="text-sm text-foreground">{e.action}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {e.actor_name} · {ago(e.created_at)} ago
                </span>
              </div>
              {e.detail ? (
                <p className="mt-1 text-xs text-muted-foreground">{e.detail}</p>
              ) : null}
            </li>
          ))}
          {events.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted-foreground">No recorded actions yet.</li>
          ) : null}
        </ol>
      </Panel>
    </AppShell>
  );
}
