import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Patient, QueueStage, Visit } from "./types";
import { makeSeed, SEED_VERSION } from "./seed";
import { todayIso } from "./format";

const boot = makeSeed(new Date());

type ClinicState = {
  seedVersion: number;
  patients: Patient[];
  visits: Visit[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seedIfEmpty: () => void;
  resetDemo: () => void;
  upsertPatient: (p: Patient) => void;
  addVisit: (v: Visit, patientPatch: Partial<Patient>) => void;
  setQueue: (patientId: string, stage: QueueStage | null, date?: string) => void;
  addToToday: (patientId: string, timeSlot?: string) => void;
};

export const useClinicStore = create<ClinicState>()(
  persist(
    (set, get) => ({
      seedVersion: SEED_VERSION,
      patients: boot.patients,
      visits: boot.visits,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seedIfEmpty: () => {
        const { patients, seedVersion } = get();
        if (patients.length === 0 || seedVersion !== SEED_VERSION) {
          const seed = makeSeed(new Date());
          set({
            patients: seed.patients,
            visits: seed.visits,
            seedVersion: SEED_VERSION,
          });
        }
      },
      resetDemo: () => {
        const seed = makeSeed(new Date());
        set({
          patients: seed.patients,
          visits: seed.visits,
          seedVersion: SEED_VERSION,
        });
      },
      upsertPatient: (p) =>
        set((s) => {
          const i = s.patients.findIndex((x) => x.id === p.id);
          if (i === -1) return { patients: [p, ...s.patients] };
          const next = s.patients.slice();
          next[i] = p;
          return { patients: next };
        }),
      addVisit: (v, patientPatch) =>
        set((s) => ({
          visits: [v, ...s.visits],
          patients: s.patients.map((p) =>
            p.id === v.patientId
              ? { ...p, ...patientPatch, lastVisitId: v.id }
              : p,
          ),
        })),
      setQueue: (patientId, stage, date) =>
        set((s) => ({
          patients: s.patients.map((p) => {
            if (p.id !== patientId) return p;
            if (stage == null) return { ...p, queue: undefined };
            const day = date ?? p.queue?.date ?? todayIso();
            return {
              ...p,
              queue: {
                date: day,
                stage,
                timeSlot: p.queue?.timeSlot,
                checkInAt: p.queue?.checkInAt,
              },
            };
          }),
        })),
      addToToday: (patientId, timeSlot) =>
        set((s) => ({
          patients: s.patients.map((p) =>
            p.id === patientId
              ? {
                  ...p,
                  queue: {
                    date: todayIso(),
                    stage: "waiting",
                    timeSlot,
                    checkInAt: new Date().toISOString(),
                  },
                }
              : p,
          ),
        })),
    }),
    {
      name: "diabcare-mrrh-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        seedVersion: s.seedVersion,
        patients: s.patients,
        visits: s.visits,
      }),
    },
  ),
);

export function usePatient(id: string | undefined) {
  return useClinicStore((s) => s.patients.find((p) => p.id === id));
}

export function useVisits(patientId: string | undefined) {
  return useClinicStore((s) =>
    s.visits
      .filter((v) => v.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date)),
  );
}
