import { B as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ArrowRight, d as ClipboardPlus, h as CalendarClock, n as TriangleAlert, p as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as format } from "../_libs/date-fns.mjs";
import { b as Button, f as diagnosisShort, h as initials, i as useClinicStore, m as fullName, s as ageSex, x as cn, y as todayIso } from "./router-Bd5Fq0Bb.mjs";
import { t as Badge } from "./badge-C5JWkxvH.mjs";
import { r as QUEUE_STAGES } from "./types-ocXVQuXs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BIPwFg0_.js
var import_jsx_runtime = require_jsx_runtime();
function TodayClinic() {
	const patients = useClinicStore((s) => s.patients);
	const setQueue = useClinicStore((s) => s.setQueue);
	const today = todayIso();
	const onBoard = patients.filter((p) => p.queue?.date === today);
	const overdue = patients.filter((p) => p.nextReview < today);
	const highRisk = onBoard.filter((p) => p.labs.a1c != null && p.labs.a1c >= 9 || p.labs.fpg != null && p.labs.fpg >= 250);
	const waiting = onBoard.filter((p) => p.queue?.stage === "waiting").length;
	const done = onBoard.filter((p) => p.queue?.stage === "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
						children: "Outpatient session"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl tracking-tight sm:text-4xl",
						children: "Today’s clinic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: [format(/* @__PURE__ */ new Date(), "EEEE d MMMM yyyy"), " · Internal Medicine · Diabetes & Endocrine"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/reviews",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4" }), "Recall list"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/patients/new",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPlus, { className: "size-4" }), "Register patient"]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "On the board",
						value: onBoard.length,
						hint: `${done} discharged`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Waiting",
						value: waiting,
						hint: "Ready for consult"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Overdue reviews",
						value: overdue.length,
						hint: "Need recall",
						tone: overdue.length ? "warning" : "ok"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "High glucose today",
						value: highRisk.length,
						hint: "A1c ≥9 or FPG ≥250",
						tone: highRisk.length ? "danger" : "ok"
					})
				]
			}),
			overdue.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/reviews",
				className: "mt-4 flex items-center gap-3 rounded-[var(--radius-md)] bg-warning-soft px-4 py-3 text-warning",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex-1 text-sm",
						children: [
							overdue.length,
							" patient",
							overdue.length === 1 ? "" : "s",
							" past their review date — open the recall list."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0",
				children: QUEUE_STAGES.map((col) => {
					const list = onBoard.filter((p) => p.queue?.stage === col.id).sort((a, b) => (a.queue?.timeSlot ?? "").localeCompare(b.queue?.timeSlot ?? ""));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "w-[min(100%,280px)] shrink-0 md:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "mb-2 flex items-baseline justify-between px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: col.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted",
								children: col.hint
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-sm tabular-nums text-muted",
								children: list.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-h-40 space-y-2 rounded-[var(--radius-lg)] bg-surface-2/60 p-2",
							children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-6 text-center text-xs text-muted",
								children: "Empty"
							}), list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
								patient: p,
								stage: col.id,
								onAdvance: (next) => setQueue(p.id, next, today)
							}, p.id))]
						})]
					}, col.id);
				})
			})
		]
	});
}
function Stat({ label, value, hint, tone = "ok" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2 font-display text-3xl tabular-nums leading-none", tone === "warning" && "text-warning", tone === "danger" && "text-danger"),
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: hint
			})
		]
	});
}
var NEXT = {
	waiting: "consult",
	consult: "labs",
	labs: "pharmacy",
	pharmacy: "done",
	done: null
};
function QueueCard({ patient, stage, onAdvance }) {
	const next = NEXT[stage];
	const a1c = patient.labs.a1c;
	const hot = a1c != null && a1c >= 9;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-[var(--radius-md)] bg-surface p-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary-soft font-display text-sm text-primary",
						children: initials(patient)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/patients/$patientId",
							params: { patientId: patient.id },
							className: "block truncate text-sm font-medium hover:text-primary",
							children: fullName(patient)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate font-mono text-[11px] text-muted",
							children: [
								patient.mrn,
								" · ",
								ageSex(patient)
							]
						})]
					}),
					patient.queue?.timeSlot && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[11px] tabular-nums text-muted",
						children: patient.queue.timeSlot
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "primary",
						children: diagnosisShort(patient.diagnosis)
					}),
					a1c != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: hot ? "danger" : a1c >= 7 ? "warning" : "success",
						children: [
							"A1c ",
							a1c.toFixed(1),
							"%"
						]
					}),
					patient.nextReview < todayIso() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "warning",
						children: "Overdue"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-1.5",
				children: [stage !== "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "h-9 flex-1",
					onClick: () => next && onAdvance(next),
					children: [next === "consult" ? "Start consult" : next === "labs" ? "To labs" : next === "pharmacy" ? "To pharmacy" : "Discharge", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					className: "h-9 px-2.5",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/patients/$patientId/visit",
						params: { patientId: patient.id },
						children: "Plan"
					})
				})]
			})
		]
	});
}
//#endregion
export { TodayClinic as component };
