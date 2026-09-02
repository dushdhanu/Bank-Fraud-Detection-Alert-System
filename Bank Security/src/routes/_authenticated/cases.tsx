import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Panel } from "@/components/AppShell";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getConsoleSnapshot, getCaseDetail, updateCaseStatus } from "@/lib/fraud.functions";
import { ago, money, type Severity } from "@/lib/format";

type CaseStatus = "open" | "in_review" | "escalated" | "resolved";
const STATUSES: CaseStatus[] = ["open", "in_review", "escalated", "resolved"];

export const Route = createFileRoute("/_authenticated/cases")({
  head: () => ({
    meta: [
      { title: "Case Queue — Sentinel Risk Ops" },
      {
        name: "description",
        content:
          "Investigator case queue for flagged bank transactions: review, escalate or resolve with a full audit trail.",
      },
      { property: "og:title", content: "Case Queue — Sentinel Risk Ops" },
      {
        property: "og:description",
        content: "Review, escalate and resolve fraud cases with recorded analyst actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  const qc = useQueryClient();
  const snapshotFn = useServerFn(getConsoleSnapshot);
  const detailFn = useServerFn(getCaseDetail);
  const updateFn = useServerFn(updateCaseStatus);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const { data } = useQuery({ queryKey: ["snapshot"], queryFn: () => snapshotFn({}) });
  const { data: detail } = useQuery({
    queryKey: ["case", selectedId],
    queryFn: () => detailFn({ data: { caseId: selectedId! } }),
    enabled: Boolean(selectedId),
  });

  const update = useMutation({
    mutationFn: (status: CaseStatus) =>
      updateFn({ data: { caseId: selectedId!, status, ...(note ? { note } : {}) } }),
    onSuccess: () => {
      toast.success("Case updated");
      setNote("");
      qc.invalidateQueries();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed"),
  });

  const cases = data?.cases ?? [];

  return (
    <AppShell
      title="Case queue"
      subtitle="Flagged activity assigned to analysts, with an append-only action log."
    >
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title={`Cases · ${cases.length}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Ref", "Severity", "Summary", "Status", "Assignee", "Age"].map((h) => (
                  <th key={h} className="label-xs px-3 py-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`cursor-pointer border-b border-border/60 hover:bg-secondary ${
                    selectedId === c.id ? "bg-secondary" : ""
                  }`}
                >
                  <td className="px-3 py-2 font-mono text-xs text-foreground">{c.case_ref}</td>
                  <td className="px-3 py-2">
                    <SeverityBadge severity={c.severity as Severity} />
                  </td>
                  <td className="max-w-[22ch] truncate px-3 py-2 text-xs text-muted-foreground">
                    {c.summary}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] uppercase text-foreground">
                    {c.status}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {c.assignee_name ?? "unassigned"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {ago(c.created_at)}
                  </td>
                </tr>
              ))}
              {cases.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-sm text-muted-foreground" colSpan={6}>
                    No cases yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Panel>

        <Panel title="Case file">
          {!detail ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Select a case to review its file.
            </p>
          ) : (
            <div className="space-y-4 px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-foreground">{detail.case.case_ref}</span>
                <SeverityBadge severity={detail.case.severity as Severity} />
              </div>
              <p className="text-sm text-foreground">{detail.case.summary}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {detail.case.accounts?.holder_name ?? "—"} ·{" "}
                {detail.case.transactions
                  ? `${detail.case.transactions.txn_ref} ${money(detail.case.transactions.amount)}`
                  : "no linked transaction"}
              </p>

              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Investigator note (optional)"
                rows={3}
              />
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={detail.case.status === s ? "default" : "outline"}
                    disabled={update.isPending}
                    onClick={() => update.mutate(s)}
                  >
                    {s.replace("_", " ")}
                  </Button>
                ))}
              </div>

              <div>
                <p className="label-xs">Audit trail</p>
                <ul className="mt-2 space-y-2">
                  {detail.events.map((e) => (
                    <li key={e.id} className="border-l-2 border-border pl-3">
                      <p className="text-xs text-foreground">{e.action}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {e.actor_name} · {ago(e.created_at)} ago
                      </p>
                      {e.detail ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">{e.detail}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
