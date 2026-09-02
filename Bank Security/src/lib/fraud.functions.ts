import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Severity = "low" | "medium" | "high" | "critical";
type CaseStatus = "open" | "in_review" | "escalated" | "resolved";

function scoreToSeverity(score: number): Severity {
  if (score >= 85) return "critical";
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function pad(n: number, size: number): string {
  return String(n).padStart(size, "0");
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
  .inputValidator((data: { transactionId: string }) => data)
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
    const { data } = await context.supabase.from("rules").select("*").order("code");
    return data ?? [];
  });

export const setRuleEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { ruleId: string; enabled: boolean }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("rules")
      .update({ enabled: data.enabled })
      .eq("id", data.ruleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getDeviceLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("device_logs")
      .select("*, accounts(account_number, holder_name)")
      .order("created_at", { ascending: false })
      .limit(80);
    return data ?? [];
  });

export const getAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("alerts")
      .select("*, accounts(account_number, holder_name)")
      .order("created_at", { ascending: false })
      .limit(80);
    return data ?? [];
  });

export const getAuditTrail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("case_events")
      .select("*, cases(case_ref, summary)")
      .order("created_at", { ascending: false })
      .limit(120);
    return data ?? [];
  });

export const getCaseDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { caseId: string }) => data)
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
  .inputValidator((data: { caseId: string; status: CaseStatus; note?: string }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .maybeSingle();
    const actor = profile?.full_name ?? profile?.email ?? "analyst";

    const { error } = await supabase
      .from("cases")
      .update({
        status: data.status,
        assignee_id: userId,
        assignee_name: actor,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.caseId);
    if (error) throw new Error(error.message);

    await supabase.from("case_events").insert({
      case_id: data.caseId,
      actor_name: actor,
      action: `status → ${data.status}`,
      detail: data.note ?? null,
    });
    return { ok: true };
  });

const CITIES = [
  { city: "Lagos", country: "NG" },
  { city: "Kyiv", country: "UA" },
  { city: "Bucharest", country: "RO" },
  { city: "Accra", country: "GH" },
  { city: "Singapore", country: "SG" },
  { city: "Miami", country: "US" },
] as const;
const DEVICES = ["Android 13", "iPhone 15", "Windows 11", "Ubuntu 22.04"] as const;
const BROWSERS = ["Chrome 128", "Safari 17", "Firefox 130", "Headless Chrome"] as const;
const MERCHANTS = ["Global Cash ATM", "CryptoRamp", "SkyMiles Travel", "Zenith POS", "Wire Transfer"] as const;

export const simulateTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [{ data: accounts }, { data: rules }, { data: profile }] = await Promise.all([
      supabase.from("accounts").select("id, account_number, holder_name, home_city, home_country"),
      supabase.from("rules").select("*").eq("enabled", true),
      supabase.from("profiles").select("full_name, email").eq("id", userId).maybeSingle(),
    ]);
    if (!accounts || accounts.length === 0) throw new Error("No accounts available to simulate");
    const account = pick(accounts);
    const actor = profile?.full_name ?? profile?.email ?? "analyst";

    const loc = pick(CITIES);
    const device = pick(DEVICES);
    const browser = pick(BROWSERS);
    const merchant = pick(MERCHANTS);
    const amount = Math.round((Math.random() * 4800 + 40) * 100) / 100;
    const hour = new Date().getUTCHours();
    const newDevice = Math.random() < 0.5;
    const foreign = loc.country !== account.home_country;
    const ip = `${41 + Math.floor(Math.random() * 180)}.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255,
    )}.${Math.floor(Math.random() * 255)}`;

    const hits: { rule_code: string; label: string; points: number; severity: Severity }[] = [];
    for (const rule of rules ?? []) {
      let fired = false;
      switch (rule.code) {
        case "R-114":
          fired = amount > 1000 && newDevice;
          break;
        case "R-072":
          fired = foreign;
          break;
        case "R-031":
          fired = hour < 5;
          break;
        case "R-018":
          fired = amount > 3000;
          break;
        case "R-055":
          fired = browser === "Headless Chrome";
          break;
        case "R-090":
          fired = newDevice;
          break;
        default:
          fired = false;
      }
      if (fired) {
        hits.push({
          rule_code: rule.code,
          label: rule.label,
          points: rule.weight,
          severity: rule.severity as Severity,
        });
      }
    }

    const score = Math.min(100, hits.reduce((sum, h) => sum + h.points, 0));
    const severity = scoreToSeverity(score);
    const status = score >= 85 ? "blocked" : score >= 45 ? "flagged" : "cleared";
    const suffix = pad(Math.floor(Math.random() * 99999), 5);

    const { data: txn, error: txnError } = await supabase
      .from("transactions")
      .insert({
        txn_ref: `TXN-${suffix}`,
        account_id: account.id,
        amount,
        kind: "card_purchase",
        merchant,
        city: loc.city,
        country: loc.country,
        ip_address: ip,
        asn: `AS${13000 + Math.floor(Math.random() * 50000)}`,
        device,
        browser,
        fingerprint: `fp_${Math.random().toString(16).slice(2, 12)}`,
        new_device: newDevice,
        risk_score: score,
        severity,
        status,
      })
      .select("*")
      .single();
    if (txnError || !txn) throw new Error(txnError?.message ?? "Insert failed");

    if (hits.length > 0) {
      await supabase.from("rule_hits").insert(hits.map((h) => ({ ...h, transaction_id: txn.id })));
    }

    await supabase.from("device_logs").insert({
      account_id: account.id,
      event: "transaction",
      ip_address: ip,
      asn: txn.asn,
      device,
      browser,
      fingerprint: txn.fingerprint,
      city: loc.city,
      country: loc.country,
      first_seen: newDevice,
    });

    let caseRef: string | null = null;
    if (severity === "high" || severity === "critical") {
      caseRef = `CASE-${pad(Math.floor(Math.random() * 9999), 4)}`;
      const { data: newCase } = await supabase
        .from("cases")
        .insert({
          case_ref: caseRef,
          transaction_id: txn.id,
          account_id: account.id,
          severity,
          status: "open",
          summary: `${severity.toUpperCase()} risk ${merchant} charge from ${loc.city}, ${loc.country}`,
        })
        .select("id")
        .single();
      if (newCase) {
        await supabase.from("case_events").insert({
          case_id: newCase.id,
          actor_name: actor,
          action: "case opened",
          detail: `Auto-opened from ${txn.txn_ref} at risk ${score}`,
        });
      }
      await supabase.from("alerts").insert({
        transaction_id: txn.id,
        account_id: account.id,
        channel: "email",
        recipient: `${account.holder_name.split(" ")[0]?.toLowerCase()}@example.com`,
        message: `Suspicious ${merchant} charge of $${amount} in ${loc.city}. Reply BLOCK to freeze the card.`,
        severity,
        delivered: true,
      });
    }

    return {
      txnRef: txn.txn_ref,
      riskScore: score,
      severity,
      status,
      hits: hits.length,
      caseRef,
    };
  });
