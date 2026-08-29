import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format, parseISO } from "date-fns";
import { Copy, Phone } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClinicStore } from "@/lib/store";
import {
  ageSex,
  diagnosisShort,
  formatDate,
  fullName,
  phoneHref,
  todayIso,
} from "@/lib/format";

export const Route = createFileRoute("/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  const patients = useClinicStore((s) => s.patients);
  const addToToday = useClinicStore((s) => s.addToToday);
  const today = todayIso();
  const horizon = format(addDays(new Date(), 30), "yyyy-MM-dd");
  const [tab, setTab] = useState<"overdue" | "week" | "month">("overdue");

  const overdue = useMemo(
    () => patients.filter((p) => p.nextReview < today).sort((a, b) => a.nextReview.localeCompare(b.nextReview)),
    [patients, today],
  );
  const week = useMemo(() => {
    const end = format(addDays(new Date(), 7), "yyyy-MM-dd");
    return patients
      .filter((p) => p.nextReview >= today && p.nextReview <= end)
      .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  }, [patients, today]);
  const month = useMemo(
    () =>
      patients
        .filter((p) => p.nextReview >= today && p.nextReview <= horizon)
        .sort((a, b) => a.nextReview.localeCompare(b.nextReview)),
    [patients, today, horizon],
  );

  const list = tab === "overdue" ? overdue : tab === "week" ? week : month;

  const copyRecall = async () => {
    const rows = overdue.map(
      (p) =>
        `${fullName(p)}\t${p.mrn}\t${p.phone}\t${p.village}\t${formatDate(p.nextReview)}\t${diagnosisShort(p.diagnosis)}`,
    );
    const text = [
      "MRRH Diabetes Clinic — RECALL LIST",
      `Generated ${format(new Date(), "d MMM yyyy")}`,
      "Name\tMRN\tPhone\tVillage\tWas due\tDx",
      ...rows,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Recall list copied for VHTs / records clerks");
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            Clinic flow
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Reviews & recall</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Suggested dates come from ADA intervals — 2 weeks after insulin start or crisis, 3
            months if not at target, 6 months if stable.
          </p>
        </div>
        <Button variant="secondary" onClick={copyRecall} disabled={overdue.length === 0}>
          <Copy className="size-4" />
          Copy overdue list
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setTab("overdue")}
          className={tabClass(tab === "overdue")}
        >
          <p className="text-xs uppercase tracking-wide text-muted">Overdue</p>
          <p className="mt-1 font-display text-2xl tabular-nums text-warning">{overdue.length}</p>
        </button>
        <button type="button" onClick={() => setTab("week")} className={tabClass(tab === "week")}>
          <p className="text-xs uppercase tracking-wide text-muted">Next 7 days</p>
          <p className="mt-1 font-display text-2xl tabular-nums">{week.length}</p>
        </button>
        <button type="button" onClick={() => setTab("month")} className={tabClass(tab === "month")}>
          <p className="text-xs uppercase tracking-wide text-muted">Next 30 days</p>
          <p className="mt-1 font-display text-2xl tabular-nums">{month.length}</p>
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-border)]">
        {list.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-muted">Nothing in this window.</p>
        ) : (
          <ul className="divide-y divide-line">
            {list.map((p) => {
              const due = parseISO(p.nextReview);
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
                >
                  <Link
                    to="/patients/$patientId"
                    params={{ patientId: p.id }}
                    className="min-w-0 flex-1"
                  >
                    <p className="font-medium">{fullName(p)}</p>
                    <p className="font-mono text-[11px] text-muted">
                      {p.mrn} · {ageSex(p)} · {p.village}
                    </p>
                  </Link>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="primary">{diagnosisShort(p.diagnosis)}</Badge>
                    {p.labs.a1c != null && (
                      <Badge tone={p.labs.a1c >= 9 ? "danger" : "neutral"}>
                        A1c {p.labs.a1c.toFixed(1)}%
                      </Badge>
                    )}
                    <span className="text-xs tabular-nums text-ink-soft">
                      {format(due, "EEE d MMM")}
                    </span>
                    {p.phone && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={phoneHref(p.phone)}>
                          <Phone className="size-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => addToToday(p.id)}>
                      Check in
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function tabClass(on: boolean) {
  return on
    ? "rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)] ring-2 ring-primary"
    : "rounded-[var(--radius-lg)] bg-surface p-4 text-left shadow-[var(--shadow-border)]";
}
