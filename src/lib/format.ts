import { differenceInYears, format, parseISO, isValid } from "date-fns";
import type { Diagnosis, Patient, QueueStage, Sex } from "./types";

export function fullName(p: Pick<Patient, "firstName" | "lastName">) {
  return `${p.firstName} ${p.lastName}`;
}

export function initials(p: Pick<Patient, "firstName" | "lastName">) {
  return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
}

export function ageYears(dob: string, on: Date = new Date()) {
  const d = parseISO(dob);
  if (!isValid(d)) return 0;
  return differenceInYears(on, d);
}

export function ageSex(p: Pick<Patient, "dob" | "sex">, on?: Date) {
  return `${ageYears(p.dob, on)}${p.sex}`;
}

export function formatDate(iso?: string, fallback = "—") {
  if (!iso) return fallback;
  const d = parseISO(iso);
  if (!isValid(d)) return fallback;
  return format(d, "d MMM yyyy");
}

export function formatDateShort(iso?: string, fallback = "—") {
  if (!iso) return fallback;
  const d = parseISO(iso);
  if (!isValid(d)) return fallback;
  return format(d, "d MMM");
}

export function bmi(weightKg?: number, heightCm?: number) {
  if (!weightKg || !heightCm || heightCm <= 0) return undefined;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiLabel(value?: number) {
  if (value == null) return "—";
  if (value < 18.5) return "Underweight";
  if (value < 25) return "Healthy";
  if (value < 30) return "Overweight";
  if (value < 35) return "Obesity I";
  if (value < 40) return "Obesity II";
  return "Obesity III";
}

export function diagnosisLabel(d: Diagnosis) {
  switch (d) {
    case "t2dm":
      return "Type 2 diabetes";
    case "t1dm":
      return "Type 1 diabetes";
    case "prediabetes":
      return "Prediabetes";
    case "gdm":
      return "Gestational diabetes";
    case "screening":
      return "Screening / at risk";
  }
}

export function diagnosisShort(d: Diagnosis) {
  switch (d) {
    case "t2dm":
      return "T2DM";
    case "t1dm":
      return "T1DM";
    case "prediabetes":
      return "Pre-DM";
    case "gdm":
      return "GDM";
    case "screening":
      return "Screen";
  }
}

export function sexLabel(s: Sex) {
  return s === "F" ? "Female" : "Male";
}

export function stageLabel(s: QueueStage) {
  switch (s) {
    case "waiting":
      return "Waiting";
    case "consult":
      return "Consult";
    case "labs":
      return "Labs";
    case "pharmacy":
      return "Pharmacy";
    case "done":
      return "Discharged";
  }
}

export function num(v: string | number | undefined | null): number | undefined {
  if (v == null || v === "") return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function round0(n: number) {
  return Math.round(n);
}

export function monthsBetween(fromIso: string, to: Date) {
  const from = parseISO(fromIso);
  if (!isValid(from)) return 0;
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  return years * 12 + months - (to.getDate() < from.getDate() ? 1 : 0);
}

export function addDaysIso(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return format(d, "yyyy-MM-dd");
}

export function todayIso(on: Date = new Date()) {
  return format(on, "yyyy-MM-dd");
}

export function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}
