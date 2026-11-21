import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-UH_Jp6hR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fraud.functions-C89tNMho.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function scoreToSeverity(score) {
	if (score >= 85) return "critical";
	if (score >= 70) return "high";
	if (score >= 45) return "medium";
	return "low";
}
function pick(items) {
	return items[Math.floor(Math.random() * items.length)];
}
function pad(n, size) {
	return String(n).padStart(size, "0");
}
var getViewerContext_createServerFn_handler = createServerRpc({
	id: "a9da72ce9fb55f2b5f663205355dea6fbada0b8e8f1284c769d610b0f7fb5a02",
	name: "getViewerContext",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getViewerContext.__executeServer(opts));
var getViewerContext = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getViewerContext_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [{ data: profile }, { data: roles }] = await Promise.all([supabase.from("profiles").select("id, email, full_name").eq("id", userId).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", userId)]);
	const roleList = (roles ?? []).map((r) => r.role);
	return {
		userId,
		email: profile?.email ?? null,
		fullName: profile?.full_name ?? null,
		roles: roleList,
		isStaff: roleList.includes("admin") || roleList.includes("analyst")
	};
});
var getConsoleSnapshot_createServerFn_handler = createServerRpc({
	id: "6840e2e3277385102c6c862d3e152e14a91b1fac315c4b83516bf934285de02f",
	name: "getConsoleSnapshot",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getConsoleSnapshot.__executeServer(opts));
var getConsoleSnapshot = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getConsoleSnapshot_createServerFn_handler, async ({ context }) => {
	const { supabase } = context;
	const [txnRes, caseRes, eventRes, accountRes, alertRes] = await Promise.all([
		supabase.from("transactions").select("*, accounts(account_number, holder_name)").order("occurred_at", { ascending: false }).limit(60),
		supabase.from("cases").select("*").order("created_at", { ascending: false }).limit(40),
		supabase.from("case_events").select("*").order("created_at", { ascending: false }).limit(40),
		supabase.from("accounts").select("id, account_number, holder_name"),
		supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(30)
	]);
	return {
		transactions: txnRes.data ?? [],
		cases: caseRes.data ?? [],
		events: eventRes.data ?? [],
		accounts: accountRes.data ?? [],
		alerts: alertRes.data ?? []
	};
});
var getTransactionDetail_createServerFn_handler = createServerRpc({
	id: "317ce39b9a3214004233d607fe4ff3bcaff75c9c9c65baf7af06abe6284535ac",
	name: "getTransactionDetail",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getTransactionDetail.__executeServer(opts));
var getTransactionDetail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(getTransactionDetail_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: txn } = await supabase.from("transactions").select("*, accounts(id, account_number, holder_name, home_city, home_country)").eq("id", data.transactionId).maybeSingle();
	if (!txn) return null;
	const [{ data: hits }, { data: logs }, { data: linkedCase }] = await Promise.all([
		supabase.from("rule_hits").select("*").eq("transaction_id", data.transactionId),
		supabase.from("device_logs").select("*").eq("account_id", txn.account_id).order("created_at", { ascending: false }).limit(8),
		supabase.from("cases").select("*").eq("transaction_id", data.transactionId).maybeSingle()
	]);
	return {
		transaction: txn,
		ruleHits: hits ?? [],
		deviceLogs: logs ?? [],
		linkedCase: linkedCase ?? null
	};
});
var getRules_createServerFn_handler = createServerRpc({
	id: "0198d121afc07a15f2dc33d7eeab734706002ab1a224c88eaf7d063a3f22b6e4",
	name: "getRules",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getRules.__executeServer(opts));
var getRules = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getRules_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("rules").select("*").order("code");
	return data ?? [];
});
var setRuleEnabled_createServerFn_handler = createServerRpc({
	id: "65e7bed9d9f1891954ee7a0dbcad9a51d95bcd20921a1b94f687121bf3f6f6e5",
	name: "setRuleEnabled",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => setRuleEnabled.__executeServer(opts));
var setRuleEnabled = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(setRuleEnabled_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("rules").update({ enabled: data.enabled }).eq("id", data.ruleId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getDeviceLogs_createServerFn_handler = createServerRpc({
	id: "416a06e738d15bf19fe669aefb7075c341aa487a2e64e8a9db4808f771760a5b",
	name: "getDeviceLogs",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getDeviceLogs.__executeServer(opts));
var getDeviceLogs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDeviceLogs_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("device_logs").select("*, accounts(account_number, holder_name)").order("created_at", { ascending: false }).limit(80);
	return data ?? [];
});
var getAlerts_createServerFn_handler = createServerRpc({
	id: "758ca5462391d66f0871bf789b860d92e7e42661f7d4f265287ede9d0e40c91d",
	name: "getAlerts",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getAlerts.__executeServer(opts));
var getAlerts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAlerts_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("alerts").select("*, accounts(account_number, holder_name)").order("created_at", { ascending: false }).limit(80);
	return data ?? [];
});
var getAuditTrail_createServerFn_handler = createServerRpc({
	id: "ea85578b00ed3c825afce2502ca581075482c7dfee6a8375c3f19c86ed5c217a",
	name: "getAuditTrail",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getAuditTrail.__executeServer(opts));
var getAuditTrail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAuditTrail_createServerFn_handler, async ({ context }) => {
	const { data } = await context.supabase.from("case_events").select("*, cases(case_ref, summary)").order("created_at", { ascending: false }).limit(120);
	return data ?? [];
});
var getCaseDetail_createServerFn_handler = createServerRpc({
	id: "d8404d6bdd724c7bc29cf66db725240c0ef85fea7f80e6655ff87b1cd1e7cbaf",
	name: "getCaseDetail",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => getCaseDetail.__executeServer(opts));
var getCaseDetail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(getCaseDetail_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: row } = await supabase.from("cases").select("*, accounts(account_number, holder_name), transactions(txn_ref, amount, city, country)").eq("id", data.caseId).maybeSingle();
	if (!row) return null;
	const { data: events } = await supabase.from("case_events").select("*").eq("case_id", data.caseId).order("created_at", { ascending: false });
	return {
		case: row,
		events: events ?? []
	};
});
var updateCaseStatus_createServerFn_handler = createServerRpc({
	id: "7b827156751a77f13047027699ad8748e0c448d4008e7f9017dfb568e77d4486",
	name: "updateCaseStatus",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => updateCaseStatus.__executeServer(opts));
var updateCaseStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(updateCaseStatus_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", userId).maybeSingle();
	const actor = profile?.full_name ?? profile?.email ?? "analyst";
	const { error } = await supabase.from("cases").update({
		status: data.status,
		assignee_id: userId,
		assignee_name: actor,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.caseId);
	if (error) throw new Error(error.message);
	await supabase.from("case_events").insert({
		case_id: data.caseId,
		actor_name: actor,
		action: `status → ${data.status}`,
		detail: data.note ?? null
	});
	return { ok: true };
});
var CITIES = [
	{
		city: "Lagos",
		country: "NG"
	},
	{
		city: "Kyiv",
		country: "UA"
	},
	{
		city: "Bucharest",
		country: "RO"
	},
	{
		city: "Accra",
		country: "GH"
	},
	{
		city: "Singapore",
		country: "SG"
	},
	{
		city: "Miami",
		country: "US"
	}
];
var DEVICES = [
	"Android 13",
	"iPhone 15",
	"Windows 11",
	"Ubuntu 22.04"
];
var BROWSERS = [
	"Chrome 128",
	"Safari 17",
	"Firefox 130",
	"Headless Chrome"
];
var MERCHANTS = [
	"Global Cash ATM",
	"CryptoRamp",
	"SkyMiles Travel",
	"Zenith POS",
	"Wire Transfer"
];
var simulateTransaction_createServerFn_handler = createServerRpc({
	id: "4ec6324f3397f9a6f4e9bbfa72ca58eedba23afb01d4829b1686de428ee997fe",
	name: "simulateTransaction",
	filename: "src/lib/fraud.functions.ts"
}, (opts) => simulateTransaction.__executeServer(opts));
var simulateTransaction = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(simulateTransaction_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [{ data: accounts }, { data: rules }, { data: profile }] = await Promise.all([
		supabase.from("accounts").select("id, account_number, holder_name, home_city, home_country"),
		supabase.from("rules").select("*").eq("enabled", true),
		supabase.from("profiles").select("full_name, email").eq("id", userId).maybeSingle()
	]);
	if (!accounts || accounts.length === 0) throw new Error("No accounts available to simulate");
	const account = pick(accounts);
	const actor = profile?.full_name ?? profile?.email ?? "analyst";
	const loc = pick(CITIES);
	const device = pick(DEVICES);
	const browser = pick(BROWSERS);
	const merchant = pick(MERCHANTS);
	const amount = Math.round((Math.random() * 4800 + 40) * 100) / 100;
	const hour = (/* @__PURE__ */ new Date()).getUTCHours();
	const newDevice = Math.random() < .5;
	const foreign = loc.country !== account.home_country;
	const ip = `${41 + Math.floor(Math.random() * 180)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
	const hits = [];
	for (const rule of rules ?? []) {
		let fired = false;
		switch (rule.code) {
			case "R-114":
				fired = amount > 1e3 && newDevice;
				break;
			case "R-072":
				fired = foreign;
				break;
			case "R-031":
				fired = hour < 5;
				break;
			case "R-018":
				fired = amount > 3e3;
				break;
			case "R-055":
				fired = browser === "Headless Chrome";
				break;
			case "R-090":
				fired = newDevice;
				break;
			default: fired = false;
		}
		if (fired) hits.push({
			rule_code: rule.code,
			label: rule.label,
			points: rule.weight,
			severity: rule.severity
		});
	}
	const score = Math.min(100, hits.reduce((sum, h) => sum + h.points, 0));
	const severity = scoreToSeverity(score);
	const status = score >= 85 ? "blocked" : score >= 45 ? "flagged" : "cleared";
	const suffix = pad(Math.floor(Math.random() * 99999), 5);
	const { data: txn, error: txnError } = await supabase.from("transactions").insert({
		txn_ref: `TXN-${suffix}`,
		account_id: account.id,
		amount,
		kind: "card_purchase",
		merchant,
		city: loc.city,
		country: loc.country,
		ip_address: ip,
		asn: `AS${13e3 + Math.floor(Math.random() * 5e4)}`,
		device,
		browser,
		fingerprint: `fp_${Math.random().toString(16).slice(2, 12)}`,
		new_device: newDevice,
		risk_score: score,
		severity,
		status
	}).select("*").single();
	if (txnError || !txn) throw new Error(txnError?.message ?? "Insert failed");
	if (hits.length > 0) await supabase.from("rule_hits").insert(hits.map((h) => ({
		...h,
		transaction_id: txn.id
	})));
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
		first_seen: newDevice
	});
	let caseRef = null;
	if (severity === "high" || severity === "critical") {
		caseRef = `CASE-${pad(Math.floor(Math.random() * 9999), 4)}`;
		const { data: newCase } = await supabase.from("cases").insert({
			case_ref: caseRef,
			transaction_id: txn.id,
			account_id: account.id,
			severity,
			status: "open",
			summary: `${severity.toUpperCase()} risk ${merchant} charge from ${loc.city}, ${loc.country}`
		}).select("id").single();
		if (newCase) await supabase.from("case_events").insert({
			case_id: newCase.id,
			actor_name: actor,
			action: "case opened",
			detail: `Auto-opened from ${txn.txn_ref} at risk ${score}`
		});
		await supabase.from("alerts").insert({
			transaction_id: txn.id,
			account_id: account.id,
			channel: "email",
			recipient: `${account.holder_name.split(" ")[0]?.toLowerCase()}@example.com`,
			message: `Suspicious ${merchant} charge of $${amount} in ${loc.city}. Reply BLOCK to freeze the card.`,
			severity,
			delivered: true
		});
	}
	return {
		txnRef: txn.txn_ref,
		riskScore: score,
		severity,
		status,
		hits: hits.length,
		caseRef
	};
});
//#endregion
export { getAlerts_createServerFn_handler, getAuditTrail_createServerFn_handler, getCaseDetail_createServerFn_handler, getConsoleSnapshot_createServerFn_handler, getDeviceLogs_createServerFn_handler, getRules_createServerFn_handler, getTransactionDetail_createServerFn_handler, getViewerContext_createServerFn_handler, setRuleEnabled_createServerFn_handler, simulateTransaction_createServerFn_handler, updateCaseStatus_createServerFn_handler };
