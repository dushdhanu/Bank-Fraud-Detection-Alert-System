import { n as __toESM } from "../_runtime.mjs";
import { D as isRedirect, _ as useRouter, g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-B83oEyEG.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-UH_Jp6hR.mjs";
import { t as supabase } from "./client-DeWPhqBg.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as ThemeToggle } from "./ThemeToggle-Dyt-ZRiq.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-CRtE2HYU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getViewerContext = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a9da72ce9fb55f2b5f663205355dea6fbada0b8e8f1284c769d610b0f7fb5a02"));
var getConsoleSnapshot = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6840e2e3277385102c6c862d3e152e14a91b1fac315c4b83516bf934285de02f"));
var getTransactionDetail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("317ce39b9a3214004233d607fe4ff3bcaff75c9c9c65baf7af06abe6284535ac"));
var getRules = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0198d121afc07a15f2dc33d7eeab734706002ab1a224c88eaf7d063a3f22b6e4"));
var setRuleEnabled = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("65e7bed9d9f1891954ee7a0dbcad9a51d95bcd20921a1b94f687121bf3f6f6e5"));
var getDeviceLogs = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("416a06e738d15bf19fe669aefb7075c341aa487a2e64e8a9db4808f771760a5b"));
var getAlerts = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("758ca5462391d66f0871bf789b860d92e7e42661f7d4f265287ede9d0e40c91d"));
var getAuditTrail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ea85578b00ed3c825afce2502ca581075482c7dfee6a8375c3f19c86ed5c217a"));
var getCaseDetail = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("d8404d6bdd724c7bc29cf66db725240c0ef85fea7f80e6655ff87b1cd1e7cbaf"));
var updateCaseStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => data).handler(createSsrRpc("7b827156751a77f13047027699ad8748e0c448d4008e7f9017dfb568e77d4486"));
var simulateTransaction = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4ec6324f3397f9a6f4e9bbfa72ca58eedba23afb01d4829b1686de428ee997fe"));
var NAV = [
	{
		to: "/console",
		label: "Console"
	},
	{
		to: "/cases",
		label: "Cases"
	},
	{
		to: "/rules",
		label: "Rules"
	},
	{
		to: "/devices",
		label: "Devices"
	},
	{
		to: "/alerts",
		label: "Alerts"
	},
	{
		to: "/audit",
		label: "Audit"
	}
];
function AppShell({ title, subtitle, actions, children }) {
	const navigate = useNavigate();
	const viewer = useServerFn(getViewerContext);
	const { data } = useQuery({
		queryKey: ["viewer"],
		queryFn: () => viewer({})
	});
	async function signOut() {
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/console",
						className: "group flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot h-2 w-2 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm font-semibold tracking-widest text-foreground transition-colors group-hover:text-primary",
							children: "SENTINEL"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-wrap items-center gap-1",
						children: NAV.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							style: { animationDelay: `${i * 40}ms` },
							className: "fade-in-soft relative rounded px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:-translate-y-px hover:bg-secondary hover:text-foreground after:absolute after:inset-x-2 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100",
							activeProps: { className: "bg-secondary text-foreground after:scale-x-100" },
							children: item.label
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden font-mono text-xs text-muted-foreground sm:inline",
								children: [
									data?.email ?? "…",
									" · ",
									data?.roles?.join(", ") || "no role"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: signOut,
								children: "Sign out"
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-4 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fade-up mb-5 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: title
				}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: subtitle
				}) : null] }), actions]
			}), children]
		})]
	});
}
function Panel({ title, right, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "fade-up lift overflow-hidden rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-[0_8px_30px_-12px_color-mix(in_oklab,var(--brand)_45%,transparent)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-4 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "label-xs",
				children: title
			}), right]
		}), children]
	});
}
function money(value) {
	return (typeof value === "string" ? Number(value) : value).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2
	});
}
function ago(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.round(diff / 6e4);
	if (m < 1) return "now";
	if (m < 60) return `${m}m`;
	const h = Math.round(m / 60);
	if (h < 24) return `${h}h`;
	return `${Math.round(h / 24)}d`;
}
function maskAccount(accountNumber) {
	return `****${accountNumber.slice(-4)}`;
}
var severityLabel = {
	low: "LOW",
	medium: "MED",
	high: "HIGH",
	critical: "CRIT"
};
function severityClasses(severity) {
	switch (severity) {
		case "critical": return "bg-critical/15 ring-critical/30 text-critical";
		case "high": return "bg-high/15 ring-high/30 text-high";
		case "medium": return "bg-medium/15 ring-medium/30 text-medium";
		default: return "bg-low/15 ring-low/30 text-low";
	}
}
//#endregion
export { updateCaseStatus as _, getAuditTrail as a, getDeviceLogs as c, maskAccount as d, money as f, simulateTransaction as g, severityLabel as h, getAlerts as i, getRules as l, severityClasses as m, Panel as n, getCaseDetail as o, setRuleEnabled as p, ago as r, getConsoleSnapshot as s, AppShell as t, getTransactionDetail as u, useServerFn as v };
