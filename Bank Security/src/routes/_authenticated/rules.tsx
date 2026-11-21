import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell, Panel } from "@/components/AppShell";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Switch } from "@/components/ui/switch";
import { getRules, setRuleEnabled, getViewerContext } from "@/lib/fraud.functions";
import type { Severity } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/rules")({
  head: () => ({
    meta: [
      { title: "Detection Rules — BankGuard" },
      {
        name: "description",
        content:
          "Weighted fraud detection rules that score each transaction: new device, high value, foreign geography and odd-hour activity.",
      },
      { property: "og:title", content: "Detection Rules — BankGuard" },
      {
        property: "og:description",
        content: "Enable, disable and inspect the weighted rules behind every risk score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  const qc = useQueryClient();
  const rulesFn = useServerFn(getRules);
  const toggleFn = useServerFn(setRuleEnabled);
  const viewerFn = useServerFn(getViewerContext);
  const { data: viewer } = useQuery({ queryKey: ["viewer"], queryFn: () => viewerFn({}) });

  const { data } = useQuery({ queryKey: ["rules"], queryFn: () => rulesFn({}) });

  const toggle = useMutation({
    mutationFn: (vars: { ruleId: string; enabled: boolean }) => toggleFn({ data: vars }),
    onSuccess: () => {
      toast.success("Rule updated");
      qc.invalidateQueries({ queryKey: ["rules"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Only admins can edit rules"),
  });

  const rules = data ?? [];

  return (
    <AppShell
      title="Detection rules"
      subtitle="Each firing rule adds its weight to the transaction risk score (0-100)."
    >
      <Panel title={`Rule set · ${rules.length}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {["Code", "Rule", "Description", "Weight", "Severity", "Enabled"].map((h) => (
                <th key={h} className="label-xs px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b border-border/60">
                <td className="px-3 py-2.5 font-mono text-xs text-foreground">{r.code}</td>
                <td className="px-3 py-2.5 text-xs text-foreground">{r.label}</td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{r.description}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-foreground">+{r.weight}</td>
                <td className="px-3 py-2.5">
                  <SeverityBadge severity={r.severity as Severity} />
                </td>
                <td className="px-3 py-2.5">
                  <Switch
                    aria-label={`Enable ${r.label}`}
                    disabled={!viewer?.roles.includes("admin") || toggle.isPending || ["R-055", "R-090"].includes(r.code)}
                    checked={r.enabled}
                    onCheckedChange={(v) => toggle.mutate({ ruleId: r.id, enabled: v })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </AppShell>
  );
}
