import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { l as getRules, n as Panel, p as setRuleEnabled, t as AppShell, v as useServerFn } from "./format-CRtE2HYU.mjs";
import { t as SeverityBadge } from "./SeverityBadge-Df0z8vyy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rules-BWpZiJ6D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function RulesPage() {
	const qc = useQueryClient();
	const rulesFn = useServerFn(getRules);
	const toggleFn = useServerFn(setRuleEnabled);
	const { data } = useQuery({
		queryKey: ["rules"],
		queryFn: () => rulesFn({})
	});
	const toggle = useMutation({
		mutationFn: (vars) => toggleFn({ data: vars }),
		onSuccess: () => {
			toast.success("Rule updated");
			qc.invalidateQueries({ queryKey: ["rules"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Only admins can edit rules")
	});
	const rules = data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Detection rules",
		subtitle: "Each firing rule adds its weight to the transaction risk score (0-100).",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `Rule set · ${rules.length}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b border-border text-left",
					children: [
						"Code",
						"Rule",
						"Description",
						"Weight",
						"Severity",
						"Enabled"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "label-xs px-3 py-2",
						children: h
					}, h))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rules.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-mono text-xs text-foreground",
							children: r.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-xs text-foreground",
							children: r.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-xs text-muted-foreground",
							children: r.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2.5 font-mono text-xs text-foreground",
							children: ["+", r.weight]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: r.severity })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: r.enabled,
								onCheckedChange: (v) => toggle.mutate({
									ruleId: r.id,
									enabled: v
								})
							})
						})
					]
				}, r.id)) })]
			})
		})
	});
}
//#endregion
export { RulesPage as component };
