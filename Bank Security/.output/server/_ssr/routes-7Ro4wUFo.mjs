import { n as __toESM } from "../_runtime.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DeWPhqBg.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as ThemeToggle } from "./ThemeToggle-Dyt-ZRiq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-7Ro4wUFo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEATURES = [
	{
		code: "01",
		title: "Transaction monitoring",
		body: "A live stream of simulated bank transactions with amount, location, device and IP metadata on every row."
	},
	{
		code: "02",
		title: "Rule-based risk scoring",
		body: "Weighted rules (new device, high value, foreign geography, odd hours) combine into a 0-100 risk score and severity band."
	},
	{
		code: "03",
		title: "Device & IP fingerprint log",
		body: "Every event records IP, ASN, browser, device and fingerprint — the metadata investigators legally work from."
	},
	{
		code: "04",
		title: "Alerting",
		body: "High and critical activity generates account-holder and admin alerts with the triggering context attached."
	},
	{
		code: "05",
		title: "Case management",
		body: "Flagged activity becomes a case an analyst can review, escalate or resolve, with assignee tracking."
	},
	{
		code: "06",
		title: "Audit trail",
		body: "Every status change is written to an append-only event log so the investigation is reconstructable."
	}
];
function Landing() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/console" });
		});
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot h-2 w-2 rounded-full bg-primary glow-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "fade-in-soft font-mono text-sm font-semibold tracking-widest text-foreground",
							children: "SENTINEL RISK OPS"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Sign in"
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "border-b border-border py-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "fade-up label-xs",
							children: "Fraud detection & alert system"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							style: { animationDelay: "80ms" },
							className: "fade-up mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl",
							children: "Detect suspicious bank transactions and hand investigators a clean trail."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: { animationDelay: "160ms" },
							className: "fade-up mt-4 max-w-2xl text-base text-muted-foreground",
							children: "Sentinel simulates card and transfer activity, scores it against configurable fraud rules, records device and network metadata, alerts the account holder, and turns the worst of it into a managed case file. It does not identify or attribute attackers — that remains a matter for law enforcement."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: { animationDelay: "240ms" },
							className: "fade-up mt-7 flex flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "transition-transform duration-200 hover:-translate-y-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									children: "Open the console"
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4",
							children: [
								{
									k: "Rules engine",
									v: "6 weighted rules"
								},
								{
									k: "Severity bands",
									v: "low → critical"
								},
								{
									k: "Metadata",
									v: "IP · ASN · device"
								},
								{
									k: "Case states",
									v: "open → resolved"
								}
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: { animationDelay: `${300 + i * 70}ms` },
								className: "fade-up row-hover bg-card px-4 py-4 hover:bg-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs",
									children: s.k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 font-mono text-sm text-foreground",
									children: s.v
								})]
							}, s.k))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "py-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold tracking-tight text-foreground",
						children: "What it does"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2",
						children: FEATURES.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							style: { animationDelay: `${i * 60}ms` },
							className: "fade-up float row-hover group bg-card p-5 hover:bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs transition-colors group-hover:text-primary",
									children: f.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 text-sm font-semibold text-foreground",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground",
									children: f.body
								})
							]
						}, f.code))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border px-4 py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto max-w-5xl font-mono text-xs text-muted-foreground",
					children: "Sentinel Risk Ops — academic demonstration system. All data is simulated."
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
