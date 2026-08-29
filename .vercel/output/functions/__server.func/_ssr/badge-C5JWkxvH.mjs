import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as cn } from "./router-Bd5Fq0Bb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-C5JWkxvH.js
var import_jsx_runtime = require_jsx_runtime();
var tones = {
	neutral: "bg-surface-2 text-ink-soft",
	primary: "bg-primary-soft text-primary",
	danger: "bg-danger-soft text-danger",
	warning: "bg-warning-soft text-warning",
	success: "bg-success-soft text-success",
	info: "bg-info-soft text-info"
};
function Badge({ tone = "neutral", className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className),
		...props
	});
}
//#endregion
export { Badge as t };
