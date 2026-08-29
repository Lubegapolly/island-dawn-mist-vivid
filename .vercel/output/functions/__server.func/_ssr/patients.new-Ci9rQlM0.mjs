import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as Button, i as useClinicStore, y as todayIso } from "./router-Bd5Fq0Bb.mjs";
import { n as NativeSelect, t as Input } from "./input-BRFJOUhQ.mjs";
import { i as buildCarePlan, o as patientToInput, r as RISK_LABELS } from "./cds-OcbWcbpT.mjs";
import { n as DISTRICTS, t as CLINICIANS } from "./types-ocXVQuXs.mjs";
import { t as Field } from "./label-BjFFoiX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients.new-Ci9rQlM0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RISKS = Object.keys(RISK_LABELS);
function NewPatient() {
	const navigate = useNavigate();
	const upsert = useClinicStore((s) => s.upsertPatient);
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [sex, setSex] = (0, import_react.useState)("F");
	const [dob, setDob] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [village, setVillage] = (0, import_react.useState)("");
	const [district, setDistrict] = (0, import_react.useState)("Mbarara");
	const [diagnosis, setDiagnosis] = (0, import_react.useState)("t2dm");
	const [diagnosisYear, setDiagnosisYear] = (0, import_react.useState)("");
	const [weightKg, setWeightKg] = (0, import_react.useState)("");
	const [heightCm, setHeightCm] = (0, import_react.useState)("");
	const [risks, setRisks] = (0, import_react.useState)([]);
	const [checkIn, setCheckIn] = (0, import_react.useState)(true);
	const submit = (e) => {
		e.preventDefault();
		if (!firstName.trim() || !lastName.trim() || !dob) {
			toast.error("Name and date of birth are required");
			return;
		}
		const id = `pt_${Date.now().toString(36)}`;
		const seq = String(Math.floor(1e4 + Math.random() * 89999));
		const now = /* @__PURE__ */ new Date();
		const draft = {
			id,
			mrn: `MRRH-DM-${seq}`,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			sex,
			dob,
			phone: phone.trim(),
			village: village.trim() || "—",
			district,
			diagnosis,
			diagnosisYear: diagnosisYear ? Number(diagnosisYear) : void 0,
			riskFactors: risks,
			conditions: [],
			allergies: "None known",
			currentMeds: [],
			weightKg: weightKg ? Number(weightKg) : void 0,
			heightCm: heightCm ? Number(heightCm) : void 0,
			nextReview: todayIso(now),
			labs: {},
			hcm: {},
			createdAt: todayIso(now),
			queue: checkIn ? {
				date: todayIso(now),
				stage: "waiting",
				checkInAt: now.toISOString()
			} : void 0
		};
		const plan = buildCarePlan(patientToInput(draft, now));
		draft.nextReview = plan.review.date;
		upsert(draft);
		toast.success(`${draft.firstName} registered · next review ${plan.review.label}`);
		navigate({
			to: "/patients/$patientId/visit",
			params: { patientId: id }
		});
	};
	const toggleRisk = (r) => setRisks((cur) => cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-6 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
				children: "Registration"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl tracking-tight",
				children: "New patient"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: "Creates a clinic record on this device. Open a visit next to generate the care plan."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-6 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "First name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: firstName,
										onChange: (e) => setFirstName(e.target.value),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Last name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: lastName,
										onChange: (e) => setLastName(e.target.value),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Sex",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
										value: sex,
										onChange: (e) => setSex(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "F",
											children: "Female"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "M",
											children: "Male"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Date of birth",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: dob,
										onChange: (e) => setDob(e.target.value),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Phone",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										placeholder: "+256 7xx xxx xxx"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Village",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: village,
										onChange: (e) => setVillage(e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "District",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
										value: district,
										onChange: (e) => setDistrict(e.target.value),
										children: DISTRICTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Working diagnosis",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
										value: diagnosis,
										onChange: (e) => setDiagnosis(e.target.value),
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Year of diagnosis",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "numeric",
										value: diagnosisYear,
										onChange: (e) => setDiagnosisYear(e.target.value),
										placeholder: "e.g. 2019"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Weight (kg)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "decimal",
										value: weightKg,
										onChange: (e) => setWeightKg(e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Height (cm)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										inputMode: "decimal",
										value: heightCm,
										onChange: (e) => setHeightCm(e.target.value)
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
							children: "Screening risk factors"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: RISKS.map((r) => {
								const on = risks.includes(r);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toggleRisk(r),
									className: on ? "h-9 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg" : "h-9 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-soft",
									children: RISK_LABELS[r]
								}, r);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: checkIn,
							onChange: (e) => setCheckIn(e.target.checked),
							className: "size-4 accent-primary"
						}), "Check in to today’s clinic board"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save and open visit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => history.back(),
							children: "Cancel"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["Clinician on duty: ", CLINICIANS[0]]
					})
				]
			})
		]
	});
}
//#endregion
export { NewPatient as component };
