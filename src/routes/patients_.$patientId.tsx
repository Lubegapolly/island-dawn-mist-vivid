import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarPlus,
  ClipboardList,
  Phone,
  Stethoscope,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanPanel } from "@/components/clinic/plan-panel";
import { buildCarePlan, CONDITION_LABELS, patientToInput } from "@/lib/cds";
import {
  ageSex,
  bmi,
  bmiLabel,
  diagnosisLabel,
  formatDate,
  fullName,
  phoneHref,
  todayIso,
} from "@/lib/format";
import { useClinicStore, usePatient, useVisits } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patients_/$patientId")({
  component: PatientChart,
});

function PatientChart() {
  const { patientId } = Route.useParams();
  const patient = usePatient(patientId);
  const visits = useVisits(patientId);
  const addToToday = useClinicStore((s) => s.addToToday);

  if (!patient) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-display text-2xl">Patient not found</p>
        <Button asChild className="mt-4">
          <Link to="/patients">Back to registry</Link>
        </Button>
      </div>
    );
  }

  const now = new Date();
  const plan = buildCarePlan(patientToInput(patient, now));
  const overdue = patient.nextReview < todayIso(now);
  const b = bmi(patient.weightKg, patient.heightCm);
  const chart = visits
    .filter((v) => v.a1c != null)
    .slice()
    .reverse()
    .map((v) => ({ date: formatDate(v.date), a1c: v.a1c }));
  if (patient.labs.a1c != null && (chart.length === 0 || chart[chart.length - 1]?.a1c !== patient.labs.a1c)) {
    chart.push({ date: formatDate(patient.labs.a1cDate) ?? "Now", a1c: patient.labs.a1c });
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs text-muted">{patient.mrn}</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
            {fullName(patient)}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {ageSex(patient)} · {patient.village}, {patient.district}
            {patient.diagnosisYear ? ` · dx ${patient.diagnosisYear}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="primary">{diagnosisLabel(patient.diagnosis)}</Badge>
            {overdue ? (
              <Badge tone="warning">Review overdue {formatDate(patient.nextReview)}</Badge>
            ) : (
              <Badge tone="success">Review {formatDate(patient.nextReview)}</Badge>
            )}
            {patient.queue?.date === todayIso() && (
              <Badge tone="info">On board · {patient.queue.stage}</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {patient.phone && (
            <Button asChild variant="secondary">
              <a href={phoneHref(patient.phone)}>
                <Phone className="size-4" />
                Call
              </a>
            </Button>
          )}
          {patient.queue?.date !== todayIso() && (
            <Button variant="secondary" onClick={() => addToToday(patient.id)}>
              <CalendarPlus className="size-4" />
              Check in today
            </Button>
          )}
          <Button asChild>
            <Link to="/patients/$patientId/visit" params={{ patientId: patient.id }}>
              <Stethoscope className="size-4" />
              New visit
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="A1c"
          value={patient.labs.a1c != null ? `${patient.labs.a1c.toFixed(1)}%` : "—"}
          hint={formatDate(patient.labs.a1cDate, "No recent A1c")}
          hot={patient.labs.a1c != null && patient.labs.a1c >= 9}
        />
        <Metric
          label="FPG"
          value={patient.labs.fpg != null ? String(patient.labs.fpg) : "—"}
          hint="mg/dL · goal 80–130"
        />
        <Metric
          label="BMI"
          value={b != null ? String(b) : "—"}
          hint={bmiLabel(b)}
        />
        <Metric
          label="eGFR"
          value={patient.labs.egfr != null ? String(patient.labs.egfr) : "—"}
          hint={patient.labs.acr != null ? `ACR ${patient.labs.acr}` : "mL/min"}
          hot={patient.labs.egfr != null && patient.labs.egfr < 30}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">A1c trend</p>
            {chart.length < 2 ? (
              <p className="mt-6 mb-2 text-sm text-muted">
                Need two A1c values to draw a trend. Record a visit to start the chart.
              </p>
            ) : (
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-muted)" />
                    <YAxis domain={[5, "auto"]} tick={{ fontSize: 11 }} stroke="var(--color-muted)" width={32} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="a1c"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Current medicines
            </p>
            {patient.currentMeds.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No medicines recorded.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {patient.currentMeds.map((m) => (
                  <li key={m.name} className="flex justify-between gap-3 py-2 text-sm">
                    <span>{m.name}</span>
                    <span className="text-ink-soft">{m.dose}</span>
                  </li>
                ))}
              </ul>
            )}
            {patient.conditions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {patient.conditions.map((c) => (
                  <Badge key={c}>{CONDITION_LABELS[c]}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Healthcare maintenance
            </p>
            <ul className="mt-3 divide-y divide-line">
              {plan.hcm.map((h) => (
                <li key={h.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{h.label}</p>
                    <p className="text-xs text-muted">{h.interval}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone={h.due ? "warning" : "success"}>{h.due ? "Due" : "Current"}</Badge>
                    <p className="mt-1 text-xs text-muted">
                      {h.last ? `Last ${formatDate(h.last)}` : "Never recorded"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Visit history
            </p>
            {visits.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No visits yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {visits.map((v) => (
                  <li key={v.id} className="rounded-[var(--radius-md)] bg-bg px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{formatDate(v.date)}</p>
                      <p className="text-xs text-muted">{v.clinician}</p>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{v.planSummary}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted">
                      {v.a1c != null ? `A1c ${v.a1c}%` : ""}
                      {v.fpg != null ? ` · FPG ${v.fpg}` : ""}
                      {` · next ${formatDate(v.nextReview)}`}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-ink-soft">
            <ClipboardList className="size-4" />
            <p className="text-xs font-medium uppercase tracking-[0.14em]">
              Live plan from latest data
            </p>
          </div>
          <PlanPanel
            plan={plan}
            patientName={fullName(patient)}
            mrn={patient.mrn}
            clinician="Chart view"
            visitDate={todayIso()}
            compact
          />
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  hot,
}: {
  label: string;
  value: string;
  hint: string;
  hot?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl tabular-nums leading-none",
          hot && "text-danger",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}
