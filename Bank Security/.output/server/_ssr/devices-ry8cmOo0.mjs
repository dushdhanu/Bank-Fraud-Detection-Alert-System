import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as getDeviceLogs, d as maskAccount, n as Panel, r as ago, t as AppShell, v as useServerFn } from "./format-CRtE2HYU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/devices-ry8cmOo0.js
var import_jsx_runtime = require_jsx_runtime();
function DevicesPage() {
	const logsFn = useServerFn(getDeviceLogs);
	const { data } = useQuery({
		queryKey: ["device-logs"],
		queryFn: () => logsFn({})
	});
	const logs = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Device & IP fingerprint log",
		subtitle: "Metadata recorded at login and transaction time. Attribution of an actor is a matter for law enforcement, not this system.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `Events · ${logs.length}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
						className: "border-b border-border text-left",
						children: [
							"Account",
							"Event",
							"IP",
							"ASN",
							"Device",
							"Browser",
							"Fingerprint",
							"Geo",
							"First seen",
							"Age"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "label-xs whitespace-nowrap px-3 py-2",
							children: h
						}, h))
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-muted-foreground",
								children: l.accounts ? maskAccount(l.accounts.account_number) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-[11px] uppercase text-foreground",
								children: l.event
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-foreground",
								children: l.ip_address ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-muted-foreground",
								children: l.asn ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-xs text-muted-foreground",
								children: l.device ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-xs text-muted-foreground",
								children: l.browser ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-muted-foreground",
								children: l.fingerprint ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 text-xs text-muted-foreground",
								children: [
									l.city ?? "—",
									", ",
									l.country ?? "—"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-foreground",
								children: l.first_seen ? "yes" : "no"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-xs text-muted-foreground",
								children: ago(l.created_at)
							})
						]
					}, l.id)), logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-6 text-sm text-muted-foreground",
						colSpan: 10,
						children: "No device events recorded."
					}) }) : null] })]
				})
			})
		})
	});
}
//#endregion
export { DevicesPage as component };
