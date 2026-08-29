import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/input";
import { useClinicStore } from "@/lib/store";
import type { Diagnosis, Patient } from "@/lib/types";
import {
  ageSex,
  diagnosisShort,
  formatDate,
  fullName,
  initials,
  todayIso,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patients")({ component: PatientsPage });

const FILTERS: { id: "all" | Diagnosis | "overdue"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "t2dm", label: "T2DM" },
  { id: "t1dm", label: "T1DM" },
  { id: "prediabetes", label: "Pre-DM" },
  { id: "screening", label: "Screening" },
  { id: "overdue", label: "Overdue" },
];

function PatientsPage() {
  const patients = useClinicStore((s) => s.patients);
  const addToToday = useClinicStore((s) => s.addToToday);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const today = todayIso();

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return patients
      .filter((p) => {
        if (filter === "overdue") return p.nextReview < today;
        if (filter !== "all") return p.diagnosis === filter;
        return true;
      })
      .filter((p) => {
        if (!query) return true;
        const blob = `${p.firstName} ${p.lastName} ${p.mrn} ${p.phone} ${p.village} ${p.district}`.toLowerCase();
        return blob.includes(query);
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [patients, q, filter, today]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Registry</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Patients</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {patients.length} on this device · search by name, MRN, village or phone
          </p>
        </div>
        <Button asChild>
          <Link to="/patients/new">
            <Plus className="size-4" />
            New patient
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patients"
            className="pl-10"
          />
        </div>
        <NativeSelect
          className="sm:w-44"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          {FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-border)]">
        {list.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-muted">No matching patients.</p>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((p) => (
              <PatientRow key={p.id} patient={p} today={today} onCheckIn={() => addToToday(p.id)} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PatientRow({
  patient,
  today,
  onCheckIn,
}: {
  patient: Patient;
  today: string;
  onCheckIn: () => void;
}) {
  const overdue = patient.nextReview < today;
  const onBoard = patient.queue?.date === today;
  const a1c = patient.labs.a1c;
  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <Link
        to="/patients/$patientId"
        params={{ patientId: patient.id }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary-soft font-display text-sm text-primary">
          {initials(patient)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{fullName(patient)}</p>
          <p className="truncate font-mono text-[11px] text-muted">
            {patient.mrn} · {ageSex(patient)} · {patient.village}
          </p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Badge tone="primary">{diagnosisShort(patient.diagnosis)}</Badge>
        {a1c != null && (
          <Badge tone={a1c >= 9 ? "danger" : a1c >= 7 ? "warning" : "success"}>
            A1c {a1c.toFixed(1)}%
          </Badge>
        )}
        <span
          className={cn(
            "text-xs tabular-nums",
            overdue ? "font-medium text-warning" : "text-muted",
          )}
        >
          Review {formatDate(patient.nextReview)}
        </span>
        {onBoard ? (
          <Badge tone="info">{patient.queue?.stage}</Badge>
        ) : (
          <Button size="sm" variant="outline" onClick={onCheckIn}>
            Check in
          </Button>
        )}
      </div>
    </li>
  );
}
