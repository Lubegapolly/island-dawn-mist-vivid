import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  ChevronRight,
  ClipboardPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/store";
import { QUEUE_STAGES, type Patient, type QueueStage } from "@/lib/types";
import { ageSex, diagnosisShort, fullName, initials, todayIso } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: TodayClinic });

function TodayClinic() {
  const patients = useClinicStore((s) => s.patients);
  const setQueue = useClinicStore((s) => s.setQueue);
  const today = todayIso();
  const onBoard = patients.filter((p) => p.queue?.date === today);
  const overdue = patients.filter((p) => p.nextReview < today);
  const highRisk = onBoard.filter(
    (p) => (p.labs.a1c != null && p.labs.a1c >= 9) || (p.labs.fpg != null && p.labs.fpg >= 250),
  );
  const waiting = onBoard.filter((p) => p.queue?.stage === "waiting").length;
  const done = onBoard.filter((p) => p.queue?.stage === "done").length;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Outpatient session
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
            Today’s clinic
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {format(new Date(), "EEEE d MMMM yyyy")} · Internal Medicine · Diabetes & Endocrine
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link to="/reviews">
              <CalendarClock className="size-4" />
              Recall list
            </Link>
          </Button>
          <Button asChild>
            <Link to="/patients/new">
              <ClipboardPlus className="size-4" />
              Register patient
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="On the board" value={onBoard.length} hint={`${done} discharged`} />
        <Stat label="Waiting" value={waiting} hint="Ready for consult" />
        <Stat
          label="Overdue reviews"
          value={overdue.length}
          hint="Need recall"
          tone={overdue.length ? "warning" : "ok"}
        />
        <Stat
          label="High glucose today"
          value={highRisk.length}
          hint="A1c ≥9 or FPG ≥250"
          tone={highRisk.length ? "danger" : "ok"}
        />
      </div>

      {overdue.length > 0 && (
        <Link
          to="/reviews"
          className="mt-4 flex items-center gap-3 rounded-[var(--radius-md)] bg-warning-soft px-4 py-3 text-warning"
        >
          <AlertTriangle className="size-4 shrink-0" />
          <span className="flex-1 text-sm">
            {overdue.length} patient{overdue.length === 1 ? "" : "s"} past their review date — open
            the recall list.
          </span>
          <ChevronRight className="size-4" />
        </Link>
      )}

      <div className="mt-6 flex gap-3 overflow-x-auto pb-4">
        {QUEUE_STAGES.map((col) => {
          const list = onBoard
            .filter((p) => p.queue?.stage === col.id)
            .sort((a, b) => (a.queue?.timeSlot ?? "").localeCompare(b.queue?.timeSlot ?? ""));
          return (
            <section key={col.id} className="w-64 shrink-0">
              <header className="mb-2 flex items-baseline justify-between px-1">
                <div>
                  <h2 className="text-sm font-medium">{col.label}</h2>
                  <p className="text-[11px] text-muted">{col.hint}</p>
                </div>
                <span className="font-mono text-sm tabular-nums text-muted">{list.length}</span>
              </header>
              <div className="min-h-40 space-y-2 rounded-[var(--radius-lg)] bg-surface-2/60 p-2">
                {list.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-muted">Empty</p>
                )}
                {list.map((p) => (
                  <QueueCard
                    key={p.id}
                    patient={p}
                    stage={col.id}
                    onAdvance={(next) => setQueue(p.id, next, today)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "ok",
}: {
  label: string;
  value: number;
  hint: string;
  tone?: "ok" | "warning" | "danger";
}) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl tabular-nums leading-none",
          tone === "warning" && "text-warning",
          tone === "danger" && "text-danger",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}

const NEXT: Record<QueueStage, QueueStage | null> = {
  waiting: "consult",
  consult: "labs",
  labs: "pharmacy",
  pharmacy: "done",
  done: null,
};

const NEXT_LABEL: Record<QueueStage, string | null> = {
  waiting: "Consult",
  consult: "Labs",
  labs: "Pharmacy",
  pharmacy: "Done",
  done: null,
};

function QueueCard({
  patient,
  stage,
  onAdvance,
}: {
  patient: Patient;
  stage: QueueStage;
  onAdvance: (s: QueueStage) => void;
}) {
  const next = NEXT[stage];
  const a1c = patient.labs.a1c;
  const hot = a1c != null && a1c >= 9;
  return (
    <article className="rounded-[var(--radius-md)] bg-surface p-3 shadow-[var(--shadow-border)]">
      <div className="flex items-start gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary-soft font-display text-sm text-primary">
          {initials(patient)}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            to="/patients/$patientId"
            params={{ patientId: patient.id }}
            className="block truncate text-sm font-medium hover:text-primary"
          >
            {fullName(patient)}
          </Link>
          <p className="truncate font-mono text-[11px] text-muted">
            {patient.mrn} · {ageSex(patient)}
          </p>
        </div>
        {patient.queue?.timeSlot && (
          <span className="font-mono text-[11px] tabular-nums text-muted">
            {patient.queue.timeSlot}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone="primary">{diagnosisShort(patient.diagnosis)}</Badge>
        {a1c != null && (
          <Badge tone={hot ? "danger" : a1c >= 7 ? "warning" : "success"}>
            A1c {a1c.toFixed(1)}%
          </Badge>
        )}
        {patient.nextReview < todayIso() && <Badge tone="warning">Overdue</Badge>}
      </div>
      <div className="mt-3 flex gap-1.5">
        {stage !== "done" && (
          <Button
            size="sm"
            className="h-9 flex-1 whitespace-nowrap"
            onClick={() => next && onAdvance(next)}
          >
            {NEXT_LABEL[stage]}
            <ArrowRight className="size-3.5" />
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-9 whitespace-nowrap px-3" asChild>
          <Link to="/patients/$patientId/visit" params={{ patientId: patient.id }}>
            Plan
          </Link>
        </Button>
      </div>
    </article>
  );
}
