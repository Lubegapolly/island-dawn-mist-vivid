import { addDays, format } from "date-fns";
import type {
  CarePlan,
  CdsAlert,
  ChecklistItem,
  Condition,
  Diagnosis,
  GlycemicClass,
  HcmItem,
  InsulinPlan,
  Medication,
  Patient,
  PlanItem,
  ReviewSuggestion,
  VisitDraft,
} from "./types";
import { ageYears, bmi, monthsBetween, num } from "./format";

export type CdsInput = {
  now: Date;
  diagnosis: Diagnosis;
  sex: "F" | "M";
  dob: string;
  weightKg?: number;
  heightCm?: number;
  sbp?: number;
  dbp?: number;
  a1c?: number;
  fpg?: number;
  ppg?: number;
  randomBg?: number;
  ldl?: number;
  acr?: number;
  egfr?: number;
  alt?: number;
  hypoglycemia: VisitDraft["hypoglycemia"];
  symptomaticHyper: boolean;
  treatmentChanged: boolean;
  healthStatusChange: boolean;
  insulinStartedToday: boolean;
  smoking: boolean;
  alcohol: boolean;
  meds: Medication[];
  conditions: Condition[];
  riskFactors: Patient["riskFactors"];
  highHypoRisk: boolean;
  limitedLifeExpectancy: boolean;
  hcm: Patient["hcm"];
  diagnosisYear?: number;
};

export function draftToInput(
  patient: Patient,
  draft: VisitDraft,
  now: Date,
): CdsInput {
  return {
    now,
    diagnosis: draft.diagnosis,
    sex: patient.sex,
    dob: patient.dob,
    weightKg: num(draft.weightKg),
    heightCm: num(draft.heightCm),
    sbp: num(draft.sbp),
    dbp: num(draft.dbp),
    a1c: num(draft.a1c),
    fpg: num(draft.fpg),
    ppg: num(draft.ppg),
    randomBg: num(draft.randomBg),
    ldl: num(draft.ldl),
    acr: num(draft.acr),
    egfr: num(draft.egfr),
    alt: num(draft.alt),
    hypoglycemia: draft.hypoglycemia,
    symptomaticHyper: draft.symptomaticHyper,
    treatmentChanged: draft.treatmentChanged,
    healthStatusChange: draft.healthStatusChange,
    insulinStartedToday: draft.insulinStartedToday,
    smoking: draft.smoking,
    alcohol: draft.alcohol,
    meds: draft.meds,
    conditions: draft.conditions,
    riskFactors: draft.riskFactors,
    highHypoRisk: draft.highHypoRisk,
    limitedLifeExpectancy: draft.limitedLifeExpectancy,
    hcm: {
      ...patient.hcm,
      lastEye: draft.lastEye ?? patient.hcm.lastEye,
      lastEyeNormal: draft.lastEyeNormal ?? patient.hcm.lastEyeNormal,
      lastLipids: draft.lastLipids ?? patient.hcm.lastLipids,
      lastAcr: draft.lastAcr ?? patient.hcm.lastAcr,
      lastB12: draft.lastB12 ?? patient.hcm.lastB12,
      lastTsh: draft.lastTsh ?? patient.hcm.lastTsh,
      lastLft: draft.lastLft ?? patient.hcm.lastLft,
      hbvImmune: draft.hbvImmune ?? patient.hcm.hbvImmune,
    },
    diagnosisYear: patient.diagnosisYear,
  };
}

export function patientToInput(patient: Patient, now: Date): CdsInput {
  return {
    now,
    diagnosis: patient.diagnosis,
    sex: patient.sex,
    dob: patient.dob,
    weightKg: patient.weightKg,
    heightCm: patient.heightCm,
    sbp: undefined,
    dbp: undefined,
    a1c: patient.labs.a1c,
    fpg: patient.labs.fpg,
    ppg: patient.labs.ppg,
    randomBg: patient.labs.randomBg,
    ldl: patient.labs.ldl,
    acr: patient.labs.acr,
    egfr: patient.labs.egfr,
    alt: patient.labs.alt,
    hypoglycemia: "none",
    symptomaticHyper: false,
    treatmentChanged: false,
    healthStatusChange: false,
    insulinStartedToday: false,
    smoking: false,
    alcohol: false,
    meds: patient.currentMeds,
    conditions: patient.conditions,
    riskFactors: patient.riskFactors,
    highHypoRisk: Boolean(patient.highHypoRisk),
    limitedLifeExpectancy: Boolean(patient.limitedLifeExpectancy),
    hcm: patient.hcm,
    diagnosisYear: patient.diagnosisYear,
  };
}

function hasMed(meds: Medication[], cls: Medication["cls"]) {
  return meds.some((m) => m.cls === cls);
}

function medsOf(meds: Medication[], cls: Medication["cls"]) {
  return meds.filter((m) => m.cls === cls);
}

function basalUnits(meds: Medication[]): number | undefined {
  const basal = [
    ...medsOf(meds, "insulin-basal"),
    ...medsOf(meds, "insulin-mixed"),
  ];
  if (!basal.length) return undefined;
  let total = 0;
  for (const m of basal) {
    const n = Number.parseFloat(m.dose);
    if (Number.isFinite(n)) total += n;
  }
  return total || undefined;
}

function oralCount(meds: Medication[]) {
  return meds.filter((m) =>
    ["metformin", "su", "sglt2", "dpp4", "glp1"].includes(m.cls),
  ).length;
}

function unreliableA1c(c: Condition[]) {
  return (
    c.includes("sickle-cell") ||
    c.includes("anemia") ||
    c.includes("pregnancy") ||
    c.includes("hiv") ||
    c.includes("esrd")
  );
}

export function classifyGlycemia(input: CdsInput): GlycemicClass {
  const { a1c, fpg, randomBg, symptomaticHyper } = input;
  const dm =
    (a1c != null && a1c >= 6.5) ||
    (fpg != null && fpg >= 126) ||
    (randomBg != null && randomBg >= 200 && symptomaticHyper) ||
    input.diagnosis === "t1dm" ||
    input.diagnosis === "t2dm" ||
    input.diagnosis === "gdm";
  const pre =
    (a1c != null && a1c >= 5.7 && a1c < 6.5) ||
    (fpg != null && fpg >= 100 && fpg < 126) ||
    input.diagnosis === "prediabetes";

  if (dm) {
    const confirmed =
      input.diagnosis === "t1dm" ||
      input.diagnosis === "t2dm" ||
      input.diagnosis === "gdm" ||
      (randomBg != null && randomBg >= 200 && symptomaticHyper);
    return confirmed ? "diabetes" : "unconfirmed-diabetes";
  }
  if (pre) return "prediabetes";
  return "normal";
}

