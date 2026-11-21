import { n as __toESM } from "../_runtime.mjs";
import { A as redirect, _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DeWPhqBg.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as J } from "../_libs/next-themes.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CPVo6_eN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-D8HOcNIV.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function ThemeProvider$1({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(J, {
		...props,
		children
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Sentinel Risk Ops — Bank Fraud Detection" },
			{
				name: "description",
				content: "Fraud detection, alerting and investigator case management for simulated bank transactions."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Sentinel Risk Ops — Bank Fraud Detection"
			},
			{
				property: "og:description",
				content: "Fraud detection, alerting and investigator case management for simulated bank transactions."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider$1, {
			attribute: "class",
			defaultTheme: "system",
			enableSystem: true,
			disableTransitionOnChange: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
		})
	});
}
var $$splitComponentImporter$8 = () => import("./routes-7Ro4wUFo.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Sentinel Risk Ops — Bank Fraud Detection Console" },
		{
			name: "description",
			content: "Rule-based transaction monitoring, device and IP fingerprint logging, alerting and investigator case management for bank fraud detection."
		},
		{
			property: "og:title",
			content: "Sentinel Risk Ops — Bank Fraud Detection Console"
		},
		{
			property: "og:description",
			content: "Monitor simulated bank transactions, score them against fraud rules, and manage investigator cases with a full audit trail."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./route-Di7iQBCH.mjs");
var Route$7 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./auth-BT5Epxxa.mjs");
var Route$6 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Analyst Sign In — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Sign in to the Sentinel Risk Ops console to review flagged transactions, cases and fraud alerts."
		},
		{
			property: "og:title",
			content: "Analyst Sign In — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "Secure access to the fraud detection and case management console."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./alerts-CNtJ3SiZ.mjs");
var Route$5 = createFileRoute("/_authenticated/alerts")({
	head: () => ({ meta: [
		{ title: "Alert Log — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Account-holder and admin notifications generated by high and critical risk transactions."
		},
		{
			property: "og:title",
			content: "Alert Log — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "Every fraud notification sent, with channel, recipient and delivery state."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./audit-BRP5FKZW.mjs");
var Route$4 = createFileRoute("/_authenticated/audit")({
	head: () => ({ meta: [
		{ title: "Audit Trail — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Append-only log of every analyst action taken on fraud cases, with actor, action and timestamp."
		},
		{
			property: "og:title",
			content: "Audit Trail — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "Reconstruct any investigation from the append-only case event log."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./cases-BnGeuAM2.mjs");
var Route$3 = createFileRoute("/_authenticated/cases")({
	head: () => ({ meta: [
		{ title: "Case Queue — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Investigator case queue for flagged bank transactions: review, escalate or resolve with a full audit trail."
		},
		{
			property: "og:title",
			content: "Case Queue — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "Review, escalate and resolve fraud cases with recorded analyst actions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./console-DAyiDM2q.mjs");
var Route$2 = createFileRoute("/_authenticated/console")({
	head: () => ({ meta: [
		{ title: "Monitoring Console — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Live transaction stream with risk scores, rule hits and device fingerprint metadata for fraud analysts."
		},
		{
			property: "og:title",
			content: "Monitoring Console — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "Live transaction monitoring and risk scoring for the fraud operations team."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./devices-ry8cmOo0.mjs");
var Route$1 = createFileRoute("/_authenticated/devices")({
	head: () => ({ meta: [
		{ title: "Device & IP Log — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Device, browser, IP address, ASN and fingerprint metadata captured at login and transaction time."
		},
		{
			property: "og:title",
			content: "Device & IP Log — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "The metadata trail investigators legally work from: IP, ASN, device, fingerprint."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./rules-BWpZiJ6D.mjs");
var Route = createFileRoute("/_authenticated/rules")({
	head: () => ({ meta: [
		{ title: "Detection Rules — Sentinel Risk Ops" },
		{
			name: "description",
			content: "Weighted fraud detection rules that score each transaction: new device, high value, foreign geography and odd-hour activity."
		},
		{
			property: "og:title",
			content: "Detection Rules — Sentinel Risk Ops"
		},
		{
			property: "og:description",
			content: "Enable, disable and inspect the weighted rules behind every risk score."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$7.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var AuthRoute = Route$6.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAlertsRoute: Route$5.update({
		id: "/alerts",
		path: "/alerts",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAuditRoute: Route$4.update({
		id: "/audit",
		path: "/audit",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedCasesRoute: Route$3.update({
		id: "/cases",
		path: "/cases",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedConsoleRoute: Route$2.update({
		id: "/console",
		path: "/console",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedDevicesRoute: Route$1.update({
		id: "/devices",
		path: "/devices",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedRulesRoute: Route.update({
		id: "/rules",
		path: "/rules",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
