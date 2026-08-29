import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guidelines")({ component: GuidelinesPage });

const SECTIONS: { id: string; title: string; cite: string; body: { h?: string; p: string }[] }[] = [
  {
    id: "screen",
    title: "Screening",
    cite: "Diab Care 2026;49:S35",
    body: [
      {
        p: "Begin at age ≥35 years. Repeat every 3 years if normal. Repeat yearly if prediabetes or weight gain.",
      },
      {
        h: "Higher risk — screen earlier / more often",
        p: "BMI ≥25 (≥23 in Asian-Americans) plus a risk factor: first-degree relative with T2DM, non-white ethnicity, CVD, hypertension, HDL <35, triglycerides >250, PCOS, sedentary lifestyle, acanthosis nigricans, MASLD. History of GDM (every 1–3 years), pancreatitis, or HIV before starting or switching ART.",
      },
    ],
  },
  {
    id: "pre",
    title: "Prediabetes",
    cite: "Diab Care 2026;49:S35",
    body: [
      {
        h: "Diagnosis",
        p: "A1c 5.7–6.4% · FPG 100–125 · or 75 g OGTT 2-hour glucose 140–199.",
      },
      {
        h: "Monitoring",
        p: "A1c at least yearly. If A1c 6.0–6.4%, every 6 months. At initiation of second-generation antipsychotics and 12–16 weeks after. Before starting or switching HIV ART, and 3–6 months after.",
      },
      {
        h: "Treatment",
        p: "Lifestyle is most effective. Metformin is also effective, especially if BMI ≥35, age <60, or history of GDM (Cochrane 2019).",
      },
    ],
  },
  {
    id: "dm",
    title: "Diabetes diagnosis & targets",
    cite: "Diab Care 2025;48:S27",
    body: [
      {
        h: "Diagnosis",
        p: "A1c ≥6.5% · FPG ≥126 · 75 g OGTT 2-hour ≥200 · or random BG ≥200 with symptoms. Unless diagnosis is by symptoms plus random glucose ≥200, confirm with a repeat or a second test at the same time or promptly after.",
      },
      {
        h: "When not to use A1c",
        p: "High RBC turnover: sickle cell, 2nd/3rd trimester, G6PD, haemodialysis, HIV, recent blood loss or transfusion, EPO. Also less reliable post-partum, with certain HIV drugs, thalassaemia, and anaemia — use plasma glucose.",
      },
      {
        h: "A1c goal",
        p: "<7% for most adults. Liberalise to <8–8.5% if life expectancy ≤10 years or high hypoglycaemia risk (e.g. ESRD).",
      },
      {
        h: "T1DM extras",
        p: "TSH at diagnosis and yearly. Screen thyroid disease and coeliac at diagnosis, and again if signs develop.",
      },
    ],
  },
  {
    id: "hcm",
    title: "Healthcare maintenance",
    cite: "Diab Care 2026;49:S61–88",
    body: [
      {
        h: "Every visit",
        p: "Glucose log (AM FPG 80–130, 1–2 h post-meal <180); hypoglycaemia frequency, causes, timing. Medicines and adherence. Tobacco, alcohol, substances. BP goal <130/80 (ACEI/ARB first line; <120/80 if multiple CV risks and safe). Weight/BMI — nutrition referral for all; weight centre if BMI ≥40 or ≥35 with poor control. Foot exam (skin, joints, pulses, sensation). Skin / injection sites / acanthosis.",
      },
      {
        h: "Every 3–6 months",
        p: "A1c every 6 months if controlled on a stable regimen; every 3 months if above target, recent treatment change, hypo/hyperglycaemia, or change in health status.",
      },
      {
        h: "Annually",
        p: "Lipids — age 40–75: moderate-intensity statin for all diabetes regardless of panel. ≥1 ASCVD risk factor: high-intensity, LDL-C <70. Clinical ASCVD: LDL-C <55 with statin plus other agents. Age 20–39: consider statin if extra risk. Urine ACR and eGFR; ACEI/ARB if hypertensive with proteinuria or eGFR <60; refer renal if eGFR <30. Neuropathy: 10 g monofilament (abnormal if no sensation at 4/10 sites), pinprick, vibration or reflexes. Retinopathy: dilated exam or retinal photography; every 2–3 years if prior exams normal. LFTs; elastography / hepatology if elevated (MASLD). B12 if on metformin. T1DM: yearly TSH.",
      },
      {
        h: "Vaccines",
        p: "Influenza annually, COVID-19, HBV series if age <60 and not immune, zoster (age >50), Tdap, pneumococcus, RSV (CDC).",
      },
    ],
  },
  {
    id: "basal",
    title: "Basal insulin",
    cite: "Diab Care 2026;49:S183–215",
    body: [
      {
        h: "When to start",
        p: "A1c ≥10%, random BG ≥300, fasting BG ≥250, or symptomatic. Suspicion of T1DM / LADA / insulin deficiency. Age <65 on two agents with A1c >8% (or ≥65 and A1c >8.5%) on two occasions >3 months apart. Or A1c rising quickly. Patient must be able to self-monitor; refer a diabetes educator.",
      },
      {
        h: "Starting dose",
        p: "A1c <8%: 0.1–0.2 U/kg/day. A1c ≥8%: 0.2–0.3 U/kg/day. Prefer long-acting (glargine / detemir / degludec once daily) over NPH twice daily to reduce hypoglycaemia. Pen vs syringe: pens are easier, syringes cheaper.",
      },
      {
        h: "Titration",
        p: "Increase 2–4 U or 10–15% every 2–3 days until AM fasting 80–130 without hypoglycaemia. If hypoglycaemia or FPG <80 without a clear reason, decrease 10–20% or 4 U, whichever is greater.",
      },
      {
        h: "Before prandial insulin",
        p: "If more control is needed beyond basal, consider a GLP-1 RA or dual GIP/GLP-1 RA before adding mealtime insulin — less hypoglycaemia and weight gain.",
      },
    ],
  },
  {
    id: "prandial",
    title: "Prandial / mixed insulin",
    cite: "Diab Care 2026;49:S183–215",
    body: [
      {
        h: "When",
        p: "A1c still not at goal with basal insulin >0.5 U/kg/day and fasting glucose already 80–130.",
      },
      {
        h: "Strategy 1",
        p: "Add rapid-acting insulin before the largest meal. Start 4 U, or 0.1 U/kg, or 10% of the basal dose.",
      },
      {
        h: "Strategy 2",
        p: "Change to mixed insulin (e.g. 70/30, NPH + Regular) twice daily before breakfast and dinner. Split current basal ⅔ AM / ⅓ PM or ½ / ½. Confirm the patient eats three regular meals.",
      },
      {
        h: "Titration",
        p: "Increase 1–2 U or 10–15% every 3 days until pre-meal 80–130 and 1–2 h post-meal <180. If still high, add rapid-acting to another meal. Hypoglycaemia or FPG <80: decrease 10–20% or 4 U, whichever is greater.",
      },
    ],
  },
  {
    id: "supplies",
    title: "Insulin supplies",
    cite: "MGH pocket card",
    body: [
      {
        p: "Pen needles, or needle + syringe. 32G 4 mm is less painful (higher gauge = thinner). Larger patients and high doses often need a longer/wider needle.",
      },
      {
        h: "Syringe barrel",
        p: "Choose the smallest syringe that holds the dose (clearer markings): 0.3 mL for ≤30 U · 0.5 mL for 31–50 U · 1 mL for 51–100 U. Boxes of 100.",
      },
      {
        p: "Alcohol swabs, or wash with soap and water. Glucometer and matching strips (boxes of 50–100). Talking meters help if vision is poor. Consider CGM when obtainable. All durable equipment should carry a diagnosis code on the request.",
      },
      {
        h: "MRRH note",
        p: "Public-sector stock is usually NPH, Regular and 70/30, 1 mL syringes, and intermittent strips. Write a realistic testing plan. Analog insulins, GLP-1 RAs and SGLT2 inhibitors are typically out-of-pocket in Mbarara — offer them when the patient can obtain them, and never delay ACEI, statin, BP control or insulin that is in stock.",
      },
    ],
  },
];

function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        Pocket card
      </p>
      <h1 className="mt-1 font-display text-3xl tracking-tight">ADA outpatient T2DM</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Decision support in DiabCare is taken from the MGH endocrinology pocket card (ADA
        Standards of Care 2025–2026). Local formulary notes are added for Mbarara Regional
        Referral Hospital. This is not a substitute for clinical judgement.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="h-9 rounded-full bg-surface px-3 text-xs font-medium leading-9 text-ink-soft shadow-[var(--shadow-border)] hover:text-primary"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-4">
        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-4 rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl tracking-tight">{s.title}</h2>
              <p className="font-mono text-[11px] text-muted">{s.cite}</p>
            </div>
            <div className="mt-4 space-y-4">
              {s.body.map((b) => (
                <div key={b.p}>
                  {b.h && <p className="text-sm font-medium">{b.h}</p>}
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{b.p}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