export function a1cTarget(input: CdsInput): CarePlan["a1cTarget"] {
  const age = ageYears(input.dob, input.now);
  const liberalize =
    input.limitedLifeExpectancy ||
    input.highHypoRisk ||
    input.conditions.includes("esrd") ||
    age >= 80;
  if (liberalize) {
    return {
      display: "<8–8.5%",
      numeric: 8.5,
      rationale:
        "Liberalised because of limited life expectancy, high hypoglycaemia risk, or ESRD (ADA: <8–8.5%).",
    };
  }
  return {
    display: "<7%",
    numeric: 7,
    rationale: "Standard ADA target for most non-pregnant adults.",
  };
}

function highRiskScreening(input: CdsInput) {
  const b = bmi(input.weightKg, input.heightCm);
  const asian = input.riskFactors.includes("asian-bmi-threshold");
  const bmiCut = asian ? 23 : 25;
  return (
    (b != null && b >= bmiCut && input.riskFactors.length > 0) ||
    input.riskFactors.includes("gdm-hx") ||
    input.riskFactors.includes("pancreatitis") ||
    input.riskFactors.includes("hiv") ||
    input.riskFactors.includes("weight-gain")
  );
}

export function suggestReview(input: CdsInput): ReviewSuggestion {
  const cls = classifyGlycemia(input);
  const target = a1cTarget(input);
  const atGoal = input.a1c != null && input.a1c < target.numeric;
  const criticalHyper =
    (input.a1c != null && input.a1c >= 10) ||
    (input.randomBg != null && input.randomBg >= 300) ||
    (input.fpg != null && input.fpg >= 250) ||
    input.symptomaticHyper;
  const severeHypo =
    input.hypoglycemia === "severe" || input.hypoglycemia === "frequent";
  const insulin = insulinPlan(input);
  const insulinWork =
    input.insulinStartedToday ||
    insulin.kind === "basal" ||
    insulin.kind === "titrate-basal" ||
    insulin.kind === "prandial" ||
    insulin.kind === "mixed";

  const reasons: string[] = [];
  let days = 90;
  let urgency: ReviewSuggestion["urgency"] = "routine";
  let a1cIntervalMonths = 3;
  let citation = "Diab Care 2026;49:S61–88";

  if (cls === "normal") {
    citation = "Diab Care 2026;49:S35";
    if (highRiskScreening(input) || input.riskFactors.includes("weight-gain")) {
      days = 365;
      urgency = "extended";
      a1cIntervalMonths = 12;
      reasons.push(
        "Average-to-high risk screening: repeat at least yearly (pre-DM or weight gain, or BMI + risk factors).",
      );
    } else {
      days = 365 * 3;
      urgency = "extended";
      a1cIntervalMonths = 36;
      reasons.push(
        "Screening normal. ADA: begin at ≥35 years and repeat every 3 years if remains normal.",
      );
    }
  } else if (cls === "prediabetes") {
    citation = "Diab Care 2026;49:S35";
    if (input.a1c != null && input.a1c >= 6.0) {
      days = 180;
      a1cIntervalMonths = 6;
      reasons.push("Prediabetes with A1c 6.0–6.4% — rescreen every 6 months.");
    } else {
      days = 365;
      a1cIntervalMonths = 12;
      reasons.push("Prediabetes — A1c at least yearly.");
    }
    if (input.treatmentChanged) {
      days = 90;
      a1cIntervalMonths = 3;
      urgency = "routine";
      reasons.push("Treatment started (e.g. metformin) — earlier review.");
    }
  } else {
    // diabetes / unconfirmed
    if (criticalHyper || input.hypoglycemia === "severe") {
      days = 14;
      urgency = "stat";
      a1cIntervalMonths = 3;
      if (criticalHyper) {
        reasons.push(
          "Marked hyperglycaemia (A1c ≥10%, FPG ≥250, random ≥300, or osmotic symptoms) — safety review in 2 weeks.",
        );
      }
      if (input.hypoglycemia === "severe") {
        reasons.push("Severe hypoglycaemia — review within 2 weeks and reduce insulin/secretagogue.");
      }
    } else if (insulinWork || severeHypo) {
      days = 21;
      urgency = "soon";
      a1cIntervalMonths = 3;
      if (insulinWork) {
        reasons.push(
          "Insulin start or titration. Fasting log; increase 2–4 U (or 10–15%) every 2–3 days until FPG 80–130.",
        );
      }
      if (severeHypo) {
        reasons.push("Frequent hypoglycaemia — early follow-up after dose reduction.");
      }
    } else if (
      input.treatmentChanged ||
      input.healthStatusChange ||
      !atGoal ||
      input.a1c == null
    ) {
      days = 90;
      urgency = "routine";
      a1cIntervalMonths = 3;
      if (input.a1c == null) {
        reasons.push("No current A1c — recheck in 3 months (or sooner if therapy changes).");
      } else if (!atGoal) {
        reasons.push(
          `A1c ${input.a1c.toFixed(1)}% is above target ${target.display} — A1c every 3 months until stable at goal.`,
        );
      }
      if (input.treatmentChanged) {
        reasons.push("Recent treatment change — A1c every 3 months.");
      }
      if (input.healthStatusChange) {
        reasons.push("Change in health status — closer monitoring.");
      }
    } else {
      days = 180;
      urgency = "routine";
      a1cIntervalMonths = 6;
      reasons.push(
        `A1c at target (${input.a1c?.toFixed(1)}%, goal ${target.display}) on a stable regimen without hypoglycaemia — A1c every 6 months.`,
      );
    }
  }

  const date = format(addDays(input.now, days), "yyyy-MM-dd");
  const label =
    days <= 16
      ? "2 weeks"
      : days <= 24
        ? "3 weeks"
        : days <= 32
          ? "4 weeks"
          : days <= 100
            ? "3 months"
            : days <= 200
              ? "6 months"
              : days <= 400
                ? "12 months"
                : "3 years";

  return {
    days,
    label,
    date,
    urgency,
    a1cIntervalMonths,
    reasons,
    citation,
  };
}

