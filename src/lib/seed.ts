import type { Patient, Visit } from "./types";

export function makeSeed(_now: Date): { patients: Patient[]; visits: Visit[] } {
  return { patients: [], visits: [] };
}

export const SEED_VERSION = 2;
