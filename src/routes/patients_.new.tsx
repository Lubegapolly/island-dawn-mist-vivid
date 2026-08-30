import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, NativeSelect } from "@/components/ui/input";
import { useClinicStore } from "@/lib/store";
import {
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
    setRisks((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r