export function insulinPlan(input: CdsInput): InsulinPlan {
  const age = ageYears(input.dob, input.now);
  const w = input.weightKg;
  const a1c = input.a1c;
  const onBasal =
    hasMed(input.meds, "insulin-basal") || hasMed(input.meds, "insulin-mixed");
  const onPrandial = hasMed(input.meds, "insulin-prandial");
  const units = basalUnits(input.meds);
  const uPerKg = w && units ? units / w : undefined;
  const twoOrals = oralCount(input.meds) >= 2;
  const highA1cTwoAgents =
    twoOrals &&
    a1c != null &&
    ((age < 65 && a1c > 8) || (age >= 65 && a1c > 8.5));

  const critical =
    (a1c != null && a1c >= 10) ||
    (input.randomBg != null && input.randomBg >= 300) ||
    (input.fpg != null && input.fpg >= 250) ||
    input.symptomaticHyper;

  const suspicionT1 =
    input.diagnosis === "t1dm" ||
    (input.diagnosis === "t2dm" &&
      age < 40 &&
      a1c != null &&
      a1c >= 10 &&
      !hasMed(input.meds, "metformin"));

  const fpgAtTarget =
    input.fpg != null && input.fpg >= 80 && input.fpg <= 130;
  const target = a1cTarget(input);
  const a1cHigh = a1c != null && a1c >= target.numeric;

  const localNote =
    "MRRH public-sector insulin is usually NPH and Regular / 70/30. Prefer a long-acting analog (glargine, detemir, degludec) once daily if the patient can obtain it — lower hypoglycaemia than NPH BID. Pens are easier; syringes are cheaper.";

  const hypoHold =
    "If hypoglycaemia occurs or FPG <80 without a clear reason, decrease the dose by 10–20% or 4 U, whichever is greater.";
  const titration =
    "Increase by 2–4 U or 10–15% every 2–3 days until AM fasting glucose is 80–130 without hypoglycaemia. Savvy patients can self-titrate.";

  if (onBasal && uPerKg != null && uPerKg > 0.5 && fpgAtTarget && a1cHigh && !onPrandial) {
    const prandialA = 4;
    const prandialB = w ? Math.round(w * 0.1) : undefined;
    const prandialC = units ? Math.round(units * 0.1) : undefined;
    return {
      indicated: true,
      reason:
        "A1c still above target with basal insulin >0.5 U/kg/day and fasting glucose already 80–130. Add mealtime coverage — but consider a GLP-1 RA (or dual GIP/GLP-1) first to limit hypoglycaemia and weight gain.",
      kind: "prandial",
      startRange: [
        `${prandialA} U`,
        prandialB != null ? `${prandialB} U (0.1 U/kg)` : null,
        prandialC != null ? `${prandialC} U (10% of basal)` : null,
      ]
        .filter(Boolean)
        .join("  ·  "),
      startMidU: prandialB ?? prandialA,
      weightKg: w,
      titration:
        "Strategy 1: rapid-acting insulin before the largest meal; titrate 1–2 U or 10–15% every 3 days (pre-meal 80–130, 1–2 h post-meal <180). If still high, add to another meal. Strategy 2: switch to mixed 70/30 BID (before breakfast and dinner) — split current basal ⅔ AM / ⅓ PM or ½ / ½; confirm the patient eats three meals.",
      hypoHold,
      syringe: syringeFor(prandialB ?? prandialA),
      localNote:
        "GLP-1 RAs are often out of pocket in Uganda. If unavailable, add Regular insulin before the main meal or convert to 70/30 (common at MRRH). Confirm three regular meals before mixed insulin.",
    };
  }

  if (onBasal) {
    return {
      indicated: true,
      reason: "Already on basal or mixed insulin — continue titration to fasting 80–130.",
      kind: "titrate-basal",
      startRange: units != null ? `Current total ~${units} U/day` : "Continue current basal",
      startMidU: units,
      weightKg: w,
      titration,
      hypoHold,
      syringe: units != null ? syringeFor(units) : undefined,
      localNote,
    };
  }

  if (critical || suspicionT1 || highA1cTwoAgents) {
    const high = a1c != null && a1c >= 8;
    const lowU = w ? Math.round(w * (high ? 0.2 : 0.1)) : undefined;
    const highU = w ? Math.round(w * (high ? 0.3 : 0.2)) : undefined;
    const mid = w ? Math.round(w * (high ? 0.25 : 0.15)) : undefined;
    const reasons: string[] = [];
    if (a1c != null && a1c >= 10) reasons.push(`A1c ${a1c.toFixed(1)}% ≥10%`);
    if (input.randomBg != null && input.randomBg >= 300)
      reasons.push(`random BG ${input.randomBg} ≥300`);
    if (input.fpg != null && input.fpg >= 250)
      reasons.push(`FPG ${input.fpg} ≥250`);
    if (input.symptomaticHyper) reasons.push("osmotic symptoms");
    if (suspicionT1) reasons.push("consider T1DM / LADA / insulin deficiency");
    if (highA1cTwoAgents)
      reasons.push(
        age < 65
          ? "age <65 on two agents with A1c >8%"
          : "age ≥65 on two agents with A1c >8.5%",
      );

    return {
      indicated: true,
      reason: `Criteria for basal insulin: ${reasons.join("; ")}.`,
      kind: "basal",
      startRange:
        lowU != null && highU != null
          ? `${lowU}–${highU} U once daily (${high ? "0.2–0.3" : "0.1–0.2"} U/kg)`
          : high
            ? "0.2–0.3 U/kg/day"
            : "0.1–0.2 U/kg/day",
      startMidU: mid,
      weightKg: w,
      titration,
      hypoHold,
      syringe: mid != null ? syringeFor(mid) : undefined,
      localNote,
    };
  }

  return {
    indicated: false,
    reason: "Basal insulin not indicated on current values.",
    kind: "none",
    titration: "",
    hypoHold: "",
    localNote,
  };
}

