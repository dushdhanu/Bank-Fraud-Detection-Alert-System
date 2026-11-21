import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const edit = (p, fn) => writeFileSync(p, fn(readFileSync(p, 'utf8')));
edit('src/lib/fraud.functions.ts', s => {
  s = s.replace('import { requireSupabaseAuth }', 'import { z } from "zod";\nimport { requireSupabaseAuth }');
  s = s.slice(0,s.indexOf('type Severity =')) + `function checked<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw new Error("Database operation failed. Check configuration and migrations.");
  return result.data;
}

` + s.slice(s.indexOf('export const getViewerContext'));
  s = s.replace('.inputValidator((data: { transactionId: string }) => data)', '.validator(z.object({ transactionId: z.string().uuid() }))')
    .replace('.inputValidator((data: { caseId: string }) => data)', '.validator(z.object({ caseId: z.string().uuid() }))')
    .replace('.inputValidator((data: { ruleId: string; enabled: boolean }) => data)', '.validator(z.object({ ruleId: z.string().uuid(), enabled: z.boolean() }))')
    .replace('    return {\n      transactions:', '    [txnRes, caseRes, eventRes, accountRes, alertRes].forEach(checked);\n    return {\n      transactions:')
    .replaceAll('const { data } = await context.supabase', 'const { data, error } = await context.supabase')
    .replaceAll('    return data ?? [];','    checked({ data, error });\n    return data ?? [];')
    .replace('    const { error } = await context.supabase\n      .from("rules")', `    const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError || !allowed) throw new Error("Administrator authorization required");
    const { error } = await context.supabase
      .from("rules")`)
    .replaceAll('if (error) throw new Error(error.message);','if (error) throw new Error("Update failed. Check permissions and configuration.");');
  return s.slice(0,s.indexOf('export const updateCaseStatus')) + `export const updateCaseStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ caseId: z.string().uuid(), status: z.enum(["open", "in_review", "escalated", "resolved"]), note: z.string().max(1000).optional() }))
  .handler(async ({ data, context }) => {
    checked(await context.supabase.rpc("review_bankguard_case", { case_id: data.caseId, new_status: data.status, note: data.note ?? null }));
    return { ok: true };
  });

export const simulateTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ eventId: z.string().uuid(), scenario: z.enum(["normal", "large_transfer", "new_device", "suspicious_transfer", "unusual_hour"]) }))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.rpc("simulate_bankguard_event", { event_id: data.eventId, scenario: data.scenario });
    if (result.error) throw new Error("Simulation failed. Check migrations or wait one minute if rate limited.");
    return result.data as { txnRef: string; riskScore: number; severity: string; status: string; hits?: number; caseRef?: string; duplicate: boolean };
  });

export const reviewAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ alertId: z.string().uuid(), verdict: z.enum(["recognized", "suspicious", "unresolved"]) }))
  .handler(async ({ data, context }) => {
    checked(await context.supabase.rpc("review_bankguard_alert", { alert_id: data.alertId, verdict: data.verdict }));
    return { ok: true };
  });
`;
});
edit('src/integrations/supabase/types.ts', s => s.replace('    Functions: {', `    Functions: {
      simulate_bankguard_event: { Args: { event_id: string; scenario: string }; Returns: Json }
      review_bankguard_case: { Args: { case_id: string; new_status: "open" | "in_review" | "escalated" | "resolved"; note: string | null }; Returns: undefined }
      review_bankguard_alert: { Args: { alert_id: string; verdict: string }; Returns: undefined }`)
  .replace('      alerts: {\n        Row: {','      alerts: {\n        Row: {\n          verification_status: "recognized" | "suspicious" | "unresolved"')
  .replace('      transactions: {\n        Row: {','      transactions: {\n        Row: {\n          currency: "USD" | "LKR"\n          simulated: boolean'));
