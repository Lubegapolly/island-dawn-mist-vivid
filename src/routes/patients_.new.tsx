import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, NativeSelect } from "@/components/ui/input";
import { useClinicStore } from "@/lib/store";
import {
  CLINICIANS,
  DISTRICTS,
  type Diagnosis,
  type Patient,
  type RiskFactor,
  type Sex,
} from "@/lib/types";
import { RISK_LABELS, buildCarePlan, patientToInput } from "@/lib/cds";
import { todayIso } from "@/lib/format";

export const Route = createFileRoute("/patients_/new")({ component: NewPatient });

const RISKS = Object.keys(RISK_LABELS) as RiskFactor[];

function NewPatient() {
  const navigate = useNavigate();
  const upsert = useClinicStore((s) => s.upsertPatient);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState<Sex>("F");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("Mbarara");
  const [diagnosis, setDiagnosis] = useState<Diagnosis>("t2dm");
  const [diagnosisYear, setDiagnosisYear] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [risks, setRisks] = useState<RiskFactor[]>([]);
  const [checkIn, setCheckIn] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !dob) {
      toast.error("Name and date of birth are required");
      return;
    }
    const id = `pt_${Date.now().toString(36)}`;
    const seq = String(Math.floor(10000 + Math.random() * 89999));
    const now = new Date();
    const draft: Patient = {
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
      diagnosisYear: diagnosisYear ? Number(diagnosisYear) : undefined,
      riskFactors: risks,
      conditions: [],
      allergies: "None known",
      currentMeds: [],
      weightKg: weightKg ? Number(weightKg) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      nextReview: todayIso(now),
      labs: {},
      hcm: {},
      createdAt: todayIso(now),
      queue: checkIn
        ? { date: todayIso(now), stage: "waiting", checkInAt: now.toISOString() }
        : undefined,
    };
    const plan = buildCarePlan(patientToInput(draft, now));
    draft.nextReview = plan.review.date;
    upsert(draft);
    toast.success(`${draft.firstName} registered · next review ${plan.review.label}`);
    void navigate({ to: "/patients/$patientId/visit", params: { patientId: id } });
  };

  const toggleRisk = (r: RiskFactor) =>
    setRisks((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Registration</p>
      <h1 className="mt-1 font-display text-3xl tracking-tight">New patient</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Creates a clinic record on this device. Open a visit next to generate the care plan.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </Field>
            <Field label="Last name">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </Field>
            <Field label="Sex">
              <NativeSelect value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </NativeSelect>
            </Field>
            <Field label="Date of birth">
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </Field>
            <Field label="Phone">
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256 7xx xxx xxx"
              />
            </Field>
            <Field label="Village">
              <Input value={village} onChange={(e) => setVillage(e.target.value)} />
            </Field>
            <Field label="District">
              <NativeSelect value={district} onChange={(e) => setDistrict(e.target.value)}>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Working diagnosis">
              <NativeSelect
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value as Diagnosis)}
              >
                <option value="t2dm">Type 2 diabetes</option>
                <option value="t1dm">Type 1 diabetes</option>
                <option value="prediabetes">Prediabetes</option>
                <option value="gdm">Gestational diabetes</option>
                <option value="screening">Screening / at risk</option>
              </NativeSelect>
            </Field>
            <Field label="Year of diagnosis">
              <Input
                inputMode="numeric"
                value={diagnosisYear}
                onChange={(e) => setDiagnosisYear(e.target.value)}
                placeholder="e.g. 2019"
              />
            </Field>
            <Field label="Weight (kg)">
              <Input inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            </Field>
            <Field label="Height (cm)">
              <Input inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Screening risk factors
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {RISKS.map((r) => {
              const on = risks.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRisk(r)}
                  className={
                    on
                      ? "h-9 rounded-full bg-primary px-3 text-xs font-medium text-primary-fg"
                      : "h-9 rounded-full bg-surface-2 px-3 text-xs font-medium text-ink-soft"
                  }
                >
                  {RISK_LABELS[r]}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={checkIn}
            onChange={(e) => setCheckIn(e.target.checked)}
            className="size-4 accent-primary"
          />
          Check in to today’s clinic board
        </label>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save and open visit</Button>
          <Button type="button" variant="secondary" onClick={() => history.back()}>
            Cancel
          </Button>
        </div>
        <p className="text-xs text-muted">Clinician on duty: {CLINICIANS[0]}</p>
      </form>
    </div>
  );
}