function syringeFor(units: number) {
  if (units <= 30) return "Use a 0.3 mL (30 U) syringe — smallest barrel, clearest markings.";
  if (units <= 50) return "Use a 0.5 mL (50 U) syringe.";
  return "Use a 1 mL (100 U) syringe.";
}

function due(
  last: string | undefined,
  intervalMonths: number,
  now: Date,
): { due: boolean; overdueMonths?: number; last?: string } {
  if (!last) return { due: true, last };
  const m = monthsBetween(last, now);
  if (m >= intervalMonths) return { due: true, overdueMonths: m - intervalMonths, last };
  return { due: false, last };
}

export function hcmItems(input: CdsInput): HcmItem[] {
  const now = input.now;
  const diabetic =
    classifyGlycemia(input) === "diabetes" ||
    classifyGlycemia(input) === "unconfirmed-diabetes" ||
    input.diagnosis === "t1dm" ||
    input.diagnosis === "t2dm";
  const onMet = hasMed(input.meds, "metformin");
  const eyeInterval = input.hcm.lastEyeNormal ? 24 : 12;
  const age = ageYears(input.dob, now);

  const items: HcmItem[] = [];

  const a1cInt = suggestReview(input).a1cIntervalMonths;
  const a1cDue = due(input.hcm.lastA1c, a1cInt, now);
  items.push({
    id: "a1c",
    label: "A1c",
    interval: `every ${a1cInt} mo`,
    last: a1cDue.last,
    due: a1cDue.due,
    overdueMonths: a1cDue.overdueMonths,
    action: unreliableA1c(input.conditions)
      ? "A1c unreliable (high RBC turnover / anaemia / HIV / ESRD / pregnancy) — use plasma glucose."
      : `Draw A1c today if due. Goal ${a1cTarget(input).display}.`,
  });

  if (diabetic) {
    const foot = due(input.hcm.lastFoot, 0, now);
    items.push({
      id: "foot",
      label: "Foot exam",
      interval: "every visit",
      last: input.hcm.lastFoot,
      due: true,
      overdueMonths: foot.overdueMonths,
      action:
        "Inspect skin, joints, pulses, sensation. 10 g monofilament annually (abnormal if no sensation at 4/10 sites). Vascular referral if PVD.",
    });
    const eye = due(input.hcm.lastEye, eyeInterval, now);
    items.push({
      id: "eye",
      label: "Retinopathy screen",
      interval: input.hcm.lastEyeNormal ? "q2–3 y if prior normal" : "annually",
      last: eye.last,
      due: eye.due,
      overdueMonths: eye.overdueMonths,
      action: "Dilated exam or retinal photography. Refer ophthalmology if overdue or abnormal.",
    });
    const lip = due(input.hcm.lastLipids, 12, now);
    items.push({
      id: "lipids",
      label: "Lipid panel",
      interval: "annually",
      last: lip.last,
      due: lip.due,
      overdueMonths: lip.overdueMonths,
      action:
        age >= 40
          ? "Age 40–75: moderate-intensity statin for all diabetes, regardless of panel. High-intensity if ≥1 ASCVD risk factor (LDL-C <70); clinical ASCVD target LDL-C <55."
          : "Age 20–39: consider statin if additional cardiovascular risk factors.",
    });
    const acr = due(input.hcm.lastAcr, 12, now);
    items.push({
      id: "acr",
      label: "Urine ACR + eGFR",
      interval: "annually",
      last: acr.last,
      due: acr.due,
      overdueMonths: acr.overdueMonths,
      action:
        "ACEi/ARB if hypertensive with proteinuria or eGFR <60. Refer renal if eGFR <30.",
    });
    const lft = due(input.hcm.lastLft, 12, now);
    items.push({
      id: "lft",
      label: "LFTs / MASLD",
      interval: "annually",
      last: lft.last,
      due: lft.due,
      overdueMonths: lft.overdueMonths,
      action:
        "If elevated, consider elastography and/or hepatology referral for MASLD.",
    });
  }

  if (onMet) {
    const b12 = due(input.hcm.lastB12, 12, now);
    items.push({
      id: "b12",
      label: "Vitamin B12",
      interval: "annually on metformin",
      last: b12.last,
      due: b12.due,
      overdueMonths: b12.overdueMonths,
      action: "Check B12 in patients on long-term metformin.",
    });
  }

  if (input.diagnosis === "t1dm") {
    const tsh = due(input.hcm.lastTsh, 12, now);
    items.push({
      id: "tsh",
      label: "TSH (T1DM)",
      interval: "at diagnosis and yearly",
      last: tsh.last,
      due: tsh.due,
      overdueMonths: tsh.overdueMonths,
      action: "Screen thyroid disease and coeliac at diagnosis, and if signs develop.",
    });
  }

  items.push({
    id: "vaccines",
    label: "Vaccines",
    interval: "per CDC / UNEPI",
    last: input.hcm.influenza,
    due: due(input.hcm.influenza, 12, now).due,
    action: vaccineLine(age, input),
  });

  return items;
}

function vaccineLine(age: number, input: CdsInput) {
  const bits = [
    "Influenza annually",
    "COVID-19 per current schedule",
    age < 60 && !input.hcm.hbvImmune ? "HBV series if not immune (age <60)" : null,
    age > 50 ? "Zoster (age >50)" : null,
    "Tdap",
    "Pneumococcus",
    "RSV per CDC",
  ].filter(Boolean);
  return bits.join(" · ");
}

