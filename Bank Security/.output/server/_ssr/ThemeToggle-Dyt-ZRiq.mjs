import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as z } from "../_libs/next-themes.mjs";
import { n as Moon, t as Sun } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ThemeToggle-Dyt-ZRiq.js
var import_jsx_runtime = require_jsx_runtime();
function ThemeToggle() {
	const { theme, setTheme } = z();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "ghost",
		size: "icon",
		onClick: () => setTheme(theme === "light" ? "dark" : "light"),
		title: "Toggle theme",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Toggle theme"
			})
		]
	});
}
//#endregion
export { ThemeToggle as t };
