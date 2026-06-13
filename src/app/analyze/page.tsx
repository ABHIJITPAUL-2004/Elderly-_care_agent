"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/language-context";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { scenarios } from "@/data/scenarios";

// Form initial state
const INITIAL_FORM = {
  fullName: "",
  age: "",
  gender: "Female" as "Male" | "Female" | "Other" | "Unknown",
  conditions: "",
  medications: "",
  heartRate: "",
  bloodPressure: "",
  oxygenSaturation: "",
  dailyActivityLevel: "",
  sleepQuality: "",
  medicationAdherence: "",
  previousFalls: "0",
  mobilityStatus: "",
  additionalNotes: "",
};

const SCENARIO_FORM_VALUES = {
  "patient-006": {
    fullName: "Ken Watanabe",
    age: "72",
    gender: "Male" as const,
    conditions: "Mild hyperlipidemia",
    medications: "Atorvastatin",
    heartRate: "68",
    bloodPressure: "122/76",
    oxygenSaturation: "99",
    dailyActivityLevel: "Completed morning walk and community garden volunteer shift.",
    sleepQuality: "7.5",
    medicationAdherence: "100",
    previousFalls: "0",
    mobilityStatus: "Highly active, moves without assistance.",
    additionalNotes: "Exercises regularly. Walks 8,000 steps daily. Vitals consistently normal.",
  },
  "patient-007": {
    fullName: "Yoko Yamamoto",
    age: "79",
    gender: "Female" as const,
    conditions: "Hypertension, Early-stage Parkinson's disease",
    medications: "Levodopa, Losartan",
    heartRate: "74",
    bloodPressure: "144/88",
    oxygenSaturation: "97",
    dailyActivityLevel: "Brief indoor activities. Skipped evening walks.",
    sleepQuality: "6.0",
    medicationAdherence: "65",
    previousFalls: "0",
    mobilityStatus: "Mild tremors, gait is slow but independent.",
    additionalNotes: "Tends to forget evening dose due to mild cognitive lapses.",
  },
  "patient-008": {
    fullName: "Shigeru Nakamura",
    age: "81",
    gender: "Male" as const,
    conditions: "Hypertension, Chronic heart failure, Gout",
    medications: "Carvedilol, Allopurinol",
    heartRate: "80",
    bloodPressure: "154/90",
    oxygenSaturation: "94",
    dailyActivityLevel: "Limited activities due to mild fatigue.",
    sleepQuality: "6.2",
    medicationAdherence: "95",
    previousFalls: "0",
    mobilityStatus: "Slow gait, reports shortness of breath on mild exertion.",
    additionalNotes: "Blood pressure shows a steady upward trend over the past 3 weeks.",
  },
  "patient-009": {
    fullName: "Chiyo Kobayashi",
    age: "85",
    gender: "Female" as const,
    conditions: "Severe osteoarthritis of the hip, Osteoporosis, Vertigo",
    medications: "Alendronic acid, Betahistine",
    heartRate: "74",
    bloodPressure: "136/80",
    oxygenSaturation: "96",
    dailyActivityLevel: "Struggled with kitchen prep. Used cane constantly.",
    sleepQuality: "5.8",
    medicationAdherence: "92",
    previousFalls: "1",
    mobilityStatus: "Uses a walker. Gait is highly unsteady, especially when turning.",
    additionalNotes: "Slipped once near the kitchen last month. Osteoarthritis hip pain.",
  },
  "patient-010": {
    fullName: "Hiroshi Kato",
    age: "88",
    gender: "Male" as const,
    conditions: "Post-stroke hemiparesis, Hypertension, Atrial fibrillation",
    medications: "Warfarin, Amlodipine",
    heartRate: "104",
    bloodPressure: "168/98",
    oxygenSaturation: "92",
    dailyActivityLevel: "Bed-bound today following fall.",
    sleepQuality: "6.0",
    medicationAdherence: "95",
    previousFalls: "2",
    mobilityStatus: "Stroke hemiparesis. Unstable transfers.",
    additionalNotes: "Suffered a fall today in bedroom. Optical sensor triggered emergency alert.",
  },
  "patient-011": {
    fullName: "Kikue Yoshida",
    age: "83",
    gender: "Female" as const,
    conditions: "Rheumatoid arthritis, Chronic obstructive pulmonary disease",
    medications: "Methotrexate, Salbutamol Inhaler",
    heartRate: "78",
    bloodPressure: "132/80",
    oxygenSaturation: "91",
    dailyActivityLevel: "Spent day in living room. Meal delivery accepted.",
    sleepQuality: "6.2",
    medicationAdherence: "90",
    previousFalls: "0",
    mobilityStatus: "Severe joint stiffness in hands/knees. Restrictive movement.",
    additionalNotes: "Primary caregiver Kenji Okada cancelled shift due to flu. No backup assigned.",
  }
};

