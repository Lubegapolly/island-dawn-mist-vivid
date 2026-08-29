import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PlanPanel } from "@/components/clinic/plan-panel";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import {
  CONDITION_LABELS,
  MED_CATALOGUE,
  buildCarePlan,
  draftToInput,
} from "@/lib/cds";
import { bmi, fullName, todayIso } from "@/lib/format";
import { useClinicStore, usePatient } from "@/lib/store";
import type {
  Condition,
  Diagnosis,
  ExamResult,
  Hypoglycemia,
  Medication,
  Visit,
  VisitDraft,
} from "@/lib/types";
import { CLINICIANS } from "@/lib/types";

export const Route = createFileRoute("/patients_/$patientId_/visit")({
  component: VisitPage,
});

function VisitPage() {
  const { patientId } = Route.useParams();
  const patient = usePatient(patientId);
  const addVisit = useClinicStore((s) => s.addVisit);
  const navigate = useNavigate();

  const [draft, setDraft] = useState<VisitDraft | null>(null);

  const initial = useMemo(() => {
    if (!patient) return null;
    return patientToDraft(patient);
  }, [patient]);

  const live = draft ?? initial;

  if (!patient || !live) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-display text-2xl">Patient not found</p>
        <Button asChild className="mt-4">
          <Link to="/patients">Back to registry</Link>
        </Button>
      </div>
    );
  }

  const set = <K extends keyof VisitDraft>(key: K, value: VisitDraft[K]) =>
    setDraft({ ...(draft ?? live), [key]: value });

  const now = new Date();
  const plan = buildCarePlan(draftToInput(patient, live, now));
  const b = bmi(Number(live.weightKg) || undefined, Number(live.heightCm) || undefined);

  const save = () => {
    const visit: Visit = {
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
      alerts: plan.alerts.map((a) => a.title),
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
        alt: visit.alt ?? patient.labs.alt,
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
        hbvImmune: live.hbvImmune ?? patient.hcm.hbvImmune,
      },
      queue: {
        date: todayIso(),
        stage: "pharmacy",
        timeSlot: patient.queue?.timeSlot,
        checkInAt: patient.queue?.checkInAt,
      },
    });
    toast.success(`Visit saved · review ${plan.review.label} (${plan.review.date})`);
    void navigate({ to: "/patients/$patientId", params: { patientId: patient.id } });
  };

  const toggleMed = (item: (typeof MED_CATALOGUE)[number]) => {
    const exists = live.meds.some((m) => m.name === item.name);
    set(
      "meds",
      exists
        ? live.meds.filter((m) => m.name !== item.name)
        : [...live.meds, { name: item.name, dose: item.typical, cls: item.cls }],
    );
  };

  const setDose = (name: string, dose: string) =>
    set(
      "meds",
      live.meds.map((m) => (m.name === name ? { ...m, dose } : m)),
    );

  const toggleCond = (c: Condition) =>
    set(
      "conditions",
      live.conditions.includes(c)
        ? live.conditions.filter((x) => x !== c)
        : [...live.conditions, c],
    );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Encounter</p>
      <h1 className="mt-1 font-display text-3xl tracking-tight">{fullName(patient)}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {patient.mrn} · Enter today’s findings — the plan on the right updates as you type.
      </p>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <Card title="Visit">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <Input type="date" value={live.date} onChange={(e) => set("date", e.target.value)} />
              </Field>
              <Field label="Clinician">
                <NativeSelect
                  value={live.clinician}
                  onChange={(e) => set("clinician", e.target.value)}
                >
                  {CLINICIANS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Working diagnosis">
                <NativeSelect
                  value={live.diagnosis}
                  onChange={(e) => set("diagnosis", e.target.value as Diagnosis)}
                >
                  <option value="t2dm">Type 2 diabetes</option>
                  <option value="t1dm">Type 1 diabetes</option>
                  <option value="prediabetes">Prediabetes</option>
                  <option value="gdm">Gestational diabetes</option>
                  <option value="screening">Screening / at risk</option>
                </NativeSelect>
              </Field>
            </div>
          </Card>

          <Card title="Vitals">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="Weight kg">
                <Input
                  inputMode="decimal"
                  value={live.weightKg}
                  onChange={(e) => set("weightKg", e.target.value)}
                />
              </Field>
              <Field label="Height cm">
                <Input
                  inputMode="decimal"
                  value={live.heightCm}
                  onChange={(e) => set("heightCm", e.target.value)}
                />
              </Field>
              <Field label="SBP">
                <Input
                  inputMode="numeric"
                  value={live.sbp}
                  onChange={(e) => set("sbp", e.target.value)}
                />
              </Field>
              <Field label="DBP">
                <Input
                  inputMode="numeric"
                  value={live.dbp}
                  onChange={(e) => set("dbp", e.target.value)}
                />
              </Field>
            </div>
            {b != null && <p className="mt-3 text-sm text-ink-soft">BMI {b}</p>}
          </Card>

          <Card title="Glucose">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="A1c %">
                <Input
                  inputMode="decimal"
                  value={live.a1c}
                  onChange={(e) => set("a1c", e.target.value)}
                />
              </Field>
              <Field label="FPG mg/dL">
                <Input
                  inputMode="numeric"
                  value={live.fpg}
                  onChange={(e) => set("fpg", e.target.value)}
                />
              </Field>
              <Field label="Post-meal">
                <Input
                  inputMode="numeric"
                  value={live.ppg}
                  onChange={(e) => set("ppg", e.target.value)}
                />
              </Field>
              <Field label="Random BG">
                <Input
                  inputMode="numeric"
                  value={live.randomBg}
                  onChange={(e) => set("randomBg", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Hypoglycaemia">
                <NativeSelect
                  value={live.hypoglycemia}
                  onChange={(e) => set("hypoglycemia", e.target.value as Hypoglycemia)}
                >
                  <option value="none">None</option>
                  <option value="mild">Mild / infrequent</option>
                  <option value="frequent">Frequent</option>
                  <option value="severe">Severe</option>
                </NativeSelect>
              </Field>
              <Field label="Foot exam">
                <NativeSelect
                  value={live.footExam}
                  onChange={(e) => set("footExam", e.target.value as ExamResult)}
                >
                  <option value="deferred">Deferred</option>
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </NativeSelect>
              </Field>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Check
                label="Osmotic symptoms (thirst, polyuria, weight loss)"
                checked={live.symptomaticHyper}
                onChange={(v) => set("symptomaticHyper", v)}
              />
              <Check
                label="Treatment changed today or recently"
                checked={live.treatmentChanged}
                onChange={(v) => set("treatmentChanged", v)}
              />
              <Check
                label="Change in health status"
                checked={live.healthStatusChange}
                onChange={(v) => set("healthStatusChange", v)}
              />
              <Check
                label="Insulin started today"
                checked={live.insulinStartedToday}
                onChange={(v) => set("insulinStartedToday", v)}
              />
              <Check
                label="Tobacco use"
                checked={live.smoking}
                onChange={(v) => set("smoking", v)}
              />
              <Check
                label="Alcohol use"
                checked={live.alcohol}
                onChange={(v) => set("alcohol", v)}
              />
              <Check
                label="High hypoglycaemia risk / frailty"
                checked={live.highHypoRisk}
                onChange={(v) => set("highHypoRisk", v)}
              />
              <Check
                label="Life expectancy ≤10 years"
                checked={live.limitedLifeExpectancy}
                onChange={(v) => set("limitedLifeExpectancy", v)}
              />
            </div>
          </Card>

          <Card title="Labs (optional today)">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="LDL">
                <Input inputMode="decimal" value={live.ldl} onChange={(e) => set("ldl", e.target.value)} />
              </Field>
              <Field label="Urine ACR">
                <Input inputMode="decimal" value={live.acr} onChange={(e) => set("acr", e.target.value)} />
              </Field>
              <Field label="eGFR">
                <Input inputMode="numeric" value={live.egfr} onChange={(e) => set("egfr", e.target.value)} />
              </Field>
              <Field label="ALT">
                <Input inputMode="numeric" value={live.alt} onChange={(e) => set("alt", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Medicines">
            <div className="flex flex-wrap gap-2">
              {MED_CATALOGUE.map((item) => {
                const on = live.meds.some((m) => m.name === item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleMed(item)}
                    className={
                      on
                        ? "h-9 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg"
                        : "h-9 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-soft"
                    }
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
            {live.meds.length > 0 && (
              <ul className="mt-4 space-y-2">
                {live.meds.map((m: Medication) => (
                  <li key={m.name} className="grid grid-cols-[1fr_140px] items-center gap-2">
                    <span className="text-sm">{m.name}</span>
                    <Input
                      value={m.dose}
                      onChange={(e) => setDose(m.name, e.target.value)}
                      className="h-9"
                    />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Comorbidities">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => {
                const on = live.conditions.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCond(c)}
                    className={
                      on
                        ? "h-9 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg"
                        : "h-9 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-soft"
                    }
                  >
                    {CONDITION_LABELS[c]}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="Notes">
            <Textarea
              value={live.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Adherence, social context, sick-day plan…"
            />
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save visit and book review</Button>
            <Button type="button" variant="secondary" asChild>
              <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
                Cancel
              </Link>
            </Button>
          </div>
        </form>

        <aside className="xl:sticky xl:top-6 xl:self-start">
          <PlanPanel
            plan={plan}
            patientName={fullName(patient)}
            mrn={patient.mrn}
            clinician={live.clinician}
            visitDate={live.date}
          />
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

function n(v: string) {
  if (!v.trim()) return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function patientToDraft(patient: NonNullable<ReturnType<typeof usePatient>>): VisitDraft {
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
    hbvImmune: patient.hcm.hbvImmune,
  };
}