const walk = dir => { for (const e of readdirSync(dir,{withFileTypes:true})) { const p = `${dir}/${e.name}`; if(e.isDirectory()) walk(p); else if(p.endsWith('.tsx')) edit(p,s => s.replaceAll('Sentinel Risk Ops','BankGuard').replaceAll('SENTINEL RISK OPS','BANKGUARD').replaceAll('SENTINEL','BANKGUARD').replaceAll('Sentinel simulates','BankGuard simulates')); } };
walk('src');
edit('src/routes/auth.tsx',s => s.replaceAll('Analyst sign in','Sign in').replace('Create analyst account','Create your account').replace('Access is limited to the fraud operations console.','Synthetic data only. Staff privileges require separate authorization.').replace('minLength={6}','minLength={mode === "signup" ? 12 : 1}').replace('Account created. Check your inbox if confirmation is required.','Check your inbox to verify your email before signing in.'));
edit('src/routes/_authenticated/console.tsx',s => s.replace('const [selectedId,','const [scenario, setScenario] = useState("normal");\n  const [selectedId,').replace('const { data, isLoading }','const { data, isLoading, isError, refetch }')
  .replace('simulateFn({})','simulateFn({ data: { eventId: crypto.randomUUID(), scenario: scenario as "normal" | "large_transfer" | "new_device" | "suspicious_transfer" | "unusual_hour" } })')
  .replaceAll('money(t.amount)','money(t.amount, t.currency)').replace('money(detail.transaction.amount)','money(detail.transaction.amount, detail.transaction.currency)')
  .replace('label="Flagged / blocked"','label="Flagged for review"').replace('<Kpi label="Flagged exposure" value={money(exposure)} delay={180} />','<Kpi label="High / critical alerts" value={String(data?.alerts.length ?? 0)} delay={180} />')
  .replace('Live simulated transaction stream, scored against the active rule set.','SIMULATED DATA · Prototype scores. No real accounts connected or blocked.')
  .replace('<Button onClick={() => simulate.mutate()}', `<div className="flex flex-wrap items-center gap-2">
        <label htmlFor="scenario" className="sr-only">Synthetic scenario</label>
        <select id="scenario" value={scenario} onChange={e => setScenario(e.target.value)} className="rounded border border-border bg-card p-2 text-sm">
          <option value="normal">Normal payment</option><option value="large_transfer">Large transfer</option>
          <option value="new_device">Unfamiliar device</option><option value="suspicious_transfer">Large transfer + new device</option>
          <option value="unusual_hour">Unusual local hour</option>
        </select><Button onClick={() => simulate.mutate()}`)
  .replace('{simulate.isPending ? "Simulating…" : "Simulate transaction"}\n        </Button>','{simulate.isPending ? "Simulating…" : "Simulate transaction"}\n        </Button></div>')
  .replace('      <div className="grid gap-3', `      {isError && <div role="alert" className="mb-4 rounded border border-destructive p-4">Could not load transactions. Check the database configuration. <Button variant="outline" onClick={() => refetch()}>Retry</Button></div>}
      <div className="grid gap-3`)
  .replace('onClick={() => setSelectedId(t.id)}', `onClick={() => setSelectedId(t.id)}
                      tabIndex={0}
                      aria-label={\`Inspect \${t.txn_ref}\`}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedId(t.id); } }}`));
edit('src/lib/format.ts',s => s.replace('money(value: number | string)','money(value: number | string, currency = "USD")').replace('currency: "USD",','currency,'));
edit('src/components/AppShell.tsx',s => s.replace('import { useQuery }','import { useQuery, useQueryClient }').replace('const navigate = useNavigate();','const navigate = useNavigate();\n  const queryClient = useQueryClient();').replace('await supabase.auth.signOut();','await supabase.auth.signOut();\n    queryClient.clear();')
  .replace('      <main className="px-4 py-6">','      <main className="px-4 py-6">\n        <p className="mb-4 rounded border border-border bg-secondary p-3 text-sm">Demonstration only · Synthetic transactions · Mobile delivery and financial data providers pending configuration.</p>'));
