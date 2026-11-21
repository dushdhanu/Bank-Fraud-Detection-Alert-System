globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/alerts-BYOnoGBw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"482-KZSrK1aU/0LlJQEhcZblkhCT8t8\"",
		"mtime": "2026-11-21T08:43:03.671Z",
		"size": 1154,
		"path": "../public/assets/alerts-BYOnoGBw.js"
	},
	"/assets/audit-BCjWH-Bz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"478-GPEAUbKClp2GXYGu4xhEqqBCZFw\"",
		"mtime": "2026-11-21T08:43:03.671Z",
		"size": 1144,
		"path": "../public/assets/audit-BCjWH-Bz.js"
	},
	"/assets/auth-CZ-8uLvn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3a-uPZXaJDv63+j1KH1wGeYQuZv9rc\"",
		"mtime": "2026-11-21T08:43:03.673Z",
		"size": 3898,
		"path": "../public/assets/auth-CZ-8uLvn.js"
	},
	"/assets/button-BJ3zH6W5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7cd8-PleOqdYGqea+7/QqTWO1ErHqaSI\"",
		"mtime": "2026-11-21T08:43:03.675Z",
		"size": 31960,
		"path": "../public/assets/button-BJ3zH6W5.js"
	},
	"/assets/devices-DUyM7TtQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c8-q4N4opJ8j4syeqZZq306PzkEQHc\"",
		"mtime": "2026-11-21T08:43:03.680Z",
		"size": 2248,
		"path": "../public/assets/devices-DUyM7TtQ.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-09-02T10:58:00.580Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/cases-cPHdMy2v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1113-dNAtB7j+UbbeMjCZeHDMCF4u/mM\"",
		"mtime": "2026-11-21T08:43:03.677Z",
		"size": 4371,
		"path": "../public/assets/cases-cPHdMy2v.js"
	},
	"/assets/console-1tgyZjZl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1be1-3Uo+ryo9nGBA9iknmvdj9RwkCYs\"",
		"mtime": "2026-11-21T08:43:03.677Z",
		"size": 7137,
		"path": "../public/assets/console-1tgyZjZl.js"
	},
	"/assets/route-BM6Fhksj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-dMXRt9eQW8t6q0M3FOdwEwtNy2k\"",
		"mtime": "2026-11-21T08:43:03.685Z",
		"size": 138,
		"path": "../public/assets/route-BM6Fhksj.js"
	},
	"/assets/dist-DJsto6tp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-QKsChVyRuE6O5SIFJlOKyEZoz30\"",
		"mtime": "2026-11-21T08:43:03.683Z",
		"size": 690,
		"path": "../public/assets/dist-DJsto6tp.js"
	},
	"/assets/format-BwS2lsi5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"44d9-geZeffE7D601lfyqK4/WfFIaSRc\"",
		"mtime": "2026-11-21T08:43:03.684Z",
		"size": 17625,
		"path": "../public/assets/format-BwS2lsi5.js"
	},
	"/assets/SeverityBadge-BwISblcw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"171-jqItbZpzNe1CyfqTKTgPMNWcVt0\"",
		"mtime": "2026-11-21T08:43:03.667Z",
		"size": 369,
		"path": "../public/assets/SeverityBadge-BwISblcw.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-09-02T10:58:00.580Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/routes-FzZGq8IQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1267-swHxXMcXyO43QPSm2n2rhOx6tl8\"",
		"mtime": "2026-11-21T08:43:03.886Z",
		"size": 4711,
		"path": "../public/assets/routes-FzZGq8IQ.js"
	},
	"/assets/rules-Cc81B2qD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"29de-nnIYpvQZj4OyewjNzfORZEg9UZY\"",
		"mtime": "2026-11-21T08:43:03.890Z",
		"size": 10718,
		"path": "../public/assets/rules-Cc81B2qD.js"
	},
	"/assets/styles-D8HOcNIV.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13759-89ft/gyzlirZxzxp8HAT6C1BJxg\"",
		"mtime": "2026-11-21T08:43:03.901Z",
		"size": 79705,
		"path": "../public/assets/styles-D8HOcNIV.css"
	},
	"/assets/useMutation-Dd0bpDYC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"924-GYzqK/AkqZCnoMzNsJD391Rmx1M\"",
		"mtime": "2026-11-21T08:43:03.893Z",
		"size": 2340,
		"path": "../public/assets/useMutation-Dd0bpDYC.js"
	},
	"/assets/ThemeToggle-vJQxKgvG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"902-pkX6kTIiir1CSXCemvk8groB72I\"",
		"mtime": "2026-11-21T08:43:03.669Z",
		"size": 2306,
		"path": "../public/assets/ThemeToggle-vJQxKgvG.js"
	},
	"/assets/useStore-B9WcefOa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ba9-DyLG3MsOxLBofb+Ep/+VkQIRI0g\"",
		"mtime": "2026-11-21T08:43:03.896Z",
		"size": 27561,
		"path": "../public/assets/useStore-B9WcefOa.js"
	},
	"/assets/index-COAacBwC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d0b5-0/uFmnS6+gkcZsfmtPBG9tFOKqA\"",
		"mtime": "2026-11-21T08:43:03.665Z",
		"size": 577717,
		"path": "../public/assets/index-COAacBwC.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_BTHA_2 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_BTHA_2
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
