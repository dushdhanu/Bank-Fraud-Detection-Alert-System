import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as maskAccount, i as getAlerts, n as Panel, r as ago, t as AppShell, v as useServerFn } from "./format-CRtE2HYU.mjs";
import { t as SeverityBadge } from "./SeverityBadge-Df0z8vyy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-CNtJ3SiZ.js
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const alertsFn = useServerFn(getAlerts);
	const { data } = useQuery({
		queryKey: ["alerts"],
		queryFn: () => alertsFn({})
	});
	const alerts = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Alert log",
		subtitle: "Notifications raised for high and critical severity activity.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `Alerts · ${alerts.length}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "divide-y divide-border",
				children: [alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-start gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: a.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground",
							children: a.message
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-[11px] text-muted-foreground",
							children: [
								a.channel,
								" → ",
								a.recipient,
								" ·",
								" ",
								a.accounts ? maskAccount(a.accounts.account_number) : "—",
								" · ",
								ago(a.created_at),
								" ",
								"ago · ",
								a.delivered ? "delivered" : "queued"
							]
						})]
					})]
				}, a.id)), alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-sm text-muted-foreground",
					children: "No alerts raised."
				}) : null]
			})
		})
	});
}
//#endregion
export { AlertsPage as component };
