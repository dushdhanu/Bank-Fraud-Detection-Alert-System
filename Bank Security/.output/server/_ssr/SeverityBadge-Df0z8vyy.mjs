import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as severityLabel, m as severityClasses } from "./format-CRtE2HYU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SeverityBadge-Df0z8vyy.js
var import_jsx_runtime = require_jsx_runtime();
function SeverityBadge({ severity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `fade-in-soft inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider ring-1 transition-transform duration-200 hover:scale-105 ${severityClasses(severity)}`,
		children: severityLabel[severity]
	});
}
//#endregion
export { SeverityBadge as t };
