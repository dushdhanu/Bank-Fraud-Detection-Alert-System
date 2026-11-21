import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as updateCaseStatus, f as money, n as Panel, o as getCaseDetail, r as ago, s as getConsoleSnapshot, t as AppShell, v as useServerFn } from "./format-CRtE2HYU.mjs";
import { t as SeverityBadge } from "./SeverityBadge-Df0z8vyy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cases-BnGeuAM2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var STATUSES = [
	"open",
	"in_review",
	"escalated",
	"resolved"
];
function CasesPage() {
	const qc = useQueryClient();
	const snapshotFn = useServerFn(getConsoleSnapshot);
	const detailFn = useServerFn(getCaseDetail);
	const updateFn = useServerFn(updateCaseStatus);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const { data } = useQuery({
		queryKey: ["snapshot"],
		queryFn: () => snapshotFn({})
	});
	const { data: detail } = useQuery({
		queryKey: ["case", selectedId],
		queryFn: () => detailFn({ data: { caseId: selectedId } }),
		enabled: Boolean(selectedId)
	});
	const update = useMutation({
		mutationFn: (status) => updateFn({ data: {
			caseId: selectedId,
			status,
			...note ? { note } : {}
		} }),
		onSuccess: () => {
			toast.success("Case updated");
			setNote("");
			qc.invalidateQueries();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Update failed")
	});
	const cases = data?.cases ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Case queue",
		subtitle: "Flagged activity assigned to analysts, with an append-only action log.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: `Cases · ${cases.length}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b border-border text-left",
						children: [
							"Ref",
							"Severity",
							"Summary",
							"Status",
							"Assignee",
							"Age"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "label-xs px-3 py-2",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [cases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => setSelectedId(c.id),
						className: `cursor-pointer border-b border-border/60 hover:bg-secondary ${selectedId === c.id ? "bg-secondary" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-foreground",
								children: c.case_ref
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: c.severity })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-[22ch] truncate px-3 py-2 text-xs text-muted-foreground",
								children: c.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-[11px] uppercase text-foreground",
								children: c.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-xs text-muted-foreground",
								children: c.assignee_name ?? "unassigned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-muted-foreground",
								children: ago(c.created_at)
							})
						]
					}, c.id)), cases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-6 text-sm text-muted-foreground",
						colSpan: 6,
						children: "No cases yet."
					}) }) : null] })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Case file",
				children: !detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-6 text-sm text-muted-foreground",
					children: "Select a case to review its file."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm text-foreground",
								children: detail.case.case_ref
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: detail.case.severity })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground",
							children: detail.case.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted-foreground",
							children: [
								detail.case.accounts?.holder_name ?? "—",
								" ·",
								" ",
								detail.case.transactions ? `${detail.case.transactions.txn_ref} ${money(detail.case.transactions.amount)}` : "no linked transaction"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Investigator note (optional)",
							rows: 3
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: detail.case.status === s ? "default" : "outline",
								disabled: update.isPending,
								onClick: () => update.mutate(s),
								children: s.replace("_", " ")
							}, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label-xs",
							children: "Audit trail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: detail.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-l-2 border-border pl-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-foreground",
										children: e.action
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: [
											e.actor_name,
											" · ",
											ago(e.created_at),
											" ago"
										]
									}),
									e.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: e.detail
									}) : null
								]
							}, e.id))
						})] })
					]
				})
			})]
		})
	});
}
//#endregion
export { CasesPage as component };
