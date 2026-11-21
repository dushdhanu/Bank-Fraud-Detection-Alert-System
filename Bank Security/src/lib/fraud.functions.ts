import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function checked<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw new Error("Database operation failed. Check configuration and migrations.");
  return result.data;
}

export const getViewerContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const roleList = (roles ?? []).map((r) => r.role);
    return {
      userId,
      email: profile?.email ?? null,
      fullName: profile?.full_name ?? null,
      roles: roleList,
      isStaff: roleList.includes("admin") || roleList.includes("analyst"),
    };
  });

export const getConsoleSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [txnRes, caseRes, eventRes, accountRes, alertRes] = await Promise.all([
      supabase
        .from("transactions")
        .select("*, accounts(account_number, holder_name)")
        .order("occurred_at", { ascending: false })
        .limit(60),
      supabase.from("cases").select("*").order("created_at", { ascending: false }).limit(40),
      supabase.from("case_events").select("*").order("created_at", { ascending: false }).limit(40),
      supabase.from("accounts").select("id, account_number, holder_name"),
      supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(30),
    ]);
    [txnRes, caseRes, eventRes, accountRes, alertRes].forEach(checked);
    return {
      transactions: txnRes.data ?? [],
      cases: caseRes.data ?? [],
      events: eventRes.data ?? [],
      accounts: accountRes.data ?? [],
      alerts: alertRes.data ?? [],
    };
  });

export const getTransactionDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ transactionId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: txn } = await supabase
      .from("transactions")
      .select("*, accounts(id, account_number, holder_name, home_city, home_country)")
      .eq("id", data.transactionId)
      .maybeSingle();
    if (!txn) return null;
    const [{ data: hits }, { data: logs }, { data: linkedCase }] = await Promise.all([
      supabase.from("rule_hits").select("*").eq("transaction_id", data.transactionId),
      supabase
        .from("device_logs")
        .select("*")
        .eq("account_id", txn.account_id)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("cases").select("*").eq("transaction_id", data.transactionId).maybeSingle(),
    ]);
    return {
      transaction: txn,
      ruleHits: hits ?? [],
      deviceLogs: logs ?? [],
      linkedCase: linkedCase ?? null,
    };
  });

export const getRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("rules").select("*").order("code");
    checked({ data, error });
    return data ?? [];
  });

export const setRuleEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ ruleId: z.string().uuid(), enabled: z.boolean() }))
  .handler(async ({ data, context }) => {
    const { data: allowed, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError || !allowed) throw new Error("Administrator authorization required");
    const { error } = await context.supabase
      .from("rules")
      .update({ enabled: data.enabled })
      .eq("id", data.ruleId);
    if (error) throw new Error("Update failed. Check permissions and configuration.");
    return { ok: true };
  });

export const getDeviceLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("device_logs")
      .select("*, accounts(account_number, holder_name)")
      .order("created_at", { ascending: false })
      .limit(80);
    checked({ data, error });
    return data ?? [];
  });

export const getAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("alerts")
      .select("*, accounts(account_number, holder_name)")
      .order("created_at", { ascending: false })
      .limit(80);
    checked({ data, error });
    return data ?? [];
  });

export const getAuditTrail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("case_events")
      .select("*, cases(case_ref, summary)")
      .order("created_at", { ascending: false })
      .limit(120);
    checked({ data, error });
    return data ?? [];
  });

export const getCaseDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ caseId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: row } = await supabase
      .from("cases")
      .select("*, accounts(account_number, holder_name), transactions(txn_ref, amount, city, country)")
      .eq("id", data.caseId)
      .maybeSingle();
    if (!row) return null;
    const { data: events } = await supabase
      .from("case_events")
      .select("*")
      .eq("case_id", data.caseId)
      .order("created_at", { ascending: false });
    return { case: row, events: events ?? [] };
  });

export const updateCaseStatus = createServerFn({ method: "POST" })
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
