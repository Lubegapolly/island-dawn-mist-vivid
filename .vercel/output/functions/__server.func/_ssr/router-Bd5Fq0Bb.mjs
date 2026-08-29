import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, _ as createFileRoute, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as RotateCcw, g as BookOpen, h as CalendarClock, l as LayoutGrid, n as TriangleAlert, t as Users } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as differenceInYears, i as format, n as parseISO, o as isValid, r as subDays, s as addDays, t as subMonths } from "../_libs/date-fns.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bd5Fq0Bb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 40 40",
		className: cn("size-9", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "40",
			height: "40",
			rx: "10",
			className: "fill-primary"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M20 7.5C15.4 14.8 12 19.4 12 25.2a8 8 0 0016 0c0-5.8-3.4-10.4-8-17.7z",
			className: "fill-primary-fg"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[background-color,box-shadow,transform,color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:bg-primary-hover shadow-[var(--shadow-border)]",
			secondary: "bg-surface text-ink shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			outline: "bg-transparent text-ink ring-1 ring-line hover:bg-surface-2",
			ghost: "bg-transparent text-ink-soft hover:bg-primary-soft hover:text-primary",
			danger: "bg-danger text-primary-fg hover:opacity-90",
			soft: "bg-primary-soft text-primary hover:bg-primary hover:text-primary-fg"
		},
		size: {
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-sm",
			md: "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			icon: "size-11 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		...!asChild ? { type } : {},
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function iso(d) {
	return format(d, "yyyy-MM-dd");
}
function makeSeed(now) {
	const today = iso(now);
	return {
		patients: [
			{
				id: "pt_okello",
				mrn: "MRRH-DM-01104",
				firstName: "James",
				lastName: "Okello",
				sex: "M",
				dob: "1988-03-12",
				phone: "+256 772 441 208",
				village: "Kakoba",
				district: "Mbarara",
				diagnosis: "t2dm",
				diagnosisYear: 2026,
				riskFactors: [
					"family-t2dm",
					"sedentary",
					"weight-gain"
				],
				conditions: [],
				allergies: "None known",
				currentMeds: [],
				weightKg: 78,
				heightCm: 172,
				nextReview: today,
				queue: {
					date: today,
					stage: "waiting",
					timeSlot: "08:20",
					checkInAt: "08:12"
				},
				labs: {
					a1c: 11.8,
					a1cDate: today,
					fpg: 268,
					randomBg: 342
				},
				hcm: {},
				createdAt: iso(subDays(now, 1))
			},
			{
				id: "pt_nakato",
				mrn: "MRRH-DM-00881",
				firstName: "Grace",
				lastName: "Nakato",
				sex: "F",
				dob: "1972-07-04",
				phone: "+256 701 553 914",
				village: "Nyamitanga",
				district: "Mbarara",
				diagnosis: "t2dm",
				diagnosisYear: 2018,
				riskFactors: ["family-t2dm", "htn"],
				conditions: [],
				allergies: "None known",
				currentMeds: [{
					name: "Metformin",
					dose: "1000 mg BID",
					cls: "metformin"
				}, {
					name: "Glibenclamide",
					dose: "5 mg daily",
					cls: "su"
				}],
				weightKg: 86,
				heightCm: 158,
				nextReview: today,
				queue: {
					date: today,
					stage: "waiting",
					timeSlot: "08:40",
					checkInAt: "08:28"
				},
				labs: {
					a1c: 9.1,
					a1cDate: iso(subDays(now, 4)),
					fpg: 178,
					acr: 22,
					egfr: 78,
					ldl: 132
				},
				hcm: {
					lastA1c: iso(subDays(now, 4)),
					lastFoot: iso(subMonths(now, 3)),
					lastEye: iso(subMonths(now, 14)),
					lastLipids: iso(subMonths(now, 13)),
					lastAcr: iso(subMonths(now, 11)),
					lastB12: iso(subMonths(now, 20)),
					influenza: iso(subMonths(now, 11))
				},
				createdAt: iso(subMonths(now, 40))
			},
			{
				id: "pt_nalubega",
				mrn: "MRRH-DM-00612",
				firstName: "Mary",
				lastName: "Nalubega",
				sex: "F",
				dob: "1963-11-21",
				phone: "+256 782 019 440",
				village: "Ruharo",
				district: "Mbarara",
				diagnosis: "t2dm",
				diagnosisYear: 2014,
				riskFactors: ["htn", "cvd"],
				conditions: ["ckd", "neuropathy"],
				allergies: "None known",
				currentMeds: [{
					name: "Metformin",
					dose: "500 mg BID",
					cls: "metformin"
				}, {
					name: "Amlodipine",
					dose: "10 mg daily",
					cls: "other"
				}],
				weightKg: 72,
				heightCm: 160,
				nextReview: today,
				queue: {
					date: today,
					stage: "consult",
					timeSlot: "08:00",
					checkInAt: "07:48"
				},
				labs: {
					a1c: 8.4,
					a1cDate: iso(subDays(now, 2)),
					fpg: 154,
					acr: 180,
					egfr: 48,
					ldl: 126
				},
				hcm: {
					lastA1c: iso(subDays(now, 2)),
					lastFoot: iso(subMonths(now, 1)),
					lastEye: iso(subMonths(now, 8)),
					lastLipids: iso(subMonths(now, 8)),
					lastAcr: iso(subDays(now, 2)),
					lastEgfr: iso(subDays(now, 2)),
					lastB12: iso(subMonths(now, 6))
				},
				createdAt: iso(subMonths(now, 90))
			},
			{
				id: "pt_kizza",
				mrn: "MRRH-DM-00940",
				firstName: "David",
				lastName: "Kizza",
				sex: "M",
				dob: "1979-01-30",
				phone: "+256 774 220 118",
				village: "Kakiika",
				district: "Mbarara",
				diagnosis: "t2dm",
				diagnosisYear: 2019,
				riskFactors: ["family-t2dm", "htn"],
				conditions: [],
				allergies: "None known",
				currentMeds: [
					{
						name: "Metformin",
						dose: "1000 mg BID",
						cls: "metformin"
					},
					{
						name: "NPH insulin",
						dose: "42 U at bedtime",
						cls: "insulin-basal"
					},
					{
						name: "Enalapril",
						dose: "10 mg daily",
						cls: "acei"
					}
				],
				weightKg: 70,
				heightCm: 174,
				nextReview: today,
				queue: {
					date: today,
					stage: "waiting",
					timeSlot: "09:00",
					checkInAt: "08:51"
				},
				labs: {
					a1c: 8.6,
					a1cDate: iso(subDays(now, 6)),
					fpg: 118,
					ppg: 214,
					ldl: 96,
					egfr: 88,
					acr: 18
				},
				hcm: {
					lastA1c: iso(subDays(now, 6)),
					lastFoot: iso(subMonths(now, 2)),
					lastEye: iso(subMonths(now, 10)),
					lastLipids: iso(subMonths(now, 10)),
					lastAcr: iso(subMonths(now, 10)),
					lastB12: iso(subMonths(now, 9))
				},
				createdAt: iso(subMonths(now, 48))
			},
			{
				id: "pt_namukasa",
				mrn: "MRRH-DM-00408",
				firstName: "Ruth",
				lastName: "Namukasa",
				sex: "F",
				dob: "1955-05-18",
				phone: "+256 759 883 201",
				village: "Bwizibwera",
				district: "Rwampara",
				diagnosis: "t2dm",
				diagnosisYear: 2011,
				riskFactors: ["htn"],
				conditions: [
					"esrd",
					"ckd",
					"anemia"
				],
				highHypoRisk: true,
				limitedLifeExpectancy: true,
				allergies: "None known",
				currentMeds: [{
					name: "NPH insulin",
					dose: "10 U morning",
					cls: "insulin-basal"
				}, {
					name: "Amlodipine",
					dose: "5 mg daily",
					cls: "other"
				}],
				weightKg: 58,
				heightCm: 154,
				nextReview: today,
				queue: {
					date: today,
					stage: "labs",
					timeSlot: "08:10",
					checkInAt: "07:55"
				},
				labs: {
					a1c: 8.2,
					a1cDate: iso(subDays(now, 1)),
					fpg: 142,
					egfr: 22,
					acr: 420,
					ldl: 88
				},
				hcm: {
					lastA1c: iso(subDays(now, 1)),
					lastFoot: iso(subMonths(now, 1)),
					lastEye: iso(subMonths(now, 5)),
					lastLipids: iso(subMonths(now, 5)),
					lastAcr: iso(subDays(now, 1)),
					lastEgfr: iso(subDays(now, 1))
				},
				createdAt: iso(subMonths(now, 120))
			},
			{
				id: "pt_mugisha",
				mrn: "MRRH-DM-00777",
				firstName: "Peter",
				lastName: "Mugisha",
				sex: "M",
				dob: "1964-09-02",
				phone: "+256 772 990 014",
				village: "Kamukuzi",
				district: "Mbarara",
				diagnosis: "t2dm",
				diagnosisYear: 2016,
				riskFactors: ["htn"],
				conditions: [],
				allergies: "None known",
				currentMeds: [
					{
						name: "Metformin",
						dose: "1000 mg BID",
						cls: "metformin"
					},
					{
						name: "Enalapril",
						dose: "10 mg daily",
						cls: "acei"
					},
					{
						name: "Atorvastatin",
						dose: "20 mg daily",
						cls: "statin"
					}
				],
				weightKg: 81,
				heightCm: 176,
				nextReview: iso(addDays(now, 160)),
				queue: {
					date: today,
					stage: "pharmacy",
					timeSlot: "07:50",
					checkInAt: "07:40"
				},
				labs: {
					a1c: 6.7,
					a1cDate: iso(subDays(now, 3)),
					fpg: 108,
					ppg: 146,
					ldl: 84,
					egfr: 72,
					acr: 12
				},
				hcm: {
					lastA1c: iso(subDays(now, 3)),
					lastFoot: today,
					lastEye: iso(subMonths(now, 7)),
					lastEyeNormal: true,
					lastLipids: iso(subMonths(now, 3)),
					lastAcr: iso(subMonths(now, 3)),
					lastB12: iso(subMonths(now, 4)),
					influenza: iso(subMonths(now, 2)),
					hbvImmune: true
				},
				createdAt: iso(subMonths(now, 70))
			},
			{
				id: "pt_atuhaire",
				mrn: "MRRH-DM-01220",
				firstName: "Sarah",
				lastName: "Atuhaire",
				sex: "F",
				dob: "1985-02-14",
				phone: "+256 705 118 632",
				village: "Nyakayojo",
				district: "Mbarara",
				diagnosis: "prediabetes",
				riskFactors: [
					"gdm-hx",
					"family-t2dm",
					"sedentary",
					"weight-gain"
				],
				conditions: [],
				allergies: "None known",
				currentMeds: [],
				weightKg: 98,
				heightCm: 162,
				nextReview: today,
				queue: {
					date: today,
					stage: "waiting",
					timeSlot: "09:20",
					checkInAt: "09:05"
				},
				labs: {
					a1c: 6.3,
					a1cDate: iso(subDays(now, 8)),
					fpg: 114
				},
				hcm: { lastA1c: iso(subDays(now, 8)) },
				createdAt: iso(subDays(now, 8))
			},
			{
				id: "pt_tumusiime",
				mrn: "MRRH-DM-00551",
				firstName: "John",
				lastName: "Tumusiime",
				sex: "M",
				dob: "1971-12-09",
				phone: "+256 782 441 009",
				village: "Kabwohe",
				district: "Sheema",
				diagnosis: "t2dm",
				diagnosisYear: 2017,
				riskFactors: ["htn", "sedentary"],
				conditions: ["neuropathy", "pvd"],
				allergies: "None known",
				currentMeds: [
					{
						name: "Metformin",
						dose: "850 mg BID",
						cls: "metformin"
					},
					{
						name: "Gliclazide",
						dose: "80 mg daily",
						cls: "su"
					},
					{
						name: "Enalapril",
						dose: "5 mg daily",
						cls: "acei"
					}
				],
				weightKg: 76,
				heightCm: 168,
				nextReview: today,
				queue: {
					date: today,
					stage: "waiting",
					timeSlot: "09:40"
				},
				labs: {
					a1c: 7.4,
					a1cDate: iso(subMonths(now, 4)),
					fpg: 136,
					ldl: 118,
					egfr: 64,
					acr: 44
				},
				hcm: {
					lastA1c: iso(subMonths(now, 4)),
					lastFoot: iso(subMonths(now, 8)),
					lastEye: "2024-01-18",
					lastLipids: iso(subMonths(now, 16)),
					lastAcr: iso(subMonths(now, 16)),
					lastB12: void 0,
					lastLft: iso(subMonths(now, 18))
				},
				createdAt: iso(subMonths(now, 60))
			},
			{
				id: "pt_komugisha",
				mrn: "MRRH-DM-01002",
				firstName: "Hope",
				lastName: "Komugisha",
				sex: "F",
				dob: "1976-08-22",
				phone: "+256 773 220 887",
				village: "Biharwe",
				district: "Mbarara",
				diagnosis: "t2dm",
				diagnosisYear: 2021,
				riskFactors: ["family-t2dm"],
				conditions: [],
				allergies: "None known",
				currentMeds: [{
					name: "Metformin",
					dose: "1000 mg BID",
					cls: "metformin"
				}, {
					name: "Atorvastatin",
					dose: "20 mg daily",
					cls: "statin"
				}],
				weightKg: 68,
				heightCm: 161,
				nextReview: iso(addDays(now, 170)),
				queue: {
					date: today,
					stage: "done",
					timeSlot: "07:30",
					checkInAt: "07:22"
				},
				labs: {
					a1c: 7.1,
					a1cDate: today,
					fpg: 122,
					ldl: 90,
					egfr: 91,
					acr: 8
				},
				hcm: {
					lastA1c: today,
					lastFoot: today,
					lastEye: iso(subMonths(now, 6)),
					lastLipids: today,
					lastAcr: today,
					lastB12: iso(subMonths(now, 2))
				},
				createdAt: iso(subMonths(now, 36))
			},
			{
				id: "pt_byaruhanga",
				mrn: "MRRH-DM-00330",
				firstName: "Paul",
				lastName: "Byaruhanga",
				sex: "M",
				dob: "1981-04-11",
				phone: "+256 701 882 441",
				village: "Ishongororo",
				district: "Ibanda",
				diagnosis: "t2dm",
				diagnosisYear: 2020,
				riskFactors: ["family-t2dm"],
				conditions: [],
				allergies: "None known",
				currentMeds: [{
					name: "Metformin",
					dose: "500 mg BID",
					cls: "metformin"
				}, {
					name: "Atorvastatin",
					dose: "20 mg daily",
					cls: "statin"
				}],
				weightKg: 74,
				heightCm: 170,
				nextReview: iso(addDays(now, 118)),
				labs: {
					a1c: 6.9,
					a1cDate: iso(subMonths(now, 2)),
					fpg: 104,
					ldl: 78,
					egfr: 96,
					acr: 6
				},
				hcm: {
					lastA1c: iso(subMonths(now, 2)),
					lastFoot: iso(subMonths(now, 2)),
					lastEye: iso(subMonths(now, 11)),
					lastLipids: iso(subMonths(now, 2)),
					lastAcr: iso(subMonths(now, 2)),
					lastB12: iso(subMonths(now, 2)),
					influenza: iso(subMonths(now, 4))
				},
				createdAt: iso(subMonths(now, 42))
			},
			{
				id: "pt_kyomuhendo",
				mrn: "MRRH-DM-00690",
				firstName: "Alice",
				lastName: "Kyomuhendo",
				sex: "F",
				dob: "1968-06-27",
				phone: "+256 782 110 334",
				village: "Kinoni",
				district: "Rwampara",
				diagnosis: "t2dm",
				diagnosisYear: 2015,
				riskFactors: ["htn"],
				conditions: [],
				allergies: "None known",
				currentMeds: [{
					name: "Metformin",
					dose: "1000 mg BID",
					cls: "metformin"
				}],
				weightKg: 80,
				heightCm: 157,
				nextReview: iso(subDays(now, 21)),
				labs: {
					a1c: 7.6,
					a1cDate: iso(subMonths(now, 4)),
					fpg: 140,
					ldl: 110,
					egfr: 70,
					acr: 28
				},
				hcm: {
					lastA1c: iso(subMonths(now, 4)),
					lastFoot: iso(subMonths(now, 4)),
					lastEye: iso(subMonths(now, 15)),
					lastLipids: iso(subMonths(now, 15)),
					lastAcr: iso(subMonths(now, 15))
				},
				createdAt: iso(subMonths(now, 80))
			},
			{
				id: "pt_wasswa",
				mrn: "MRRH-DM-00802",
				firstName: "Emmanuel",
				lastName: "Wasswa",
				sex: "M",
				dob: "1975-10-03",
				phone: "+256 774 009 221",
				village: "Nansana-outreach",
				district: "Isingiro",
				diagnosis: "t2dm",
				diagnosisYear: 2022,
				riskFactors: ["family-t2dm", "htn"],
				conditions: [],
				allergies: "None known",
				currentMeds: [
					{
						name: "Metformin",
						dose: "1000 mg BID",
						cls: "metformin"
					},
					{
						name: "Gliclazide",
						dose: "80 mg daily",
						cls: "su"
					},
					{
						name: "Enalapril",
						dose: "10 mg daily",
						cls: "acei"
					}
				],
				weightKg: 84,
				heightCm: 178,
				nextReview: iso(addDays(now, 12)),
				labs: {
					a1c: 7.9,
					a1cDate: iso(subDays(now, 18)),
					fpg: 148,
					ldl: 102,
					egfr: 81,
					acr: 16
				},
				hcm: {
					lastA1c: iso(subDays(now, 18)),
					lastFoot: iso(subDays(now, 18)),
					lastEye: iso(subMonths(now, 9)),
					lastLipids: iso(subMonths(now, 9)),
					lastAcr: iso(subMonths(now, 9)),
					lastB12: iso(subMonths(now, 9))
				},
				createdAt: iso(subMonths(now, 28))
			},
			{
				id: "pt_asiimwe",
				mrn: "MRRH-DM-01410",
				firstName: "Faith",
				lastName: "Asiimwe",
				sex: "F",
				dob: "1997-01-19",
				phone: "+256 705 667 190",
				village: "Kakiika",
				district: "Mbarara",
				diagnosis: "screening",
				riskFactors: ["family-t2dm", "sedentary"],
				conditions: [],
				allergies: "None known",
				currentMeds: [],
				weightKg: 74,
				heightCm: 165,
				nextReview: iso(addDays(now, 350)),
				labs: {
					a1c: 5.4,
					a1cDate: iso(subDays(now, 20)),
					fpg: 92
				},
				hcm: { lastA1c: iso(subDays(now, 20)) },
				createdAt: iso(subDays(now, 20))
			},
			{
				id: "pt_mwesigwa",
				mrn: "MRRH-DM-00218",
				firstName: "Robert",
				lastName: "Mwesigwa",
				sex: "M",
				dob: "1960-02-08",
				phone: "+256 772 331 045",
				village: "Rugando",
				district: "Ntungamo",
				diagnosis: "t2dm",
				diagnosisYear: 2012,
				riskFactors: ["htn", "cvd"],
				conditions: ["cvd"],
				allergies: "None known",
				currentMeds: [
					{
						name: "Metformin",
						dose: "1000 mg BID",
						cls: "metformin"
					},
					{
						name: "Enalapril",
						dose: "20 mg daily",
						cls: "acei"
					},
					{
						name: "Aspirin",
						dose: "75 mg daily",
						cls: "other"
					}
				],
				weightKg: 79,
				heightCm: 171,
				nextReview: iso(subDays(now, 5)),
				labs: {
					a1c: 7.8,
					a1cDate: iso(subMonths(now, 3)),
					fpg: 138,
					ldl: 118,
					egfr: 58,
					acr: 52
				},
				hcm: {
					lastA1c: iso(subMonths(now, 3)),
					lastFoot: iso(subMonths(now, 3)),
					lastEye: iso(subMonths(now, 12)),
					lastLipids: iso(subMonths(now, 14)),
					lastAcr: iso(subMonths(now, 3)),
					lastB12: iso(subMonths(now, 14))
				},
				createdAt: iso(subMonths(now, 110))
			}
		],
		visits: [
			visit("vis_nakato_1", "pt_nakato", subMonths(now, 9), 8.4, 152, "Dr. Atwine", "Metformin titrated to 1 g BID."),
			visit("vis_nakato_2", "pt_nakato", subMonths(now, 6), 8.8, 164, "Dr. Namanya", "Added glibenclamide 5 mg. Adherence fair."),
			visit("vis_nakato_3", "pt_nakato", subMonths(now, 3), 9.1, 178, "Dr. Atwine", "A1c rising on two orals. Discuss insulin next visit."),
			visit("vis_kizza_1", "pt_kizza", subMonths(now, 8), 9.4, 168, "Dr. Kansiime", "Started NPH 16 U nocte."),
			visit("vis_kizza_2", "pt_kizza", subMonths(now, 5), 8.9, 142, "Dr. Kansiime", "NPH titrated to 28 U."),
			visit("vis_kizza_3", "pt_kizza", subMonths(now, 2), 8.6, 118, "Dr. Atwine", "NPH 42 U. Fasting at target; A1c still high."),
			visit("vis_mugisha_1", "pt_mugisha", subMonths(now, 6), 6.8, 110, "Dr. Namanya", "Stable. 6-month review."),
			visit("vis_nalubega_1", "pt_nalubega", subMonths(now, 3), 8.6, 160, "Dr. Atwine", "ACR rising. Amlodipine only — needs ACEI."),
			visit("vis_tumusiime_1", "pt_tumusiime", subMonths(now, 4), 7.4, 136, "Sr. Kyohairwe", "Neuropathy symptoms. Eye exam overdue."),
			visit("vis_mwesigwa_1", "pt_mwesigwa", subMonths(now, 3), 7.8, 138, "Dr. Namanya", "Prior stroke. Statin not yet started."),
			visit("vis_kyomuhendo_1", "pt_kyomuhendo", subMonths(now, 4), 7.6, 140, "Dr. Kansiime", "Did not return for 3-month review."),
			visit("vis_wasswa_1", "pt_wasswa", subDays(now, 18), 7.9, 148, "Dr. Atwine", "Added gliclazide. Review in 4 weeks."),
			visit("vis_komugisha_1", "pt_komugisha", now, 7.1, 122, "Dr. Namanya", "At target. Discharged, 6-month review.")
		]
	};
}
function visit(id, patientId, date, a1c, fpg, clinician, notes) {
	return {
		id,
		patientId,
		date: iso(date),
		clinician,
		a1c,
		fpg,
		hypoglycemia: "none",
		symptomaticHyper: false,
		treatmentChanged: notes.toLowerCase().includes("start") || notes.toLowerCase().includes("added"),
		healthStatusChange: false,
		insulinStartedToday: notes.toLowerCase().includes("started nph"),
		smoking: false,
		alcohol: false,
		footExam: "deferred",
		neuropathyExam: "deferred",
		notes,
		meds: [],
		nextReview: iso(addDays(date, 90)),
		a1cIntervalMonths: 3,
		planSummary: notes,
		alerts: []
	};
}
function fullName(p) {
	return `${p.firstName} ${p.lastName}`;
}
function initials(p) {
	return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
}
function ageYears(dob, on = /* @__PURE__ */ new Date()) {
	const d = parseISO(dob);
	if (!isValid(d)) return 0;
	return differenceInYears(on, d);
}
function ageSex(p, on) {
	return `${ageYears(p.dob, on)}${p.sex}`;
}
function formatDate(iso, fallback = "—") {
	if (!iso) return fallback;
	const d = parseISO(iso);
	if (!isValid(d)) return fallback;
	return format(d, "d MMM yyyy");
}
function bmi(weightKg, heightCm) {
	if (!weightKg || !heightCm || heightCm <= 0) return void 0;
	const m = heightCm / 100;
	return Math.round(weightKg / (m * m) * 10) / 10;
}
function bmiLabel(value) {
	if (value == null) return "—";
	if (value < 18.5) return "Underweight";
	if (value < 25) return "Healthy";
	if (value < 30) return "Overweight";
	if (value < 35) return "Obesity I";
	if (value < 40) return "Obesity II";
	return "Obesity III";
}
function diagnosisLabel(d) {
	switch (d) {
		case "t2dm": return "Type 2 diabetes";
		case "t1dm": return "Type 1 diabetes";
		case "prediabetes": return "Prediabetes";
		case "gdm": return "Gestational diabetes";
		case "screening": return "Screening / at risk";
	}
}
function diagnosisShort(d) {
	switch (d) {
		case "t2dm": return "T2DM";
		case "t1dm": return "T1DM";
		case "prediabetes": return "Pre-DM";
		case "gdm": return "GDM";
		case "screening": return "Screen";
	}
}
function num(v) {
	if (v == null || v === "") return void 0;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : void 0;
}
function monthsBetween(fromIso, to) {
	const from = parseISO(fromIso);
	if (!isValid(from)) return 0;
	const years = to.getFullYear() - from.getFullYear();
	const months = to.getMonth() - from.getMonth();
	return years * 12 + months - (to.getDate() < from.getDate() ? 1 : 0);
}
function todayIso(on = /* @__PURE__ */ new Date()) {
	return format(on, "yyyy-MM-dd");
}
function phoneHref(phone) {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
var useClinicStore = create()(persist((set, get) => ({
	seedVersion: 0,
	patients: [],
	visits: [],
	hasHydrated: false,
	setHasHydrated: (v) => set({ hasHydrated: v }),
	seedIfEmpty: () => {
		const { patients, seedVersion } = get();
		if (patients.length === 0 || seedVersion !== 1) {
			const seed = makeSeed(/* @__PURE__ */ new Date());
			set({
				patients: seed.patients,
				visits: seed.visits,
				seedVersion: 1
			});
		}
	},
	resetDemo: () => {
		const seed = makeSeed(/* @__PURE__ */ new Date());
		set({
			patients: seed.patients,
			visits: seed.visits,
			seedVersion: 1
		});
	},
	upsertPatient: (p) => set((s) => {
		const i = s.patients.findIndex((x) => x.id === p.id);
		if (i === -1) return { patients: [p, ...s.patients] };
		const next = s.patients.slice();
		next[i] = p;
		return { patients: next };
	}),
	addVisit: (v, patientPatch) => set((s) => ({
		visits: [v, ...s.visits],
		patients: s.patients.map((p) => p.id === v.patientId ? {
			...p,
			...patientPatch,
			lastVisitId: v.id
		} : p)
	})),
	setQueue: (patientId, stage, date) => set((s) => ({ patients: s.patients.map((p) => {
		if (p.id !== patientId) return p;
		if (stage == null) return {
			...p,
			queue: void 0
		};
		const day = date ?? p.queue?.date ?? todayIso();
		return {
			...p,
			queue: {
				date: day,
				stage,
				timeSlot: p.queue?.timeSlot,
				checkInAt: p.queue?.checkInAt
			}
		};
	}) })),
	addToToday: (patientId, timeSlot) => set((s) => ({ patients: s.patients.map((p) => p.id === patientId ? {
		...p,
		queue: {
			date: todayIso(),
			stage: "waiting",
			timeSlot,
			checkInAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	} : p) }))
}), {
	name: "diabcare-mrrh-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (s) => ({
		seedVersion: s.seedVersion,
		patients: s.patients,
		visits: s.visits
	})
}));
function usePatient(id) {
	return useClinicStore((s) => s.patients.find((p) => p.id === id));
}
function useVisits(patientId) {
	return useClinicStore((s) => s.visits.filter((v) => v.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date)));
}
var NAV = [
	{
		to: "/",
		label: "Today",
		icon: LayoutGrid
	},
	{
		to: "/patients",
		label: "Patients",
		icon: Users
	},
	{
		to: "/reviews",
		label: "Reviews",
		icon: CalendarClock
	},
	{
		to: "/guidelines",
		label: "Guidelines",
		icon: BookOpen
	}
];
function AppShell({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const resetDemo = useClinicStore((s) => s.resetDemo);
	const seedIfEmpty = useClinicStore((s) => s.seedIfEmpty);
	const setHasHydrated = useClinicStore((s) => s.setHasHydrated);
	(0, import_react.useEffect)(() => {
		const finish = () => {
			seedIfEmpty();
			setHasHydrated(true);
			setReady(true);
		};
		const unsub = useClinicStore.persist.onFinishHydration(finish);
		useClinicStore.persist.rehydrate();
		if (useClinicStore.persist.hasHydrated()) finish();
		return unsub;
	}, [seedIfEmpty, setHasHydrated]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-primary text-primary-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-14 items-center justify-center rounded-[14px] bg-primary-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-12" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-xl",
				children: "DiabCare"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-primary-fg/70",
				children: "Mbarara RRH · loading clinic"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-[1440px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-primary px-4 py-5 text-primary-fg md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-start gap-3 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-9" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-xl leading-tight",
							children: "DiabCare"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-[11px] leading-snug text-primary-fg/70",
							children: "Mbarara Regional Referral Hospital"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 px-1 text-[10px] font-medium uppercase tracking-[0.16em] text-primary-fg/55",
						children: "Diabetes clinic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-3 flex flex-1 flex-col gap-1",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm transition-colors duration-150", active ? "bg-primary-fg text-primary" : "text-primary-fg/80 hover:bg-primary-fg/10 hover:text-primary-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "size-4",
									strokeWidth: 1.75
								}), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto space-y-3 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tabular-nums text-primary-fg/60",
							children: format(/* @__PURE__ */ new Date(), "EEEE d MMM yyyy")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-9 w-full justify-start text-primary-fg/70 hover:bg-primary-fg/10 hover:text-primary-fg",
							onClick: () => resetDemo(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Reset demo data"]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col pb-20 md:pb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-3 border-b border-line bg-surface px-4 py-3 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-none",
							children: "DiabCare"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-muted",
							children: "Mbarara RRH · Diabetes clinic"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-4",
				children: NAV.map((item) => {
					const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px]", active ? "text-primary" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
							className: "size-5",
							strokeWidth: 1.75
						}), item.label]
					}) }, item.to);
				})
			})
		})]
	});
}
var styles_default = "/assets/styles-CR3UcUgW.css";
var APP_NAME = "DiabCare MRRH";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Outpatient diabetes clinic flow and ADA-aligned decision support for Mbarara Regional Referral Hospital."
			},
			{
				name: "theme-color",
				content: "#165A55"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
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
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,650&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				toastOptions: { className: "font-sans" }
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$6 = () => import("./routes-BIPwFg0_.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./guidelines-BSAo0bcK.mjs");
var Route$5 = createFileRoute("/guidelines")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./patients-BOAY-pDl.mjs");
var Route$4 = createFileRoute("/patients")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./reviews-CuRox_z9.mjs");
var Route$3 = createFileRoute("/reviews")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./patients._patientId-x22SE3DK.mjs");
var Route$2 = createFileRoute("/patients/$patientId")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./patients.new-Ci9rQlM0.mjs");
var Route$1 = createFileRoute("/patients/new")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./patients._patientId.visit-B4fzBtiq.mjs");
var Route = createFileRoute("/patients/$patientId/visit")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var GuidelinesRoute = Route$5.update({
	id: "/guidelines",
	path: "/guidelines",
	getParentRoute: () => Route$7
});
var PatientsRoute = Route$4.update({
	id: "/patients",
	path: "/patients",
	getParentRoute: () => Route$7
});
var ReviewsRoute = Route$3.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => Route$7
});
var PatientsPatientIdRoute = Route$2.update({
	id: "/$patientId",
	path: "/$patientId",
	getParentRoute: () => PatientsRoute
});
var PatientsNewRoute = Route$1.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => PatientsRoute
});
var PatientsPatientIdRouteChildren = { PatientsPatientIdVisitRoute: Route.update({
	id: "/visit",
	path: "/visit",
	getParentRoute: () => PatientsPatientIdRoute
}) };
var PatientsRouteChildren = {
	PatientsPatientIdRoute: PatientsPatientIdRoute._addFileChildren(PatientsPatientIdRouteChildren),
	PatientsNewRoute
};
var rootRouteChildren = {
	IndexRoute,
	GuidelinesRoute,
	PatientsRoute: PatientsRoute._addFileChildren(PatientsRouteChildren),
	ReviewsRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { num as _, usePatient as a, Button as b, ageYears as c, diagnosisLabel as d, diagnosisShort as f, monthsBetween as g, initials as h, useClinicStore as i, bmi as l, fullName as m, Route as n, useVisits as o, formatDate as p, Route$2 as r, ageSex as s, router_exports as t, bmiLabel as u, phoneHref as v, cn as x, todayIso as y };