function alerts(input: CdsInput, insulin: InsulinPlan): CdsAlert[] {
  const out: CdsAlert[] = [];
  const cls = classifyGlycemia(input);
  if (cls === "unconfirmed-diabetes") {
    out.push({
      severity: "warning",
      title: "Confirm the diagnosis",
      detail:
        "Unless diagnosis is by symptoms plus random glucose ≥200, confirm with a repeat or a second test at the same time or promptly after.",
      citation: "Diab Care 2025;48:S27",
    });
  }
  if (unreliableA1c(input.conditions)) {
    out.push({
      severity: "warning",
      title: "Do not rely on A1c alone",
      detail:
        "High RBC turnover (sickle cell, 2nd/3rd trimester, G6PD, dialysis, HIV, recent blood loss/transfusion, EPO, thalassaemia, anaemia) — use plasma glucose criteria.",
      citation: "Diab Care 2026;49:S27 / UTD",
    });
  }
  if (
    (input.a1c != null && input.a1c >= 10) ||
    (input.randomBg != null && input.randomBg >= 300) ||
    (input.fpg != null && input.fpg >= 250) ||
    input.symptomaticHyper
  ) {
    out.push({
      severity: "critical",
      title: "Marked hyperglycaemia",
      detail:
        "Consider insulin now. Assess volume status, ketones if T1DM/LADA suspected, and ability to self-monitor. Refer diabetes educator.",
      citation: "Diab Care 2026;49:S183–215",
    });
  }
  if (input.hypoglycemia === "severe") {
    out.push({
      severity: "critical",
      title: "Severe hypoglycaemia",
      detail:
        "Reduce insulin or sulfonylurea today. Review timing, meals, and renal function. Educate on recognition and glucagon/sugar treatment.",
    });
  }
  if (input.egfr != null && input.egfr < 30) {
    out.push({
      severity: "critical",
      title: "eGFR <30 — refer renal",
      detail: "Stop metformin if eGFR <30. Adjust insulin. Renal clinic referral.",
      citation: "Diab Care 2026;49:S61–88",
    });
  }
  if (input.sbp != null && input.dbp != null && (input.sbp >= 180 || input.dbp >= 120)) {
    out.push({
      severity: "critical",
      title: "Severe hypertension",
      detail: "BP in a severe range — recheck, assess symptoms, treat per hypertensive emergency/urgency protocol.",
    });
  }
  if (insulin.kind === "prandial") {
    out.push({
      severity: "info",
      title: "GLP-1 before prandial insulin",
      detail:
        "ADA recommends a GLP-1 RA or dual GIP/GLP-1 RA before adding mealtime insulin when fasting glucose is already at target.",
      citation: "Diab Care 2026;49:S183–215",
    });
  }
  const b = bmi(input.weightKg, input.heightCm);
  if (b != null && (b >= 40 || (b >= 35 && input.a1c != null && input.a1c >= 8))) {
    out.push({
      severity: "info",
      title: "Weight-management referral",
      detail: `BMI ${b} — refer a weight centre if BMI ≥40, or ≥35 with poor control. Nutrition referral for all diabetes.`,
      citation: "JAMA 2023 / ADA",
    });
  }
  return out;
}

function therapyItems(input: CdsInput, insulin: InsulinPlan): PlanItem[] {
  const items: PlanItem[] = [];
  const cls = classifyGlycemia(input);
  const b = bmi(input.weightKg, input.heightCm);
  const age = ageYears(input.dob, input.now);
  const onMet = hasMed(input.meds, "metformin");
  const egfr = input.egfr;

  items.push({
    id: "lifestyle",
    priority: "now",
    title: "Lifestyle — most effective foundation",
    detail:
      "Individualised nutrition (plate method, consistent carbohydrate), 150 min/week moderate activity, sleep, and alcohol counselling. Nutrition referral for every person with diabetes.",
    citation: "Diab Care 2026;49:S35 / JAMA 2023",
  });

  if (cls === "prediabetes") {
    const metCandidate =
      (b != null && b >= 35) || age < 60 || input.riskFactors.includes("gdm-hx");
    items.push({
      id: "pre-met",
      priority: metCandidate ? "start" : "educate",
      title: metCandidate
        ? "Metformin is indicated for prediabetes"
        : "Metformin optional",
      detail: metCandidate
        ? "Lifestyle first. Metformin is particularly effective if BMI ≥35, age <60, or history of GDM."
        : "Lifestyle is most effective. Metformin can be considered.",
      citation: "Cochrane Rev 2019 / Diab Care 2026;49:S35",
      localNote: "Metformin 500 mg daily → 500–1000 mg BID as tolerated, if eGFR ≥45 (use caution 30–44; stop <30).",
    });
    return items;
  }

  if (cls === "normal") {
    items.push({
      id: "screen-ls",
      priority: "educate",
      title: "Risk-factor counselling",
      detail:
        "Weight, activity, and diet. Repeat screening on the interval in the review plan. Screen before starting or switching HIV ART.",
    });
    return items;
  }

  // diabetes
  if (egfr != null && egfr < 30 && onMet) {
    items.push({
      id: "stop-met",
      priority: "now",
      title: "Stop metformin — eGFR <30",
      detail: "Metformin is contraindicated below eGFR 30. Review all renally cleared drugs.",
    });
  } else if (!onMet && (egfr == null || egfr >= 30)) {
    items.push({
      id: "met",
      priority: "start",
      title: "Metformin first-line (unless contraindicated)",
      detail:
        "Start 500 mg daily or BID with food; titrate to 1000 mg BID as tolerated. Recheck eGFR. B12 annually.",
      localNote: "Always available on the MRRH / NMS list.",
    });
  } else if (onMet) {
    items.push({
      id: "met-cont",
      priority: "continue",
      title: "Continue metformin",
      detail: "Foundation therapy. Confirm adherence and GI tolerance. B12 yearly.",
    });
  }

  const target = a1cTarget(input);
  const above = input.a1c != null && input.a1c >= target.numeric;
  const ascvd =
    input.conditions.includes("cvd") ||
    input.conditions.includes("hf") ||
    input.conditions.includes("ckd") ||
    input.conditions.includes("esrd");

  if (above && ascvd) {
    items.push({
      id: "sglt-glp",
      priority: "start",
      title: "Organ-protection therapy",
      detail:
        "With ASCVD, heart failure, or CKD, prefer an SGLT2 inhibitor and/or GLP-1 RA independent of A1c when available — cardiorenal benefit.",
      localNote:
        "Empagliflozin / dapagliflozin and GLP-1 RAs are usually private-purchase in Mbarara. If the patient cannot afford them, intensify metformin + SU carefully, then insulin, and do not delay ACEI/statin/BP control.",
    });
  }

  if (insulin.indicated && insulin.kind === "basal") {
    items.push({
      id: "ins-start",
      priority: "now",
      title: `Start basal insulin  ${insulin.startRange ?? ""}`.trim(),
      detail: `${insulin.reason} Suggested start ${insulin.startRange}${insulin.startMidU != null ? ` (midpoint ~${insulin.startMidU} U)` : ""}. ${insulin.titration}`,
      citation: "Diab Care 2026;49:S183–215",
      localNote: insulin.localNote,
    });
  } else if (insulin.kind === "titrate-basal") {
    items.push({
      id: "ins-tit",
      priority: "continue",
      title: "Titrate basal insulin",
      detail: `${insulin.reason} ${insulin.titration} ${insulin.hypoHold}`,
      citation: "Diab Care 2026;49:S183–215",
    });
  } else if (insulin.kind === "prandial") {
    items.push({
      id: "ins-prand",
      priority: "start",
      title: "Escalate beyond basal",
      detail: `${insulin.reason} Starting prandial options: ${insulin.startRange}. ${insulin.titration}`,
      citation: "Diab Care 2026;49:S183–215",
      localNote: insulin.localNote,
    });
  } else if (above && !hasMed(input.meds, "su") && oralCount(input.meds) < 2) {
    items.push({
      id: "su",
      priority: "start",
      title: "Add a second oral agent",
      detail:
        "If A1c remains above target on metformin, add a second agent. A sulfonylurea (gliclazide preferred over glibenclamide in older or CKD patients) is the usual public-sector choice.",
      localNote: "Glibenclamide and gliclazide are on the NMS list. Watch for hypoglycaemia; skip a dose if a meal is missed.",
    });
  }

  if (insulin.syringe) {
    items.push({
      id: "supplies",
      priority: "educate",
      title: "Insulin supplies",
      detail: `${insulin.syringe} Prefer 32G 4 mm pen needles (less pain); larger patients or high doses may need a longer needle. Alcohol swabs, or wash with soap and water. Glucometer + strips; consider CGM if obtainable. Teach injection sites and lipodystrophy checks.`,
      citation: "MGH pocket card — insulin supplies",
      localNote:
        "Write diagnosis on the DME / supplies request. Public-sector strips are often intermittent — give a paper log and a realistic testing plan (fasting + 1–2 post-meal checks per week if strips are scarce).",
    });
  }

  return items;
}

