import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarClock,
  LayoutGrid,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { Mark } from "@/components/mark";
import { useClinicStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Today", icon: LayoutGrid },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/reviews", label: "Reviews", icon: CalendarClock },
  { to: "/guidelines", label: "Guidelines", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const finish = () => {
      useClinicStore.getState().seedIfEmpty();
      useClinicStore.getState().setHasHydrated(true);
    };
    const unsub = useClinicStore.persist.onFinishHydration(finish);
    void useClinicStore.persist.rehydrate();
    if (useClinicStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <div className="mx-auto flex min-h-dvh max-w-[1440px]">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-primary px-4 py-5 text-primary-fg md:flex">
          <Link to="/" className="flex items-start gap-3 px-1">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-primary-fg">
              <Mark className="size-9" />
            </span>
            <span>
              <span className="block font-display text-xl leading-tight">DiabCare</span>
              <span className="mt-0.5 block text-xs leading-snug text-primary-fg/70">
                Mbarara Regional Referral Hospital
              </span>
            </span>
          </Link>
          <p className="mt-5 px-1 text-xs font-medium uppercase tracking-[0.16em] text-primary-fg/55">
            Diabetes clinic
          </p>
          <nav className="mt-3 flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm transition-colors duration-150",
                    active
                      ? "bg-primary-fg text-primary"
                      : "text-primary-fg/80 hover:bg-primary-fg/10 hover:text-primary-fg",
                  )}
                >
                  <item.icon className="size-4" strokeWidth={1.75} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3 px-1">
            <p className="font-mono text-xs tabular-nums text-primary-fg/60">
              {format(new Date(), "EEEE d MMM yyyy")}
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <header className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3 md:hidden">
            <Mark className="size-8" />
            <div className="min-w-0">
              <p className="font-display text-lg leading-none">DiabCare</p>
              <p className="truncate text-xs text-muted">Mbarara RRH · Diabetes clinic</p>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm md:hidden">
        <ul className="grid grid-cols-4">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-primary" : "text-muted",
                  )}
                >
                  <item.icon className="size-5" strokeWidth={1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
