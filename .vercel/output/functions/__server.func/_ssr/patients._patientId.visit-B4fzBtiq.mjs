import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as usePatient, b as Button, i as useClinicStore, l as bmi, m as fullName, n as Route, y as todayIso } from "./router-Bd5Fq0Bb.mjs";
import { n as NativeSelect, r as Textarea, t as Input } from "./input-BRFJOUhQ.mjs";
import { a as draftToInput, i as buildCarePlan, n as MED_CATALOGUE, t as CONDITION_LABELS } from "./cds-OcbWcbpT.mjs";
import { t as PlanPanel } from "./plan-panel-cw50Tedu.mjs";
import { t as CLINICIANS } from "./types-ocXVQuXs.mjs";
import { t as Field } from "./label-BjFFoiX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients._patientId.visit-B4fzBtiq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VisitPage() {
	const { patientId } = Route.useParams();
	const patient = usePatient(patientId);
	const addVisit = useClinicStore((s) => s.addVisit);
	const navigate = useNavigate();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const initial = (0, import_react.useMemo)(() => {
		if (!patient) return null;
		return patientToDraft(patient);
	}, [patient]);
	const live = draft ?? initial;
	if (!patient || !live) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
	const set = (key, value) => setDraft({
		...draft ?? live,
		[key]: value
	});
	const plan = buildCarePlan(draftToInput(patient, live, /* @__PURE__ */ new Date()));
	const b = bmi(Number(live.weightKg) || void 0, Number(live.heightCm) || void 0);
	const save = () => {
		const visit = {
			id: `vis_${Date.now().toString(36)}`,
			patientId: patient.id,
			date: live.date,
			clinician: live.clinician,
			weightKg: n(live.weightKg),
			heightCm: n(live.heightCm),
			sbp: n(live.sbp),
			dbp: n(live.dbp),
			a1c: n(live.a1c),
			fpg: n(live.fpg),
			ppg: n(live.ppg),
			randomBg: n(live.randomBg),
			ldl: n(live.ldl),
			acr: n(live.acr),
			egfr: n(live.egfr),
			alt: n(live.alt),
			hypoglycemia: live.hypoglycemia,
			symptomaticHyper: live.symptomaticHyper,
			treatmentChanged: live.treatmentChanged,
			healthStatusChange: live.healthStatusChange,
			insulinStartedToday: live.insulinStartedToday || plan.insulin.kind === "basal",
			smoking: live.smoking,
			alcohol: live.alcohol,
			footExam: live.footExam,
			neuropathyExam: live.neuropathyExam,
			notes: live.notes,
			meds: live.meds,
			nextReview: plan.review.date,
			a1cIntervalMonths: plan.review.a1cIntervalMonths,
			planSummary: plan.summary.split("\n")[0] ?? plan.diagnosisLine,
			alerts: plan.alerts.map((a) => a.title)
		};
		addVisit(visit, {
			currentMeds: live.meds,
			weightKg: visit.weightKg,
			heightCm: visit.heightCm,
			diagnosis: live.diagnosis,
			conditions: live.conditions,
			riskFactors: live.riskFactors,
			highHypoRisk: live.highHypoRisk,
			limitedLifeExpectancy: live.limitedLifeExpectancy,
			nextReview: plan.review.date,
			labs: {
				a1c: visit.a1c ?? patient.labs.a1c,
				a1cDate: visit.a1c != null ? live.date : patient.labs.a1cDate,
				fpg: visit.fpg ?? patient.labs.fpg,
				ppg: visit.ppg ?? patient.labs.ppg,
				randomBg: visit.randomBg ?? patient.labs.randomBg,
				ldl: visit.ldl ?? patient.labs.ldl,
				acr: visit.acr ?? patient.labs.acr,
				egfr: visit.egfr ?? patient.labs.egfr,
				alt: visit.alt ?? patient.labs.alt
			},
			hcm: {
				...patient.hcm,
				lastA1c: visit.a1c != null ? live.date : patient.hcm.lastA1c,
				lastFoot: live.footExam !== "deferred" ? live.date : patient.hcm.lastFoot,
				lastLipids: visit.ldl != null ? live.date : live.lastLipids ?? patient.hcm.lastLipids,
				lastAcr: visit.acr != null ? live.date : live.lastAcr ?? patient.hcm.lastAcr,
				lastEgfr: visit.egfr != null ? live.date : patient.hcm.lastEgfr,
				lastLft: visit.alt != null ? live.date : live.lastLft ?? patient.hcm.lastLft,
				lastEye: live.lastEye ?? patient.hcm.lastEye,
				lastEyeNormal: live.lastEyeNormal ?? patient.hcm.lastEyeNormal,
				lastB12: live.lastB12 ?? patient.hcm.lastB12,
				lastTsh: live.lastTsh ?? patient.hcm.lastTsh,
				hbvImmune: live.hbvImmune ?? patient.hcm.hbvImmune
			},
			queue: {
				date: todayIso(),
				stage: "pharmacy",
				timeSlot: patient.queue?.timeSlot,
				checkInAt: patient.queue?.checkInAt
			}
		});
		toast.success(`Visit saved · review ${plan.review.label} (${plan.review.date})`);
		navigate({
			to: "/patients/$patientId",
			params: { patientId: patient.id }
		});
	};
	const toggleMed = (item) => {
		const exists = live.meds.some((m) => m.name === item.name);
		set("meds", exists ? live.meds.filter((m) => m.name !== item.name) : [...live.meds, {
			name: item.name,
			dose: item.typical,
			cls: item.cls
		}]);
	};
	const setDose = (name, dose) => set("meds", live.meds.map((m) => m.name === name ? {
		...m,
		dose
	} : m));
	const toggleCond = (c) => set("conditions", live.conditions.includes(c) ? live.conditions.filter((x) => x !== c) : [...live.conditions, c]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Encounter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl tracking-tight",
				children: fullName(patient)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: [patient.mrn, " · Enter today’s findings — the plan on the right updates as you type."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-5",
					onSubmit: (e) => {
						e.preventDefault();
						save();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Visit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Date",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: live.date,
											onChange: (e) => set("date", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Clinician",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
											value: live.clinician,
											onChange: (e) => set("clinician", e.target.value),
											children: CLINICIANS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Working diagnosis",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
											value: live.diagnosis,
											onChange: (e) => set("diagnosis", e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "t2dm",
													children: "Type 2 diabetes"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "t1dm",
													children: "Type 1 diabetes"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "prediabetes",
													children: "Prediabetes"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "gdm",
													children: "Gestational diabetes"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "screening",
													children: "Screening / at risk"
												})
											]
										})
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Vitals",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Weight kg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "decimal",
											value: live.weightKg,
											onChange: (e) => set("weightKg", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Height cm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "decimal",
											value: live.heightCm,
											onChange: (e) => set("heightCm", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "SBP",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: live.sbp,
											onChange: (e) => set("sbp", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "DBP",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: live.dbp,
											onChange: (e) => set("dbp", e.target.value)
										})
									})
								]
							}), b != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-ink-soft",
								children: ["BMI ", b]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Glucose",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "A1c %",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												inputMode: "decimal",
												value: live.a1c,
												onChange: (e) => set("a1c", e.target.value)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "FPG mg/dL",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												inputMode: "numeric",
												value: live.fpg,
												onChange: (e) => set("fpg", e.target.value)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Post-meal",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												inputMode: "numeric",
												value: live.ppg,
												onChange: (e) => set("ppg", e.target.value)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Random BG",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												inputMode: "numeric",
												value: live.randomBg,
												onChange: (e) => set("randomBg", e.target.value)
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Hypoglycaemia",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
											value: live.hypoglycemia,
											onChange: (e) => set("hypoglycemia", e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "none",
													children: "None"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "mild",
													children: "Mild / infrequent"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "frequent",
													children: "Frequent"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "severe",
													children: "Severe"
												})
											]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Foot exam",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
											value: live.footExam,
											onChange: (e) => set("footExam", e.target.value),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "deferred",
													children: "Deferred"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "normal",
													children: "Normal"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "abnormal",
													children: "Abnormal"
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-col gap-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Osmotic symptoms (thirst, polyuria, weight loss)",
											checked: live.symptomaticHyper,
											onChange: (v) => set("symptomaticHyper", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Treatment changed today or recently",
											checked: live.treatmentChanged,
											onChange: (v) => set("treatmentChanged", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Change in health status",
											checked: live.healthStatusChange,
											onChange: (v) => set("healthStatusChange", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Insulin started today",
											checked: live.insulinStartedToday,
											onChange: (v) => set("insulinStartedToday", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Tobacco use",
											checked: live.smoking,
											onChange: (v) => set("smoking", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Alcohol use",
											checked: live.alcohol,
											onChange: (v) => set("alcohol", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "High hypoglycaemia risk / frailty",
											checked: live.highHypoRisk,
											onChange: (v) => set("highHypoRisk", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											label: "Life expectancy ≤10 years",
											checked: live.limitedLifeExpectancy,
											onChange: (v) => set("limitedLifeExpectancy", v)
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Labs (optional today)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "LDL",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "decimal",
											value: live.ldl,
											onChange: (e) => set("ldl", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Urine ACR",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "decimal",
											value: live.acr,
											onChange: (e) => set("acr", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "eGFR",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: live.egfr,
											onChange: (e) => set("egfr", e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "ALT",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											inputMode: "numeric",
											value: live.alt,
											onChange: (e) => set("alt", e.target.value)
										})
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Medicines",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: MED_CATALOGUE.map((item) => {
									const on = live.meds.some((m) => m.name === item.name);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleMed(item),
										className: on ? "h-9 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg" : "h-9 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-soft",
										children: item.name
									}, item.name);
								})
							}), live.meds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2",
								children: live.meds.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "grid grid-cols-[1fr_140px] items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: m.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: m.dose,
										onChange: (e) => setDose(m.name, e.target.value),
										className: "h-9"
									})]
								}, m.name))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Comorbidities",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: Object.keys(CONDITION_LABELS).map((c) => {
									const on = live.conditions.includes(c);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleCond(c),
										className: on ? "h-9 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg" : "h-9 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-soft",
										children: CONDITION_LABELS[c]
									}, c);
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Notes",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: live.notes,
								onChange: (e) => set("notes", e.target.value),
								placeholder: "Adherence, social context, sick-day plan…"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Save visit and book review"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "secondary",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/patients/$patientId",
									params: { patientId: patient.id },
									children: "Cancel"
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "xl:sticky xl:top-6 xl:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanPanel, {
						plan,
						patientName: fullName(patient),
						mrn: patient.mrn,
						clinician: live.clinician,
						visitDate: live.date
					})
				})]
			})
		]
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children
		})]
	});
}
function Check({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked),
			className: "mt-0.5 size-4 accent-primary"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function n(v) {
	if (!v.trim()) return void 0;
	const x = Number(v);
	return Number.isFinite(x) ? x : void 0;
}
function patientToDraft(patient) {
	return {
		date: todayIso(),
		clinician: CLINICIANS[0],
		weightKg: patient.weightKg != null ? String(patient.weightKg) : "",
		heightCm: patient.heightCm != null ? String(patient.heightCm) : "",
		sbp: "",
		dbp: "",
		a1c: patient.labs.a1c != null ? String(patient.labs.a1c) : "",
		fpg: patient.labs.fpg != null ? String(patient.labs.fpg) : "",
		ppg: patient.labs.ppg != null ? String(patient.labs.ppg) : "",
		randomBg: patient.labs.randomBg != null ? String(patient.labs.randomBg) : "",
		ldl: patient.labs.ldl != null ? String(patient.labs.ldl) : "",
		acr: patient.labs.acr != null ? String(patient.labs.acr) : "",
		egfr: patient.labs.egfr != null ? String(patient.labs.egfr) : "",
		alt: patient.labs.alt != null ? String(patient.labs.alt) : "",
		hypoglycemia: "none",
		symptomaticHyper: false,
		treatmentChanged: false,
		healthStatusChange: false,
		insulinStartedToday: false,
		smoking: false,
		alcohol: false,
		footExam: "deferred",
		neuropathyExam: "deferred",
		notes: "",
		meds: patient.currentMeds,
		diagnosis: patient.diagnosis,
		highHypoRisk: Boolean(patient.highHypoRisk),
		limitedLifeExpectancy: Boolean(patient.limitedLifeExpectancy),
		conditions: patient.conditions,
		riskFactors: patient.riskFactors,
		lastEye: patient.hcm.lastEye,
		lastEyeNormal: patient.hcm.lastEyeNormal,
		lastLipids: patient.hcm.lastLipids,
		lastAcr: patient.hcm.lastAcr,
		lastB12: patient.hcm.lastB12,
		lastTsh: patient.hcm.lastTsh,
		lastLft: patient.hcm.lastLft,
		hbvImmune: patient.hcm.hbvImmune
	};
}
//#endregion
export { VisitPage as component };