function comorbidityItems(input: CdsInput): PlanItem[] {
  const items: PlanItem[] = [];
  const age = ageYears(input.dob, input.now);
  const diabetic =
    classifyGlycemia(input) === "diabetes" ||
    classifyGlycemia(input) === "unconfirmed-diabetes" ||
    input.diagnosis === "t1dm" ||
    input.diagnosis === "t2dm";
  if (!diabetic && classifyGlycemia(input) !== "prediabetes") return items;

  const bpHigh =
    (input.sbp != null && input.sbp >= 130) ||
    (input.dbp != null && input.dbp >= 80);
  const onAce = hasMed(input.meds, "acei") || hasMed(input.meds, "arb");
  const protein = input.acr != null && input.acr >= 30;
  const lowGfr = input.egfr != null && input.egfr < 60;

  if (bpHigh) {
    items.push({
      id: "bp",
      priority: onAce ? "continue" : "start",
      title: onAce
        ? "Intensify BP therapy — goal <130/80"
        : "Start ACE inhibitor or ARB — goal <130/80",
      detail:
        "First-line ACEI/ARB. Can target <120/80 if multiple CV risk factors and it can be attained safely. Recheck electrolytes and creatinine 1–2 weeks after starting ACEI/ARB.",
      citation: "Diab Care 2026;49:S61–88",
      localNote: "Enalapril 5–20 mg daily is the usual MRRH ACEI.",
    });
  } else if (input.sbp != null) {
    items.push({
      id: "bp-ok",
      priority: "continue",
      title: "Blood pressure at goal",
      detail: `Current ${input.sbp}/${input.dbp} — continue; goal <130/80.`,
    });
  }

  if ((protein || lowGfr) && !onAce && (input.sbp == null || bpHigh || protein)) {
    items.push({
      id: "ace-kidney",
      priority: "start",
      title: "ACEI/ARB for kidney protection",
      detail:
        "Indicated if hypertensive with proteinuria or eGFR <60, even when the primary issue is renal rather than BP.",
      citation: "Diab Care 2026;49:S61–88",
    });
  }

  if (input.egfr != null && input.egfr < 30) {
    items.push({
      id: "renal-ref",
      priority: "refer",
      title: "Refer nephrology (eGFR <30)",
      detail: `eGFR ${input.egfr} mL/min. Renal clinic; anaemia, bone mineral, and dialysis planning as indicated.`,
    });
  }

  const onStatin = hasMed(input.meds, "statin");
  const clinicalAscvd = input.conditions.includes("cvd");
  const extraRf =
    input.conditions.includes("ckd") ||
    input.riskFactors.includes("htn") ||
    input.smoking ||
    (input.ldl != null && input.ldl >= 100);
  if (diabetic && age >= 40 && age <= 75) {
    items.push({
      id: "statin",
      priority: onStatin ? "continue" : "start",
      title: clinicalAscvd
        ? "High-intensity statin — LDL-C <55 (clinical ASCVD)"
        : extraRf
          ? "High-intensity statin — LDL-C <70 (≥1 ASCVD risk factor)"
          : "Moderate-intensity statin for all diabetes age 40–75",
      detail: clinicalAscvd
        ? "Clinical ASCVD (ACS, TIA/stroke, etc.): high-intensity statin plus additional agents as needed for LDL-C <55."
        : extraRf
          ? "At least one ASCVD risk factor: high-intensity statin, target LDL-C <70."
          : "Moderate-intensity statin regardless of the lipid panel. Atorvastatin 20 mg is a typical moderate dose; 40–80 mg is high-intensity.",
      citation: "Diab Care 2026;49:S61–88",
      localNote: "Atorvastatin is the usual available statin. Give in the evening if simvastatin; atorvastatin any time.",
    });
  } else if (diabetic && age >= 20 && age < 40 && extraRf && !onStatin) {
    items.push({
      id: "statin-young",
      priority: "start",
      title: "Consider statin (age 20–39 with extra risk)",
      detail: "Additional cardiovascular risk factors present — discuss moderate-intensity statin.",
    });
  }

  if (input.smoking) {
    items.push({
      id: "smoke",
      priority: "now",
      title: "Tobacco cessation",
      detail: "Brief 5A counselling every visit. Refer cessation support if available.",
    });
  }
  if (input.alcohol) {
    items.push({
      id: "etoh",
      priority: "educate",
      title: "Alcohol — hypoglycaemia risk",
      detail: "Counsel: never drink on an empty stomach if on insulin or sulfonylurea; review quantity.",
    });
  }

  const b = bmi(input.weightKg, input.heightCm);
  if (b != null && b >= 25) {
    items.push({
      id: "wt",
      priority: b >= 35 ? "refer" : "educate",
      title:
        b >= 40 || (b >= 35 && input.a1c != null && input.a1c >= 8)
          ? `BMI ${b} — weight-centre referral`
          : `BMI ${b} — nutrition and activity`,
      detail:
        "Nutrition referral for all. Weight centre if BMI ≥40, or ≥35 with poor glycaemic control.",
      citation: "JAMA 2023",
    });
  }

  return items;
}

