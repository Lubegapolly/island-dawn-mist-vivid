import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import type { CarePlan, PlanItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { planToPlainText } from "@/lib/cds";

const PRI: Record<PlanItem["priority"], { label: string; tone: "danger" | "primary" | "neutral" | "info" | "warning" | "success" }> = {
  now: { label: "Now", tone: "danger" },
  start: { label: "Start", tone: "primary" },
  continue: { label: "Continue", tone: "success" },
  refer: { label: "Refer", tone: "warning" },
  screen: { label: "Screen", tone: "info" },
  educate: { label: "Educate", tone: "neutral" },
};

const URGENCY = {
  stat: { label: "2-week safety review", tone: "danger" as const },
  soon: { label: "Early review", tone: "warning" as const },
  routine: { label: "Routine", tone: "primary" as const },
  extended: { label: "Surveillance", tone: "neutral" as const },
};

export function PlanPanel({
  plan,
  patientName,
  mrn,
  clinician,
  visitDate,
  compact,
}: {
  plan: CarePlan;
  patientName: string;
  mrn: string;
  clinician: string;
  visitDate: string;
  compact?: boolean;
}) {
  const copy = async () => {
    const text = planToPlainText(patientName, mrn, plan, clinician, visitDate);
    await navigator.clipboard.writeText(text);
    toast.success("Care plan copied — paste into the clinic book or EMR");
  };

  const print = () => {
    const text = planToPlainText(patientName, mrn, plan, clinician, visitDate);
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Allow pop-ups to print");
      return;
    }
    w.document.write(
      `<pre style="font:14px/1.45 'IBM Plex Sans',sans-serif;white-space:pre-wrap;padding:24px;color:#14221f">${escapeHtml(text)}</pre>`,
    );
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] bg-primary p-5 text-primary-fg shadow-[var(--shadow-border)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary-fg/70">
          Suggested next review
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-3xl leading-none tracking-tight">
              {formatDate(plan.review.date)}
            </p>
            <p className="mt-2 text-sm text-primary-fg/80">
              in {plan.review.label} · A1c every {plan.review.a1cIntervalMonths} months
            </p>
          </div>
          <Badge
            tone={URGENCY[plan.review.urgency].tone}
            className="bg-primary-fg/15 text-primary-fg"
          >
            {URGENCY[plan.review.urgency].label}
          </Badge>
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-primary-fg/85">
          {plan.review.reasons.map((r) => (
            <li key={r} className="leading-snug">
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-primary-fg/55">{plan.review.citation}</p>
      </div>

      {plan.alerts.length > 0 && (
        <div className="space-y-2">
          {plan.alerts.map((a) => (
            <div
              key={a.title}
              className={cn(
                "rounded-[var(--radius-md)] px-4 py-3",
                a.severity === "critical" && "bg-danger-soft text-danger",
                a.severity === "warning" && "bg-warning-soft text-warning",
                a.severity === "info" && "bg-info-soft text-info",
              )}
            >
              <p className="text-sm font-medium">{a.title}</p>
              <p className="mt-1 text-sm opacity-90">{a.detail}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Targets</p>
        <p className="mt-2 font-display text-xl">{plan.diagnosisLine}</p>
        <p className="mt-2 text-sm text-ink-soft">
          A1c {plan.a1cTarget.display} — {plan.a1cTarget.rationale}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{plan.glucoseTargets}</p>
      </div>

      <Section title="Glycaemic therapy" items={plan.therapy} />
      <Section title="BP, lipids, kidney, weight" items={plan.comorbidities} />
      {!compact && <Section title="Screening due" items={plan.screening} />}
      {!compact && <Section title="Education" items={plan.education} />}

      <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          Today’s clinic checklist
        </p>
        <ul className="mt-3 space-y-2">
          {plan.todayChecklist.map((c) => (
            <li key={c.id} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 size-4 shrink-0 rounded-[3px] ring-1 ring-line" />
              <span className="flex-1">{c.label}</span>
              <span className="text-[11px] uppercase tracking-wide text-muted">{c.station}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={copy} className="flex-1 sm:flex-none">
          <Copy className="size-4" />
          Copy plan
        </Button>
        <Button variant="secondary" onClick={print} className="flex-1 sm:flex-none">
          <Printer className="size-4" />
          Print
        </Button>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: PlanItem[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{title}</p>
      <ul className="mt-3 space-y-3">
        {items.map((i) => (
          <li key={i.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={PRI[i.priority].tone}>{PRI[i.priority].label}</Badge>
              <p className="text-sm font-medium">{i.title}</p>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{i.detail}</p>
            {i.localNote && (
              <p className="mt-1.5 text-sm leading-relaxed text-primary">{i.localNote}</p>
            )}
            {i.citation && <p className="mt-1 text-[11px] text-muted">{i.citation}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">");
}
