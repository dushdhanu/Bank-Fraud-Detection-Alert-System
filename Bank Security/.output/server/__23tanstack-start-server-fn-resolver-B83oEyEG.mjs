//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B83oEyEG.js
var manifest = {
	"0198d121afc07a15f2dc33d7eeab734706002ab1a224c88eaf7d063a3f22b6e4": {
		functionName: "getRules_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"317ce39b9a3214004233d607fe4ff3bcaff75c9c9c65baf7af06abe6284535ac": {
		functionName: "getTransactionDetail_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"416a06e738d15bf19fe669aefb7075c341aa487a2e64e8a9db4808f771760a5b": {
		functionName: "getDeviceLogs_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"4ec6324f3397f9a6f4e9bbfa72ca58eedba23afb01d4829b1686de428ee997fe": {
		functionName: "simulateTransaction_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"65e7bed9d9f1891954ee7a0dbcad9a51d95bcd20921a1b94f687121bf3f6f6e5": {
		functionName: "setRuleEnabled_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"6840e2e3277385102c6c862d3e152e14a91b1fac315c4b83516bf934285de02f": {
		functionName: "getConsoleSnapshot_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"758ca5462391d66f0871bf789b860d92e7e42661f7d4f265287ede9d0e40c91d": {
		functionName: "getAlerts_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"7b827156751a77f13047027699ad8748e0c448d4008e7f9017dfb568e77d4486": {
		functionName: "updateCaseStatus_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"a9da72ce9fb55f2b5f663205355dea6fbada0b8e8f1284c769d610b0f7fb5a02": {
		functionName: "getViewerContext_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"d8404d6bdd724c7bc29cf66db725240c0ef85fea7f80e6655ff87b1cd1e7cbaf": {
		functionName: "getCaseDetail_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	},
	"ea85578b00ed3c825afce2502ca581075482c7dfee6a8375c3f19c86ed5c217a": {
		functionName: "getAuditTrail_createServerFn_handler",
		importer: () => import("./_ssr/fraud.functions-C89tNMho.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