function screeningItems(input: CdsInput): PlanItem[] {
  return hcmItems(input)
    .filter((h) => h.due)
    .map((h) => ({
      id: `hcm-${h.id}`,
      priority: (h.id === "foot" ? "now" : "screen") as PlanItem["priority"],
      title: `${h.label} due`,
      detail: h.action,
    }));
}

function educationItems(input: CdsInput, insulin: InsulinPlan): PlanItem[] {
  const items: PlanItem[] = [
    {
      id: "sme",
      priority: "educate",
      title: "Sick-day and clinic-return rules",
      detail:
        "Return earlier for vomiting, fever, drowsiness, pregnancy, or glucose persistently >250 or <70. Carry a clinic book. Bring the glucose log to every visit.",
    },
    {
      id: "targets",
      priority: "educate",
      title: "Home glucose targets",
      detail:
        "AM fasting 80–130 mg/dL (4.4–7.2 mmol/L). 1–2 h post-meal <180 mg/dL (10 mmol/L). Review hypoglycaemia frequency, causes, and timing every visit.",
      citation: "Diab Care 2026;49:S61–88",
    },
  ];
  if (insulin.indicated) {
    items.push({
      id: "edu-ins",
      priority: "now",
      title: "Diabetes education — insulin technique",
      detail:
        "Able to self-monitor? Teach pen/syringe, site rotation, recognition of hypo, and a written titration plan. Refer the diabetes educator / senior nurse.",
    });
  }
  if (input.diagnosis === "t1dm") {
    items.push({
      id: "t1-screen",
      priority: "screen",
      title: "T1DM associated autoimmunity",
      detail: "TSH at diagnosis and yearly. Screen coeliac at diagnosis and if symptoms develop.",
      citation: "Diab Care 2026;49:S63",
    });
  }
  return items;
}

function checklist(input: CdsInput): ChecklistItem[] {
  const diabetic =
    input.diagnosis === "t1dm" ||
    input.diagnosis === "t2dm" ||
    classifyGlycemia(input) === "diabetes" ||
    classifyGlycemia(input) === "unconfirmed-diabetes";
  const items: ChecklistItem[] = [
    { id: "wt", label: "Weight, BMI, waist if possible", station: "nursing" },
    { id: "bp", label: "Blood pressure (goal <130/80)", station: "nursing" },
    { id: "log", label: "Review glucose log / hypo events", station: "nursing" },
    { id: "meds", label: "Medication-taking behaviour", station: "nursing" },
    { id: "tox", label: "Tobacco, alcohol, substances", station: "nursing" },
  ];
  if (diabetic) {
    items.push({
      id: "foot",
      label: "Foot exam (skin, joints, pulses, sensation)",
      station: "nursing",
    });
    items.push({
      id: "skin",
      label: "Skin / injection sites / acanthosis",
      station: "nursing",
    });
  }
  const h = hcmItems(input);
  if (h.find((x) => x.id === "a1c")?.due) {
    items.push({ id: "a1c", label: "A1c (or plasma glucose if A1c unreliable)", station: "lab" });
  }
  if (h.find((x) => x.id === "acr")?.due) {
    items.push({ id: "acr", label: "Urine ACR + creatinine / eGFR", station: "lab" });
  }
  if (h.find((x) => x.id === "lipids")?.due) {
    items.push({ id: "lip", label: "Lipid panel", station: "lab" });
  }
  if (h.find((x) => x.id === "eye")?.due) {
    items.push({ id: "eye", label: "Book retinal screen / ophthalmology", station: "clinician" });
  }
  items.push({ id: "plan", label: "Agree plan and write next review in the book", station: "clinician" });
  items.push({ id: "rx", label: "Medicines, syringes, strips", station: "pharmacy" });
  return items;
}

function diagnosisLine(input: CdsInput, cls: GlycemicClass) {
  const age = ageYears(input.dob, input.now);
  const bits: string[] = [];
  if (input.diagnosis === "t1dm") bits.push("Type 1 diabetes");
  else if (input.diagnosis === "t2dm") bits.push("Type 2 diabetes");
  else if (input.diagnosis === "gdm") bits.push("Gestational diabetes");
  else if (cls === "prediabetes") bits.push("Prediabetes");
  else if (cls === "unconfirmed-diabetes") bits.push("Possible new diabetes — confirm");
  else if (cls === "diabetes") bits.push("Diabetes (lab criteria)");
  else bits.push("No diabetes on current labs");
  if (input.diagnosisYear) bits.push(`since ${input.diagnosisYear}`);
  bits.push(`${age}${input.sex}`);
  const b = bmi(input.weightKg, input.heightCm);
  if (b) bits.push(`BMI ${b}`);
  if (input.a1c != null) bits.push(`A1c ${input.a1c.toFixed(1)}%`);
  if (input.fpg != null) bits.push(`FPG ${input.fpg}`);
  return bits.join(" · ");
}

function summaryText(input: CdsInput, plan: Omit<CarePlan, "summary">): string {
  const lines = [
    plan.diagnosisLine,
    `Glycaemic target A1c ${plan.a1cTarget.display} (${plan.a1cTarget.rationale})`,
    `Home glucose: ${plan.glucoseTargets}`,
    `Next review: ${plan.review.label} (${format(addDays(input.now, plan.review.days), "d MMM yyyy")}). ${plan.review.reasons[0] ?? ""}`,
  ];
  const nowItems = [...plan.therapy, ...plan.comorbidities].filter(
    (i) => i.priority === "now" || i.priority === "start" || i.priority === "refer",
  );
  if (nowItems.length) {
    lines.push("Today: " + nowItems.map((i) => i.title).join("; ") + ".");
  }
  const due = plan.hcm.filter((h) => h.due).map((h) => h.label);
  if (due.length) lines.push("Due now: " + due.join(", ") + ".");
  return lines.join("\n");
}

