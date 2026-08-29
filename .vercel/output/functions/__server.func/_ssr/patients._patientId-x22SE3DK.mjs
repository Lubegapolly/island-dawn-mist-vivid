import { B as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Phone, f as ClipboardList, m as CalendarPlus, r as Stethoscope } from "../_libs/lucide-react.mjs";
import { a as usePatient, b as Button, d as diagnosisLabel, i as useClinicStore, l as bmi, m as fullName, o as useVisits, p as formatDate, r as Route$2, s as ageSex, u as bmiLabel, v as phoneHref, x as cn, y as todayIso } from "./router-Bd5Fq0Bb.mjs";
import { t as Badge } from "./badge-C5JWkxvH.mjs";
import { i as buildCarePlan, o as patientToInput, t as CONDITION_LABELS } from "./cds-OcbWcbpT.mjs";
import { t as PlanPanel } from "./plan-panel-cw50Tedu.mjs";
import { a as ResponsiveContainer, i as Line, n as YAxis, o as Tooltip, r as XAxis, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients._patientId-x22SE3DK.js
var import_jsx_runtime = require_jsx_runtime();
function PatientChart() {
	const { patientId } = Route$2.useParams();
	const patient = usePatient(patientId);
	const visits = useVisits(patientId);
	const addToToday = useClinicStore((s) => s.addToToday);
	if (!patient) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "Patient not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/patients",
				children: "Back to registry"
			})
		})]
	});
	const now = /* @__PURE__ */ new Date();
	const plan = buildCarePlan(patientToInput(patient, now));
	const overdue = patient.nextReview < todayIso(now);
	const b = bmi(patient.weightKg, patient.heightCm);
	const chart = visits.filter((v) => v.a1c != null).slice().reverse().map((v) => ({
		date: formatDate(v.date),
		a1c: v.a1c
	}));
	if (patient.labs.a1c != null && (chart.length === 0 || chart[chart.length - 1]?.a1c !== patient.labs.a1c)) chart.push({
		date: formatDate(patient.labs.a1cDate) ?? "Now",
		a1c: patient.labs.a1c
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-muted",
						children: patient.mrn
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl tracking-tight sm:text-4xl",
						children: fullName(patient)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: [
							ageSex(patient),
							" · ",
							patient.village,
							", ",
							patient.district,
							patient.diagnosisYear ? ` · dx ${patient.diagnosisYear}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "primary",
								children: diagnosisLabel(patient.diagnosis)
							}),
							overdue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: "warning",
								children: ["Review overdue ", formatDate(patient.nextReview)]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: "success",
								children: ["Review ", formatDate(patient.nextReview)]
							}),
							patient.queue?.date === todayIso() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: "info",
								children: ["On board · ", patient.queue.stage]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						patient.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: phoneHref(patient.phone),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), "Call"]
							})
						}),
						patient.queue?.date !== todayIso() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: () => addToToday(patient.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "Check in today"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/patients/$patientId/visit",
								params: { patientId: patient.id },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-4" }), "New visit"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "A1c",
						value: patient.labs.a1c != null ? `${patient.labs.a1c.toFixed(1)}%` : "—",
						hint: formatDate(patient.labs.a1cDate, "No recent A1c"),
						hot: patient.labs.a1c != null && patient.labs.a1c >= 9
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "FPG",
						value: patient.labs.fpg != null ? String(patient.labs.fpg) : "—",
						hint: "mg/dL · goal 80–130"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "BMI",
						value: b != null ? String(b) : "—",
						hint: bmiLabel(b)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "eGFR",
						value: patient.labs.egfr != null ? String(patient.labs.egfr) : "—",
						hint: patient.labs.acr != null ? `ACR ${patient.labs.acr}` : "mL/min",
						hot: patient.labs.egfr != null && patient.labs.egfr < 30
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
								children: "A1c trend"
							}), chart.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 mb-2 text-sm text-muted",
								children: "Need two A1c values to draw a trend. Record a visit to start the chart."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-48",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: chart,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "date",
												tick: { fontSize: 11 },
												stroke: "var(--color-muted)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												domain: [5, "auto"],
												tick: { fontSize: 11 },
												stroke: "var(--color-muted)",
												width: 32
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "a1c",
												stroke: "var(--color-primary)",
												strokeWidth: 2,
												dot: {
													r: 3,
													fill: "var(--color-primary)"
												}
											})
										]
									})
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
									children: "Current medicines"
								}),
								patient.currentMeds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: "No medicines recorded."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 divide-y divide-line",
									children: patient.currentMeds.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-ink-soft",
											children: m.dose
										})]
									}, m.name))
								}),
								patient.conditions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap gap-1.5",
									children: patient.conditions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: CONDITION_LABELS[c] }, c))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
								children: "Healthcare maintenance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 divide-y divide-line",
								children: plan.hcm.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-baseline justify-between gap-2 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: h.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: h.interval
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: h.due ? "warning" : "success",
											children: h.due ? "Due" : "Current"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: h.last ? `Last ${formatDate(h.last)}` : "Never recorded"
										})]
									})]
								}, h.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
								children: "Visit history"
							}), visits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: "No visits yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-3",
								children: visits.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-[var(--radius-md)] bg-bg px-3 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: formatDate(v.date)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted",
												children: v.clinician
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-ink-soft",
											children: v.planSummary
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 font-mono text-[11px] text-muted",
											children: [
												v.a1c != null ? `A1c ${v.a1c}%` : "",
												v.fpg != null ? ` · FPG ${v.fpg}` : "",
												` · next ${formatDate(v.nextReview)}`
											]
										})
									]
								}, v.id))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 text-ink-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.14em]",
						children: "Live plan from latest data"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanPanel, {
					plan,
					patientName: fullName(patient),
					mrn: patient.mrn,
					clinician: "Chart view",
					visitDate: todayIso(),
					compact: true
				})] })]
			})
		]
	});
}
function Metric({ label, value, hint, hot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2 font-display text-3xl tabular-nums leading-none", hot && "text-danger"),
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: hint
			})
		]
	});
}
//#endregion
export { PatientChart as component };
