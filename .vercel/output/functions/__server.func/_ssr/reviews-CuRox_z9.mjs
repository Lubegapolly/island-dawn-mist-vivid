import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as Phone, u as Copy } from "../_libs/lucide-react.mjs";
import { i as format, n as parseISO, s as addDays } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as Button, f as diagnosisShort, i as useClinicStore, m as fullName, p as formatDate, s as ageSex, v as phoneHref, y as todayIso } from "./router-Bd5Fq0Bb.mjs";
import { t as Badge } from "./badge-C5JWkxvH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-CuRox_z9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewsPage() {
	const patients = useClinicStore((s) => s.patients);
	const addToToday = useClinicStore((s) => s.addToToday);
	const today = todayIso();
	const horizon = format(addDays(/* @__PURE__ */ new Date(), 30), "yyyy-MM-dd");
	const [tab, setTab] = (0, import_react.useState)("overdue");
	const overdue = (0, import_react.useMemo)(() => patients.filter((p) => p.nextReview < today).sort((a, b) => a.nextReview.localeCompare(b.nextReview)), [patients, today]);
	const week = (0, import_react.useMemo)(() => {
		const end = format(addDays(/* @__PURE__ */ new Date(), 7), "yyyy-MM-dd");
		return patients.filter((p) => p.nextReview >= today && p.nextReview <= end).sort((a, b) => a.nextReview.localeCompare(b.nextReview));
	}, [patients, today]);
	const month = (0, import_react.useMemo)(() => patients.filter((p) => p.nextReview >= today && p.nextReview <= horizon).sort((a, b) => a.nextReview.localeCompare(b.nextReview)), [
		patients,
		today,
		horizon
	]);
	const list = tab === "overdue" ? overdue : tab === "week" ? week : month;
	const copyRecall = async () => {
		const rows = overdue.map((p) => `${fullName(p)}\t${p.mrn}\t${p.phone}\t${p.village}\t${formatDate(p.nextReview)}\t${diagnosisShort(p.diagnosis)}`);
		const text = [
			"MRRH Diabetes Clinic — RECALL LIST",
			`Generated ${format(/* @__PURE__ */ new Date(), "d MMM yyyy")}`,
			"Name	MRN	Phone	Village	Was due	Dx",
			...rows
		].join("\n");
		await navigator.clipboard.writeText(text);
		toast.success("Recall list copied for VHTs / records clerks");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
						children: "Clinic flow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl tracking-tight",
						children: "Reviews & recall"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: "Suggested dates come from ADA intervals — 2 weeks after insulin start or crisis, 3 months if not at target, 6 months if stable."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: copyRecall,
					disabled: overdue.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy overdue list"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab("overdue"),
						className: tabClass(tab === "overdue"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Overdue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl tabular-nums text-warning",
							children: overdue.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab("week"),
						className: tabClass(tab === "week"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Next 7 days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: week.length
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab("month"),
						className: tabClass(tab === "month"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted",
							children: "Next 30 days"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: month.length
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-border)]",
				children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-12 text-center text-sm text-muted",
					children: "Nothing in this window."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line",
					children: list.map((p) => {
						const due = parseISO(p.nextReview);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/patients/$patientId",
								params: { patientId: p.id },
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: fullName(p)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-[11px] text-muted",
									children: [
										p.mrn,
										" · ",
										ageSex(p),
										" · ",
										p.village
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "primary",
										children: diagnosisShort(p.diagnosis)
									}),
									p.labs.a1c != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										tone: p.labs.a1c >= 9 ? "danger" : "neutral",
										children: [
											"A1c ",
											p.labs.a1c.toFixed(1),
											"%"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs tabular-nums text-ink-soft",
										children: format(due, "EEE d MMM")
									}),
									p.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: phoneHref(p.phone),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => addToToday(p.id),
										children: "Check in"
									})
								]
							})]
						}, p.id);
					})
				})
			})
		]
	});
}
function tabClass(on) {
	return on ? "rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)] ring-2 ring-primary" : "rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)]";
}
//#endregion
export { ReviewsPage as component };