export function buildCarePlan(input: CdsInput): CarePlan {
  const glycemicClass = classifyGlycemia(input);
  const target = a1cTarget(input);
  const insulin = insulinPlan(input);
  const review = suggestReview(input);
  const hcm = hcmItems(input);
  const base = {
    glycemicClass,
    diagnosisLine: diagnosisLine(input, glycemicClass),
    a1cTarget: target,
    glucoseTargets: "AM FPG 80–130 · 1–2 h post-meal <180 · watch hypoglycaemia",
    review,
    alerts: alerts(input, insulin),
    todayChecklist: checklist(input),
    therapy: therapyItems(input, insulin),
    comorbidities: comorbidityItems(input),
    screening: screeningItems(input),
    education: educationItems(input, insulin),
    hcm,
    insulin,
  };
  return { ...base, summary: summaryText(input, base) };
}

export function planToPlainText(
  patientName: string,
  mrn: string,
  plan: CarePlan,
  clinician: string,
  visitDate: string,
) {
  const pri = (p: PlanItem["priority"]) =>
    ({
      now: "NOW",
      start: "START",
      continue: "CONTINUE",
      refer: "REFER",
      screen: "SCREEN",
      educate: "EDUCATE",
    })[p];

  const block = (title: string, items: PlanItem[]) => {
    if (!items.length) return "";
    return (
      `\n${title}\n` +
      items
        .map(
          (i) =>
            `  [${pri(i.priority)}] ${i.title}\n      ${i.detail}${i.localNote ? `\n      MRRH: ${i.localNote}` : ""}`,
        )
        .join("\n")
    );
  };

  return [
    "MBARARA REGIONAL REFERRAL HOSPITAL",
    "Diabetes & Endocrine Clinic  —  DiabCare care plan",
    "────────────────────────────────────────",
    `Patient: ${patientName}     MRN: ${mrn}`,
    `Visit: ${visitDate}     Clinician: ${clinician}`,
    plan.diagnosisLine,
    `A1c target: ${plan.a1cTarget.display}  —  ${plan.a1cTarget.rationale}`,
    `Glucose targets: ${plan.glucoseTargets}`,
    `NEXT REVIEW: ${plan.review.label.toUpperCase()}  (${plan.review.date})  [${plan.review.urgency}]`,
    ...plan.review.reasons.map((r) => `  • ${r}`),
    plan.alerts.length
      ? "\nALERTS\n" + plan.alerts.map((a) => `  [${a.severity}] ${a.title}: ${a.detail}`).join("\n")
      : "",
    block("GLYCAEMIC THERAPY", plan.therapy),
    block("BP / LIPIDS / KIDNEY / WEIGHT", plan.comorbidities),
    block("SCREENING DUE", plan.screening),
    block("EDUCATION", plan.education),
    "\nTODAY'S CLINIC CHECKLIST",
    ...plan.todayChecklist.map((c) => `  [ ] ${c.label}  (${c.station})`),
    "\nDecision support from ADA Standards of Care 2025–2026 (MGH pocket card).",
    "Confirm against clinical judgement and local stock. Not a prescription.",
  ]
    .filter((l) => l !== "")
    .join("\n");
}

export const RISK_LABELS: Record<Patient["riskFactors"][number], string> = {
  "family-t2dm": "1st-degree relative with T2DM",
  cvd: "History of CVD",
  htn: "Hypertension",
  "low-hdl": "HDL <35",
  "high-tg": "Triglycerides >250",
  pcos: "PCOS",
  sedentary: "Sedentary lifestyle",
  acanthosis: "Acanthosis nigricans",
  masld: "MASLD",
  "gdm-hx": "History of GDM",
  pancreatitis: "Pancreatitis",
  hiv: "HIV (screen around ART)",
  "weight-gain": "Weight gain",
  "asian-bmi-threshold": "Asian BMI threshold (≥23)",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  ckd: "CKD",
  esrd: "ESRD",
  cvd: "Clinical ASCVD",
  hf: "Heart failure",
  pvd: "Peripheral vascular disease",
  neuropathy: "Neuropathy",
  retinopathy: "Retinopathy",
  masld: "MASLD",
  "sickle-cell": "Sickle cell disease",
  anemia: "Anaemia",
  hiv: "HIV",
  pregnancy: "Pregnancy",
};

export const MED_CATALOGUE: { name: string; cls: Medication["cls"]; typical: string }[] = [
  { name: "Metformin", cls: "metformin", typical: "500–1000 mg BID" },
  { name: "Glibenclamide", cls: "su", typical: "5 mg daily" },
  { name: "Gliclazide", cls: "su", typical: "80 mg daily" },
  { name: "Glimepiride", cls: "su", typical: "2 mg daily" },
  { name: "NPH insulin", cls: "insulin-basal", typical: "U at bedtime" },
  { name: "Insulin glargine", cls: "insulin-basal", typical: "U daily" },
  { name: "Insulin 70/30", cls: "insulin-mixed", typical: "U BID" },
  { name: "Regular insulin", cls: "insulin-prandial", typical: "U before meals" },
  { name: "Enalapril", cls: "acei", typical: "10 mg daily" },
  { name: "Lisinopril", cls: "acei", typical: "10 mg daily" },
  { name: "Losartan", cls: "arb", typical: "50 mg daily" },
  { name: "Atorvastatin", cls: "statin", typical: "20 mg daily" },
  { name: "Empagliflozin", cls: "sglt2", typical: "10 mg daily" },
  { name: "Dapagliflozin", cls: "sglt2", typical: "10 mg daily" },
  { name: "Semaglutide", cls: "glp1", typical: "weekly" },
  { name: "Sitagliptin", cls: "dpp4", typical: "100 mg daily" },
  { name: "Amlodipine", cls: "other", typical: "5 mg daily" },
  { name: "Aspirin", cls: "other", typical: "75 mg daily" },
];
