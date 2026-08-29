import { i as __toESM } from "../_runtime.mjs";
import { B as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as Search, s as Plus } from "../_libs/lucide-react.mjs";
import { b as Button, f as diagnosisShort, h as initials, i as useClinicStore, m as fullName, p as formatDate, s as ageSex, x as cn, y as todayIso } from "./router-Bd5Fq0Bb.mjs";
import { t as Badge } from "./badge-C5JWkxvH.mjs";
import { n as NativeSelect, t as Input } from "./input-BRFJOUhQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients-BOAY-pDl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "t2dm",
		label: "T2DM"
	},
	{
		id: "t1dm",
		label: "T1DM"
	},
	{
		id: "prediabetes",
		label: "Pre-DM"
	},
	{
		id: "screening",
		label: "Screening"
	},
	{
		id: "overdue",
		label: "Overdue"
	}
];
function PatientsPage() {
	const patients = useClinicStore((s) => s.patients);
	const addToToday = useClinicStore((s) => s.addToToday);
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const today = todayIso();
	const list = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return patients.filter((p) => {
			if (filter === "overdue") return p.nextReview < today;
			if (filter !== "all") return p.diagnosis === filter;
			return true;
		}).filter((p) => {
			if (!query) return true;
			return `${p.firstName} ${p.lastName} ${p.mrn} ${p.phone} ${p.village} ${p.district}`.toLowerCase().includes(query);
		}).sort((a, b) => a.lastName.localeCompare(b.lastName));
	}, [
		patients,
		q,
		filter,
		today
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-6 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
						children: "Registry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl tracking-tight",
						children: "Patients"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-ink-soft",
						children: [patients.length, " on this device · search by name, MRN, village or phone"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/patients/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New patient"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search patients",
						className: "pl-10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					className: "sm:w-44",
					value: filter,
					onChange: (e) => setFilter(e.target.value),
					children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: f.id,
						children: f.label
					}, f.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-border)]",
				children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-12 text-center text-sm text-muted",
					children: "No matching patients."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line",
					children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientRow, {
						patient: p,
						today,
						onCheckIn: () => addToToday(p.id)
					}, p.id))
				})
			})
		]
	});
}
function PatientRow({ patient, today, onCheckIn }) {
	const overdue = patient.nextReview < today;
	const onBoard = patient.queue?.date === today;
	const a1c = patient.labs.a1c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/patients/$patientId",
			params: { patientId: patient.id },
			className: "flex min-w-0 flex-1 items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary-soft font-display text-sm text-primary",
				children: initials(patient)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-medium",
					children: fullName(patient)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate font-mono text-[11px] text-muted",
					children: [
						patient.mrn,
						" · ",
						ageSex(patient),
						" · ",
						patient.village
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 sm:justify-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "primary",
					children: diagnosisShort(patient.diagnosis)
				}),
				a1c != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					tone: a1c >= 9 ? "danger" : a1c >= 7 ? "warning" : "success",
					children: [
						"A1c ",
						a1c.toFixed(1),
						"%"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("text-xs tabular-nums", overdue ? "font-medium text-warning" : "text-muted"),
					children: ["Review ", formatDate(patient.nextReview)]
				}),
				onBoard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "info",
					children: patient.queue?.stage
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: onCheckIn,
					children: "Check in"
				})
			]
		})]
	});
}
//#endregion
export { PatientsPage as component };
