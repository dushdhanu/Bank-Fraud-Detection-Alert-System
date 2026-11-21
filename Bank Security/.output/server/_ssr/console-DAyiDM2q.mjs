import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { d as maskAccount, f as money, g as simulateTransaction, n as Panel, r as ago, s as getConsoleSnapshot, t as AppShell, u as getTransactionDetail, v as useServerFn } from "./format-CRtE2HYU.mjs";
import { t as SeverityBadge } from "./SeverityBadge-Df0z8vyy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/console-DAyiDM2q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConsolePage() {
	const qc = useQueryClient();
	const snapshotFn = useServerFn(getConsoleSnapshot);
	const detailFn = useServerFn(getTransactionDetail);
	const simulateFn = useServerFn(simulateTransaction);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const { data, isLoading } = useQuery({
		queryKey: ["snapshot"],
		queryFn: () => snapshotFn({})
	});
	const { data: detail } = useQuery({
		queryKey: ["txn", selectedId],
		queryFn: () => detailFn({ data: { transactionId: selectedId } }),
		enabled: Boolean(selectedId)
	});
	const simulate = useMutation({
		mutationFn: () => simulateFn({}),
		onSuccess: (res) => {
			toast.success(`${res.txnRef} scored ${res.riskScore} (${res.severity})${res.caseRef ? ` · ${res.caseRef} opened` : ""}`);
			qc.invalidateQueries();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Simulation failed")
	});
	const txns = data?.transactions ?? [];
	const openCases = (data?.cases ?? []).filter((c) => c.status !== "resolved");
	const flagged = txns.filter((t) => t.status !== "cleared");
	const critical = txns.filter((t) => t.severity === "critical");
	const exposure = flagged.reduce((s, t) => s + Number(t.amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Monitoring console",
		subtitle: "Live simulated transaction stream, scored against the active rule set.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => simulate.mutate(),
			disabled: simulate.isPending,
			children: simulate.isPending ? "Simulating…" : "Simulate transaction"
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Transactions (recent)",
					value: String(txns.length),
					delay: 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Flagged / blocked",
					value: String(flagged.length),
					tone: "high",
					delay: 60
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Critical severity",
					value: String(critical.length),
					tone: "critical",
					delay: 120
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Flagged exposure",
					value: money(exposure),
					delay: 180
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: `Transaction stream · ${txns.length}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[560px] overflow-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "sticky top-0 bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-b border-border text-left",
								children: [
									"Ref",
									"Account",
									"Amount",
									"Location",
									"Risk",
									"Status",
									"Age"
								].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "label-xs px-3 py-2",
									children: h
								}, h))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-6 text-muted-foreground",
							colSpan: 7,
							children: "Loading stream…"
						}) }) : txns.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							onClick: () => setSelectedId(t.id),
							style: { animationDelay: `${Math.min(i, 15) * 25}ms` },
							className: `fade-up row-hover cursor-pointer border-b border-border/60 hover:bg-secondary ${selectedId === t.id ? "bg-secondary shadow-[inset_2px_0_0_0_var(--brand)]" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-foreground",
									children: t.txn_ref
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-muted-foreground",
									children: t.accounts ? maskAccount(t.accounts.account_number) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-foreground",
									children: money(t.amount)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 text-xs text-muted-foreground",
									children: [
										t.city,
										", ",
										t.country
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-foreground",
											children: t.risk_score
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: t.severity })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-[11px] uppercase text-muted-foreground",
									children: t.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 font-mono text-xs text-muted-foreground",
									children: ago(t.occurred_at)
								})
							]
						}, t.id)) })]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Transaction detail",
					children: !selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-6 text-sm text-muted-foreground",
						children: "Select a transaction to inspect its rule hits and device metadata."
					}) : !detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-6 text-sm text-muted-foreground",
						children: "Loading…"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "fade-up space-y-4 px-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-sm text-foreground",
									children: detail.transaction.txn_ref
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: detail.transaction.severity })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Holder",
										v: detail.transaction.accounts?.holder_name ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Amount",
										v: money(detail.transaction.amount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Merchant",
										v: detail.transaction.merchant ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Risk score",
										v: String(detail.transaction.risk_score)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "IP",
										v: detail.transaction.ip_address ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "ASN",
										v: detail.transaction.asn ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Device",
										v: detail.transaction.device ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Browser",
										v: detail.transaction.browser ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "Fingerprint",
										v: detail.transaction.fingerprint ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "New device",
										v: detail.transaction.new_device ? "yes" : "no"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs",
								children: "Rule hits"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5",
								children: detail.ruleHits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-xs text-muted-foreground",
									children: "No rules fired."
								}) : detail.ruleHits.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									style: { animationDelay: `${i * 50}ms` },
									className: "fade-up row-hover flex items-center justify-between rounded border border-border bg-secondary px-2.5 py-1.5 hover:border-primary/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] text-muted-foreground",
												children: h.rule_code
											}),
											" ",
											h.label
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-xs text-foreground",
										children: ["+", h.points]
									})]
								}, h.id))
							})] }),
							detail.linkedCase ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-muted-foreground",
								children: [
									"Linked case ",
									detail.linkedCase.case_ref,
									" · ",
									detail.linkedCase.status
								]
							}) : null
						]
					}, detail.transaction.id)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: `Open cases · ${openCases.length}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "divide-y divide-border",
						children: [openCases.slice(0, 6).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							style: { animationDelay: `${i * 45}ms` },
							className: "fade-up row-hover flex items-start gap-3 px-4 py-2.5 hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: c.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-foreground",
									children: c.case_ref
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: c.summary
								})]
							})]
						}, c.id)), openCases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-4 py-6 text-sm text-muted-foreground",
							children: "No open cases."
						}) : null]
					})
				})]
			})]
		})]
	});
}
function Kpi({ label, value, tone, delay = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: { animationDelay: `${delay}ms` },
		className: "fade-up lift rounded-lg border border-border bg-card px-4 py-3 hover:-translate-y-0.5 hover:border-primary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1.5 font-mono text-2xl tabular-nums ${tone === "critical" ? "text-critical" : tone === "high" ? "text-high" : "text-foreground"}`,
			children: value
		})]
	});
}
function Field({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "label-xs self-center",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "truncate font-mono text-xs text-foreground",
		children: v
	})] });
}
//#endregion
export { ConsolePage as component };