const RISK_THEMES: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  LOW:      { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-500" },
  MODERATE: { border: "border-amber-200",   bg: "bg-amber-50",   text: "text-amber-800",   dot: "bg-amber-500"   },
  HIGH:     { border: "border-orange-200",  bg: "bg-orange-50",  text: "text-orange-800",  dot: "bg-orange-500"  },
  CRITICAL: { border: "border-rose-200",    bg: "bg-rose-50",    text: "text-rose-800",    dot: "bg-rose-500"    },
};

export default function AnalyzePage() {
  const { t, locale } = useLanguage();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();
  const [progressStep, setProgressStep] = useState(0); // 0=idle, 1=health/safety, 2=care, 3=manager
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "health" | "safety" | "care" | "manager">("summary");

  const selectScenario = (patientId: string) => {
    const values = SCENARIO_FORM_VALUES[patientId as keyof typeof SCENARIO_FORM_VALUES];
    if (values) {
      setForm({
        fullName: values.fullName,
        age: values.age,
        gender: values.gender,
        conditions: values.conditions,
        medications: values.medications,
        heartRate: values.heartRate,
        bloodPressure: values.bloodPressure,
        oxygenSaturation: values.oxygenSaturation,
        dailyActivityLevel: values.dailyActivityLevel,
        sleepQuality: values.sleepQuality,
        medicationAdherence: values.medicationAdherence,
        previousFalls: values.previousFalls,
        mobilityStatus: values.mobilityStatus,
        additionalNotes: values.additionalNotes,
      });
      setErrors({});
      setResults(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear error
    if (errors[e.target.name]) {
      const nextErrors = { ...errors };
      delete nextErrors[e.target.name];
      setErrors(nextErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setResults(null);
    setProgressStep(1);

    startTransition(async () => {
      // Simulate intermediate progress steps for visual feedback
      const stepTimer1 = setTimeout(() => setProgressStep(2), 1500);
      const stepTimer2 = setTimeout(() => setProgressStep(3), 3200);

      try {
        const response = await fetch("/api/analyze/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);

        if (!response.ok) {
          const errData = await response.json();
          if (errData.error === "Validation failed" && errData.details) {
            setErrors(errData.details);
            setProgressStep(0);
            return;
          }
          throw new Error("Analysis failed");
        }

        const data = await response.json();
        setResults(data);
        setActiveTab("summary");
        setProgressStep(0);
      } catch (err) {
        console.error(err);
        setErrors({ general: ["An unexpected error occurred during AI analysis. Please check your vitals format and try again."] });
        setProgressStep(0);
      }
    });
  };

  const risk = results ? (RISK_THEMES[results.manager.overall_risk_level] ?? RISK_THEMES.LOW) : RISK_THEMES.LOW;

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />

      {/* Header */}
      <header className="border-b border-stone-200 bg-[#f7ecd9]/88 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Live Analysis Gateway
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Analyze Custom Patient
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-stone-500">
            Select a predefined care scenario to populate the form instantly, or manually enter vital metrics and conditions to observe collaborative multi-agent decisions in real-time.
          </p>

          {/* Quick Scenario Selectors */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Quick Select Demo Scenario
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectScenario(s.patientId)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d0c4] bg-[#f4e3da] hover:bg-[#ecd4c9] text-stone-700 px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${RISK_THEMES[s.riskLevel]?.dot || "bg-stone-400"}`} />
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Healthcare Input Form */}
          <section className="lg:col-span-5 rounded-2xl border border-stone-200 bg-[#fff9ef]/88 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Healthcare Metrics
            </h2>

            {errors.general && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 leading-relaxed">
                {errors.general[0]}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Patient Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Kenji Tanaka"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-600">{errors.fullName[0]}</p>}
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 82"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.age && <p className="mt-1 text-xs text-rose-600">{errors.age[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Conditions</label>
                <input
                  type="text"
                  name="conditions"
                  value={form.conditions}
                  onChange={handleInputChange}
                  placeholder="Comma separated: Hypertension, Insomnia"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Medications */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Medications</label>
                <input
                  type="text"
                  name="medications"
                  value={form.medications}
                  onChange={handleInputChange}
                  placeholder="Comma separated: Amlodipine, Levodopa"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Heart Rate, Blood Pressure, Oxygen Saturation */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">HR (bpm)</label>
                  <input
                    type="number"
                    name="heartRate"
                    value={form.heartRate}
                    onChange={handleInputChange}
                    placeholder="75"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.heartRate && <p className="mt-1 text-xs text-rose-600">{errors.heartRate[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">BP (Sys/Dia)</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={form.bloodPressure}
                    onChange={handleInputChange}
                    placeholder="120/80"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.bloodPressure && <p className="mt-1 text-xs text-rose-600">{errors.bloodPressure[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    name="oxygenSaturation"
                    value={form.oxygenSaturation}
                    onChange={handleInputChange}
                    placeholder="98"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.oxygenSaturation && <p className="mt-1 text-xs text-rose-600">{errors.oxygenSaturation[0]}</p>}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Daily Activity Level</label>
                <input
                  type="text"
                  name="dailyActivityLevel"
                  value={form.dailyActivityLevel}
                  onChange={handleInputChange}
                  placeholder="e.g. Walks short distance around house, mostly sedentary"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                />
                {errors.dailyActivityLevel && <p className="mt-1 text-xs text-rose-600">{errors.dailyActivityLevel[0]}</p>}
              </div>

              {/* Sleep Hours & Adherence */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Sleep (Hours)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="sleepQuality"
                    value={form.sleepQuality}
                    onChange={handleInputChange}
                    placeholder="6.5"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.sleepQuality && <p className="mt-1 text-xs text-rose-600">{errors.sleepQuality[0]}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Adherence (%)</label>
                  <input
                    type="number"
                    name="medicationAdherence"
                    value={form.medicationAdherence}
                    onChange={handleInputChange}
                    placeholder="95"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.medicationAdherence && <p className="mt-1 text-xs text-rose-600">{errors.medicationAdherence[0]}</p>}
                </div>
              </div>

              {/* Falls & Mobility */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Prev. Falls</label>
                  <input
                    type="number"
                    name="previousFalls"
                    value={form.previousFalls}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.previousFalls && <p className="mt-1 text-xs text-rose-600">{errors.previousFalls[0]}</p>}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Mobility Status</label>
                  <input
                    type="text"
                    name="mobilityStatus"
                    value={form.mobilityStatus}
                    onChange={handleInputChange}
                    placeholder="e.g. Uses a cane, walks unstable"
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  />
                  {errors.mobilityStatus && <p className="mt-1 text-xs text-rose-600">{errors.mobilityStatus[0]}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={form.additionalNotes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
                  placeholder="Symptom fluctuations, mood shifts..."
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#e3b7aa] px-5 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-[#d9aa9b] disabled:opacity-60 cursor-pointer mt-4"
              >
                {isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing Patient...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.982-8.983m-8.982 3.983a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1118 7.5l-6.84 6.84m-4.346-2.492l10.87-10.87L17.25 6" />
                    </svg>
                    Analyze Patient
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Stepper Pipeline Loader OR Analysis Results */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Stepper Pipeline Loader */}
            {isPending && (
              <div className="rounded-2xl border border-[#ead7ca] bg-[#f9eee4]/90 p-8 shadow-sm flex flex-col items-center text-center justify-center min-h-100">
                <div className="relative flex h-16 w-16 items-center justify-center mb-6">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d8a99a] text-white font-bold">
                    AI
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800">Multi-Agent Pipeline Active</h3>
                <p className="mt-2 text-sm text-stone-600 max-w-sm">
                  Orchestrating agent collaboration in real-time. Specialist agents are verifying metrics.
                </p>

                {/* Pipeline Stepper visualization */}
                <div className="mt-8 w-full max-w-md space-y-4">
                  {[
                    { step: 1, label: "Health & Safety Agents", detail: "Calculating risk score & checking fall sensors (Parallel)" },
                    { step: 2, label: "Care Coordination Agent", detail: "Assigning helper tasks & family notifications" },
                    { step: 3, label: "AI Care Manager", detail: "Synthesizing executive summary & integrated plan" }
                  ].map((s) => {
                    const isPassed = progressStep > s.step;
                    const isActive = progressStep === s.step;
                    return (
                      <div key={s.step} className="flex items-start gap-3 text-left">
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isPassed ? "bg-emerald-500 text-white" : isActive ? "bg-[#d8a99a] text-white animate-pulse" : "bg-stone-200 text-stone-500"
                        }`}>
                          {isPassed ? "✓" : s.step}
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${isActive ? "text-stone-800" : isPassed ? "text-emerald-800" : "text-stone-400"}`}>
                            {s.label}
                          </p>
                          <p className={`text-xs ${isActive ? "text-stone-600 font-medium" : isPassed ? "text-emerald-700" : "text-stone-400"}`}>
                            {s.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Waiting State */}
            {!isPending && !results && (
              <div className="rounded-2xl border border-dashed border-[#ead7ca] bg-[#fbf2ea]/92 p-8 text-center flex flex-col items-center justify-center min-h-125">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1e1d6] text-stone-500 mb-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-stone-700">No Patient Analyzed Yet</h3>
                <p className="mt-1.5 text-sm text-stone-400 max-w-xs leading-relaxed">
                  Fill in the metrics on the left, or click a demo scenario to see the AI collaboration in action.
                </p>
              </div>
            )}

            {/* Orchestration Results */}
            {!isPending && results && (
              <div className="space-y-6">
                
                {/* Visual Risk Indicator Banner */}
                <div className={`rounded-2xl border ${risk.border} ${risk.bg} p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm`}>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Risk Assessment</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${risk.dot}`} />
                      <h3 className={`text-xl font-bold ${risk.text}`}>
                        {results.manager.overall_risk_level} Risk Level
                      </h3>
                    </div>
                    <p className="text-sm mt-1 text-stone-500 font-medium">
                      Orchestrated priority: <span className="font-semibold text-stone-800">{results.manager.priority_level}</span>
                    </p>
                  </div>
                  <div className="bg-[#fff7f1]/85 backdrop-blur-sm rounded-xl px-4 py-3 border border-[#ead7ca] shadow-sm text-center min-w-25">
                    <span className="text-xs text-stone-400 block font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-stone-800">{Math.round(results.manager.overall_risk_score)}%</span>
                  </div>
                </div>

                {/* Main Results Board */}
                <div className="rounded-2xl border border-stone-200 bg-[#fff8ef]/92 shadow-sm overflow-hidden">
                  
                  {/* Tabs */}
                  <div className="flex border-b border-stone-200 bg-[#f6e8dc] text-xs font-semibold uppercase tracking-widest text-stone-500 overflow-x-auto">
                    {[
                      { id: "summary", label: "Executive Plan" },
                      { id: "health", label: "Health Agent" },
                      { id: "safety", label: "Safety Agent" },
                      { id: "care", label: "Care Agent" },
                      { id: "manager", label: "Manager Agent" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-4 border-r border-stone-200 font-bold transition-colors cursor-pointer shrink-0 ${
                          activeTab === tab.id ? "bg-[#fff7f1] text-stone-800 border-b-2 border-b-[#d8a99a]" : "hover:bg-[#f1ddd0]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  <div className="p-6">
                    
                    {/* Tab: Summary */}
                    {activeTab === "summary" && (
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Executive Summary</p>
                          <p className="mt-2 text-base font-semibold text-stone-900 leading-7">
                            {results.manager.executive_summary}
                          </p>
                        </div>

                        <div className="border-t border-stone-100 pt-5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Recommended Actions</p>
                          <ul className="mt-3 space-y-2">
                            {results.manager.recommended_actions.map((act: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t border-stone-100 pt-5">
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Care Plan Target</p>
                          <div className="mt-3 rounded-xl border border-[#ead7ca] bg-[#fbf2ea] p-4 text-sm text-stone-800 leading-relaxed font-medium">
                            {results.manager.care_plan}
                          </div>
                        </div>

                        {results.manager.required_followups?.length > 0 && (
                          <div className="border-t border-stone-100 pt-5">
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Required Follow-ups</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {results.manager.required_followups.map((f: string, idx: number) => (
                                <span key={idx} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 border border-stone-200">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab: Health Agent */}
                    {activeTab === "health" && (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                          <div>
                            <span className="text-xs text-stone-400 block uppercase tracking-wider font-semibold">Agent Label</span>
                            <span className="text-sm font-bold text-stone-800">{results.health.agent}</span>
                          </div>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            RISK_THEMES[results.health.risk_level]?.bg} ${RISK_THEMES[results.health.risk_level]?.text} ${RISK_THEMES[results.health.risk_level]?.border
                          }`}>
                            {results.health.risk_level}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl border border-stone-200 p-4 text-center">
                            <span className="text-xs text-stone-400 block font-medium">Wellness Adherence</span>
                            <span className="text-xl font-bold text-indigo-600 block mt-1">{results.health.medication_adherence}%</span>
                          </div>
                          <div className="rounded-xl border border-stone-200 p-4 text-center">
                            <span className="text-xs text-stone-400 block font-medium">Calculated Risk Score</span>
                            <span className="text-xl font-bold text-stone-800 block mt-1">{results.health.risk_score}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Vitals & Trend Analysis</p>
                          <ul className="mt-2 space-y-2">
                            {results.health.trend_analysis.map((trend: string, idx: number) => (
                              <li key={idx} className="text-sm text-stone-600 leading-relaxed bg-stone-50/50 border border-stone-100 rounded-lg px-3 py-2">
                                {trend}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Escalation Trigger</p>
                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                            <span className={`h-2.5 w-2.5 rounded-full ${results.health.escalation_required ? "bg-rose-500" : "bg-emerald-500"}`} />
                            {results.health.escalation_required ? "Escalation requested" : "Escalation not required"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab: Safety Agent */}
                    {activeTab === "safety" && (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                          <div>
                            <span className="text-xs text-stone-400 block uppercase tracking-wider font-semibold">Agent Label</span>
                            <span className="text-sm font-bold text-stone-800">{results.safety.agent}</span>
                          </div>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            RISK_THEMES[results.safety.severity]?.bg} ${RISK_THEMES[results.safety.severity]?.text} ${RISK_THEMES[results.safety.severity]?.border
                          }`}>
                            {results.safety.severity}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl border border-stone-200 p-4">
                            <span className="text-xs text-stone-400 block font-medium">Incident Detected</span>
                            <span className="text-sm font-bold text-stone-800 block mt-1">
                              {results.safety.incident_detected ? results.safety.incident_type : "No abnormalities"}
                            </span>
                          </div>
                          <div className="rounded-xl border border-stone-200 p-4">
                            <span className="text-xs text-stone-400 block font-medium">Emergency Level</span>
                            <span className="text-sm font-bold text-stone-800 block mt-1">Level {results.safety.emergency_level} / 4</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Safety Findings</p>
                          <p className="mt-2 text-sm text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                            {results.safety.executive_summary}
                          </p>
                        </div>

                        {results.safety.detected_risks?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Detected Safety Risks</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {results.safety.detected_risks.map((risk: string, idx: number) => (
                                <span key={idx} className="rounded-full bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold">
                                  {risk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab: Care Agent */}
                    {activeTab === "care" && (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                          <div>
                            <span className="text-xs text-stone-400 block uppercase tracking-wider font-semibold">Agent Label</span>
                            <span className="text-sm font-bold text-stone-800">{results.care.agent}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-700">{results.care.execution_status}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl border border-stone-200 p-4">
                            <span className="text-xs text-stone-400 block font-medium">Assigned Nurse/Caregiver</span>
                            <span className="text-sm font-bold text-stone-800 block mt-1">
                              {results.care.assigned_caregiver ? `${results.care.assigned_caregiver.fullName} (${results.care.assigned_caregiver.relationship})` : "Unassigned"}
                            </span>
                          </div>
                          <div className="rounded-xl border border-stone-200 p-4">
                            <span className="text-xs text-stone-400 block font-medium">Coordination Priority</span>
                            <span className="text-sm font-bold text-stone-800 block mt-1">{results.care.priority_level}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Pending Tasks</p>
                          <ul className="mt-2 space-y-2">
                            {results.care.pending_tasks.map((task: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2.5 text-sm text-stone-600 bg-stone-50 border border-stone-100 rounded-lg px-3 py-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {results.care.family_notifications?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Family Notification Signals</p>
                            <ul className="mt-2 space-y-1.5">
                              {results.care.family_notifications.map((notif: string, idx: number) => (
                                <li key={idx} className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                                  "{notif}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab: Manager Agent */}
                    {activeTab === "manager" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                          <div>
                            <span className="text-xs text-stone-400 block uppercase tracking-wider font-semibold">Agent Label</span>
                            <span className="text-sm font-bold text-stone-800">{results.manager.agent}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-700">Orchestrator Hub</span>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Critical Findings</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {results.manager.critical_findings.map((finding: string, idx: number) => (
                              <span key={idx} className="rounded-full bg-orange-50 border border-orange-200 text-orange-800 px-3 py-1 text-xs font-semibold">
                                {finding}
                              </span>
                            ))}
                            {results.manager.critical_findings.length === 0 && (
                              <span className="text-sm text-stone-400 italic">No critical anomalies registered.</span>
                            )}
                          </div>
                        </div>

                        <div className="border-t border-stone-100 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Raw Orchestrated Output</p>
                          <pre className="mt-2 text-left bg-stone-900 text-stone-200 text-xs font-mono p-4 rounded-xl overflow-x-auto max-h-75">
                            {JSON.stringify(results.manager, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

          </section>

        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
