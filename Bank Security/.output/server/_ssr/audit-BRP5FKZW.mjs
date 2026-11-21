import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as getAuditTrail, n as Panel, r as ago, t as AppShell, v as useServerFn } from "./format-CRtE2HYU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-BRP5FKZW.js
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const auditFn = useServerFn(getAuditTrail);
	const { data } = useQuery({
		queryKey: ["audit"],
		queryFn: () => auditFn({})
	});
	const events = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Audit trail",
		subtitle: "Append-only record of analyst actions across all cases.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `Events · ${events.length}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "divide-y divide-border",
				children: [events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline gap-x-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-foreground",
								children: e.cases?.case_ref ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-foreground",
								children: e.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] text-muted-foreground",
								children: [
									e.actor_name,
									" · ",
									ago(e.created_at),
									" ago"
								]
							})
						]
					}), e.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: e.detail
					}) : null]
				}, e.id)), events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted-foreground",
					children: "No recorded actions yet."
				}) : null]
			})
		})
	});
}
//#endregion
export { AuditPage as component };
