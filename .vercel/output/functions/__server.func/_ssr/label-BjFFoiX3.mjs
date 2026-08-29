import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as cn } from "./router-Bd5Fq0Bb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/label-BjFFoiX3.js
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-xs font-medium tracking-wide text-ink-soft", className),
		...props
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { Field as t };
