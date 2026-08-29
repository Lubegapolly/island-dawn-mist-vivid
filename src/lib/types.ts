export type Sex = "F" | "M";

export type Diagnosis =
  | "t2dm"
  | "t1dm"
  | "prediabetes"
  | "gdm"
  | "screening";

export type QueueStage =
  | "waiting"
  | "consult"
  | "labs"
  | "pharmacy"
  | "done";

export type Hypoglycemia = "none" | "mild" | "frequent" | "severe";

export type ExamResult = "normal" | "abnormal" | "deferred";

export type MedClass =
  | "metformin"
  | "su"
  | "insulin-basal"
  | "insulin-prandial"
  | "insulin-mixed"
  | "acei"
  | "arb"
  | "statin"
  | "sglt2"
  | "glp1"
  | "dpp4"
  | "other";

export type RiskFactor =
  | "family-t2dm"
  | "cvd"
  | "htn"
  | "low-hdl"
  | "high-tg"
  | "pcos"
  | "sedentary"
  | "acanthosis"
  | "masld"
  | "gdm-hx"
  | "pancreatitis"
  | "hiv"
  | "weight-gain"
  | "asian-bmi-threshold";

export type Condition =
  | "ckd"
  | "esrd"
  | "cvd"
  | "hf"
  | "pvd"
  | "neuropathy"
  | "retinopathy"
  | "masld"
  | "sickle-cell"
  | "anemia"
  | "hiv"
  | "pregnancy";

export type Medication = {
  name: string;
  dose: string;
  cls: MedClass;
};

export type QueueState = {
  date: string;
  stage: QueueStage;
  timeSlot?: string;
  checkInAt?: string;
};

export type HcmDates = {
  lastA1c?: string;
  lastEye?: string;
  lastEyeNormal?: boolean;
  lastFoot?: string;
  lastLipids?: string;
  lastAcr?: string;
  lastEgfr?: string;
  lastB12?: string;
  lastTsh?: string;
  lastLft?: string;
  influenza?: string;
  covid?: boolean;
  hbvImmune?: boolean;
  zoster?: string;
  tdap?: string;
  pneumo?: string;
};

export type Labs = {
  a1c?: number;
  a1cDate?: string;
  fpg?: number;
  ppg?: number;
  randomBg?: number;
  ldl?: number;
  acr?: number;
  egfr?: number;
  alt?: number;
};

export type Patient = {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  sex: Sex;
  dob: string;
  phone: string;
  village: string;
  district: string;
  diagnosis: Diagnosis;
  diagnosisYear?: number;
  riskFactors: RiskFactor[];
  conditions: Condition[];
  allergies: string;
  currentMeds: Medication[];
  weightKg?: number;
  heightCm?: number;
  nextReview: string;
  lastVisitId?: string;
  queue?: QueueState;
  labs: Labs;
  hcm: HcmDates;
  highHypoRisk?: boolean;
  limitedLifeExpectancy?: boolean;
  createdAt: string;
};

export type Visit = {
  id: string;
  patientId: string;
  date: string;
  clinician: string;
  weightKg?: number;
  heightCm?: number;
  sbp?: number;
  dbp?: number;
  a1c?: number;
  fpg?: number;
  ppg?: number;
  randomBg?: number;
  ldl?: number;
  acr?: number;
  egfr?: number;
  alt?: number;
  hypoglycemia: Hypoglycemia;
  symptomaticHyper: boolean;
  treatmentChanged: boolean;
  healthStatusChange: boolean;
  insulinStartedToday: boolean;
  smoking: boolean;
  alcohol: boolean;
  footExam: ExamResult;
  neuropathyExam: ExamResult;
  notes: string;
  meds: Medication[];
  nextReview: string;
  a1cIntervalMonths: number;
  planSummary: string;
  alerts: string[];
};

export type VisitDraft = {
  date: string;
  clinician: string;
  weightKg: string;
  heightCm: string;
  sbp: string;
  dbp: string;
  a1c: string;
  fpg: string;
  ppg: string;
  randomBg: string;
  ldl: string;
  acr: string;
  egfr: string;
  alt: string;
  hypoglycemia: Hypoglycemia;
  symptomaticHyper: boolean;
  treatmentChanged: boolean;
  healthStatusChange: boolean;
  insulinStartedToday: boolean;
  smoking: boolean;
  alcohol: boolean;
  footExam: ExamResult;
  neuropathyExam: ExamResult;
  notes: string;
  meds: Medication[];
  diagnosis: Diagnosis;
  highHypoRisk: boolean;
  limitedLifeExpectancy: boolean;
  conditions: Condition[];
  riskFactors: RiskFactor[];
  lastEye?: string;
  lastEyeNormal?: boolean;
  lastLipids?: string;
  lastAcr?: string;
  lastB12?: string;
  lastTsh?: string;
  lastLft?: string;
  hbvImmune?: boolean;
};

export type AlertSeverity = "critical" | "warning" | "info";

export type CdsAlert = {
  severity: AlertSeverity;
  title: string;
  detail: string;
  citation?: string;
};

export type PlanItem = {
  id: string;
  priority: "now" | "start" | "continue" | "refer" | "screen" | "educate";
  title: string;
  detail: string;
  citation?: string;
  localNote?: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done?: boolean;
  station: "nursing" | "clinician" | "lab" | "pharmacy";
};

export type InsulinPlan = {
  indicated: boolean;
  reason: string;
  kind: "basal" | "titrate-basal" | "prandial" | "mixed" | "none";
  startRange?: string;
  startMidU?: number;
  weightKg?: number;
  titration: string;
  hypoHold: string;
  syringe?: string;
  localNote: string;
};

export type ReviewSuggestion = {
  days: number;
  label: string;
  date: string;
  urgency: "stat" | "soon" | "routine" | "extended";
  a1cIntervalMonths: number;
  reasons: string[];
  citation: string;
};

export type HcmItem = {
  id: string;
  label: string;
  interval: string;
  last?: string;
  due: boolean;
  overdueMonths?: number;
  action: string;
};

export type GlycemicClass =
  | "normal"
  | "prediabetes"
  | "diabetes"
  | "unconfirmed-diabetes";

export type CarePlan = {
  glycemicClass: GlycemicClass;
  diagnosisLine: string;
  a1cTarget: { display: string; numeric: number; rationale: string };
  glucoseTargets: string;
  review: ReviewSuggestion;
  alerts: CdsAlert[];
  todayChecklist: ChecklistItem[];
  therapy: PlanItem[];
  comorbidities: PlanItem[];
  screening: PlanItem[];
  education: PlanItem[];
  hcm: HcmItem[];
  insulin: InsulinPlan;
  summary: string;
};

export const QUEUE_STAGES: { id: QueueStage; label: string; hint: string }[] = [
  { id: "waiting", label: "Waiting", hint: "Checked in" },
  { id: "consult", label: "Consult", hint: "With clinician" },
  { id: "labs", label: "Labs / HCM", hint: "A1c, ACR, eyes" },
  { id: "pharmacy", label: "Pharmacy", hint: "Medicines & supplies" },
  { id: "done", label: "Discharged", hint: "Review booked" },
];

export const CLINICIANS = [
  "Dr. Atwine",
  "Dr. Namanya",
  "Dr. Kansiime",
  "Sr. Kyohairwe",
  "Sr. Nuwagaba",
  "Intern — Medical",
];

export const DISTRICTS = [
  "Mbarara",
  "Isingiro",
  "Ntungamo",
  "Sheema",
  "Bushenyi",
  "Ibanda",
  "Kiruhura",
  "Rwampara",
  "Kazo",
  "Buhweju",
];
