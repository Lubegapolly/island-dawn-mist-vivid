import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as cn } from "./router-Bd5Fq0Bb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BRFJOUhQ.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm text-ink shadow-[var(--shadow-border)] placeholder:text-muted", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", "disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-[var(--radius-md)] bg-surface px-3 py-2.5 text-sm text-ink shadow-[var(--shadow-border)] placeholder:text-muted", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", className),
		...props
	});
}
function NativeSelect({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full rounded-[var(--radius-sm)] bg-surface px-3 text-sm text-ink shadow-[var(--shadow-border)]", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", className),
		...props,
		children
	});
}
//#endregion
export { NativeSelect as n, Textarea as r, Input as t };
