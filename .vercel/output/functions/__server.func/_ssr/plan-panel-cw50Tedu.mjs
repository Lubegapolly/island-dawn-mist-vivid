import { B as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Printer, u as Copy } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as Button, p as formatDate, x as cn } from "./router-Bd5Fq0Bb.mjs";
import { t as Badge } from "./badge-C5JWkxvH.mjs";
import { s as planToPlainText } from "./cds-OcbWcbpT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/plan-panel-cw50Tedu.js
var import_jsx_runtime = require_jsx_runtime();
var PRI = {
	now: {
		label: "Now",
		tone: "danger"
	},
	start: {
		label: "Start",
		tone: "primary"
	},
	continue: {
		label: "Continue",
		tone: "success"
	},
	refer: {
		label: "Refer",
		tone: "warning"
	},
	screen: {
		label: "Screen",
		tone: "info"
	},
	educate: {
		label: "Educate",
		tone: "neutral"
	}
};
var URGENCY = {
	stat: {
		label: "2-week safety review",
		tone: "danger"
	},
	soon: {
		label: "Early review",
		tone: "warning"
	},
	routine: {
		label: "Routine",
		tone: "primary"
	},
	extended: {
		label: "Surveillance",
		tone: "neutral"
	}
};
function PlanPanel({ plan, patientName, mrn, clinician, visitDate, compact }) {
	const copy = async () => {
		const text = planToPlainText(patientName, mrn, plan, clinician, visitDate);
		await navigator.clipboard.writeText(text);
		toast.success("Care plan copied — paste into the clinic book or EMR");
	};
	const print = () => {
		const text = planToPlainText(patientName, mrn, plan, clinician, visitDate);
		const w = window.open("", "_blank");
		if (!w) {
			toast.error("Allow pop-ups to print");
			return;
		}
		w.document.write(`<pre style="font:14px/1.45 'IBM Plex Sans',sans-serif;white-space:pre-wrap;padding:24px;color:#14221f">${escapeHtml(text)}</pre>`);
		w.document.close();
		w.focus();
		w.print();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-lg)] bg-primary p-5 text-primary-fg shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.16em] text-primary-fg/70",
						children: "Suggested next review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl leading-none tracking-tight",
							children: formatDate(plan.review.date)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-primary-fg/80",
							children: [
								"in ",
								plan.review.label,
								" · A1c every ",
								plan.review.a1cIntervalMonths,
								" months"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: URGENCY[plan.review.urgency].tone,
							className: "bg-primary-fg/15 text-primary-fg",
							children: URGENCY[plan.review.urgency].label
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1.5 text-sm text-primary-fg/85",
						children: plan.review.reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "leading-snug",
							children: r
						}, r))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] text-primary-fg/55",
						children: plan.review.citation
					})
				]
			}),
			plan.alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: plan.alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-[var(--radius-md)] px-4 py-3", a.severity === "critical" && "bg-danger-soft text-danger", a.severity === "warning" && "bg-warning-soft text-warning", a.severity === "info" && "bg-info-soft text-info"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: a.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm opacity-90",
						children: a.detail
					})]
				}, a.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
						children: "Targets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-xl",
						children: plan.diagnosisLine
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: [
							"A1c ",
							plan.a1cTarget.display,
							" — ",
							plan.a1cTarget.rationale
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: plan.glucoseTargets
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Glycaemic therapy",
				items: plan.therapy
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "BP, lipids, kidney, weight",
				items: plan.comorbidities
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Screening due",
				items: plan.screening
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Education",
				items: plan.education
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
					children: "Today’s clinic checklist"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: plan.todayChecklist.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-0.5 size-4 shrink-0 rounded-[3px] ring-1 ring-line" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase tracking-wide text-muted",
								children: c.station
							})
						]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: copy,
					className: "flex-1 sm:flex-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy plan"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					onClick: print,
					className: "flex-1 sm:flex-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print"]
				})]
			})
		]
	});
}
function Section({ title, items }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-3",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border-t border-line pt-3 first:border-0 first:pt-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: PRI[i.priority].tone,
							children: PRI[i.priority].label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: i.title
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm leading-relaxed text-ink-soft",
						children: i.detail
					}),
					i.localNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm leading-relaxed text-primary",
						children: i.localNote
					}),
					i.citation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-muted",
						children: i.citation
					})
				]
			}, i.id))
		})]
	});
}
function escapeHtml(s) {
	return s.replaceAll("&", "&").replaceAll("<", "<").replaceAll(">", ">");
}
//#endregion
export { PlanPanel as t };
