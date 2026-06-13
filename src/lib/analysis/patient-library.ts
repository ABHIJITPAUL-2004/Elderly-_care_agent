import "server-only";

import { readFile } from "fs/promises";
import path from "path";

import { averageNumber, uniqueStrings } from "@/lib/utils";
import type { LiveAnalysisFormInput } from "./live-analysis";

type PatientLibraryEntry = {
  id: string;
  age: number;
  gender: LiveAnalysisFormInput["gender"];
  conditions: string[];
  medications: string[];
  heartRate: number;
  bloodPressure: string;
  oxygenSaturation: number;
  dailyActivityLevel: string;
  sleepQuality: number;
  medicationAdherence: number;
  previousFalls: number;
  mobilityStatus: string;
  notes: string;
};

type SimilarCase = PatientLibraryEntry & { score: number };

let patientLibraryCache: PatientLibraryEntry[] | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function extractBloodPressureNumbers(value: string) {
  const match = value.match(/(\d{2,3})\s*(?:\/|x|\-|by|over)\s*(\d{2,3})/i);

  if (!match) {
    return null;
  }

  return { systolic: Number(match[1]), diastolic: Number(match[2]) };
}

async function loadPatientLibrary() {
  if (patientLibraryCache) {
    return patientLibraryCache;
  }

  const libraryPath = path.join(process.cwd(), "public", "custom-patient-library.json");
  const raw = await readFile(libraryPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("Custom patient library is malformed.");
  }

  patientLibraryCache = parsed.filter(isRecord).map((entry, index) => ({
    id: String(entry.id ?? `library-${index}`),
    age: Number(entry.age ?? 0),
    gender: (entry.gender as LiveAnalysisFormInput["gender"]) ?? "Unknown",
    conditions: Array.isArray(entry.conditions) ? entry.conditions.map(String) : [],
    medications: Array.isArray(entry.medications) ? entry.medications.map(String) : [],
    heartRate: Number(entry.heartRate ?? 0),
    bloodPressure: String(entry.bloodPressure ?? "120/80"),
    oxygenSaturation: Number(entry.oxygenSaturation ?? 98),
    dailyActivityLevel: String(entry.dailyActivityLevel ?? "Routine activity"),
    sleepQuality: Number(entry.sleepQuality ?? 7),
    medicationAdherence: Number(entry.medicationAdherence ?? 90),
    previousFalls: Number(entry.previousFalls ?? 0),
    mobilityStatus: String(entry.mobilityStatus ?? "Independent"),
    notes: String(entry.notes ?? ""),
  }));

  return patientLibraryCache;
}

function scoreSimilarCase(form: LiveAnalysisFormInput, entry: PatientLibraryEntry) {
  let score = 0;

  score += Math.max(0, 20 - Math.abs(entry.age - form.age) / 2);
  score += entry.gender === form.gender ? 10 : 0;

  const conditions = new Set(normalizeTokens(form.conditions).concat(normalizeTokens(entry.conditions.join(" "))));
  const medications = new Set(normalizeTokens(form.medications).concat(normalizeTokens(entry.medications.join(" "))));

  const formConditionTokens = normalizeTokens(form.conditions);
  const formMedicationTokens = normalizeTokens(form.medications);

  score += formConditionTokens.filter((token) => conditions.has(token)).length * 6;
  score += formMedicationTokens.filter((token) => medications.has(token)).length * 5;

  const bp = extractBloodPressureNumbers(form.bloodPressure);
  const entryBp = extractBloodPressureNumbers(entry.bloodPressure);

  if (bp && entryBp) {
    score += Math.max(0, 18 - Math.abs(bp.systolic - entryBp.systolic) / 8);
    score += Math.max(0, 12 - Math.abs(bp.diastolic - entryBp.diastolic) / 8);
  }

  score += Math.max(0, 10 - Math.abs(entry.heartRate - form.heartRate) / 4);
  score += Math.max(0, 12 - Math.abs(entry.oxygenSaturation - form.oxygenSaturation));
  score += Math.max(0, 12 - Math.abs(entry.medicationAdherence - form.medicationAdherence) / 3);
  score += Math.max(0, 8 - Math.abs(entry.previousFalls - form.previousFalls) * 3);

  if (entry.dailyActivityLevel.toLowerCase().includes(form.dailyActivityLevel.split(" ")[0]?.toLowerCase() ?? "")) {
    score += 4;
  }

  return score;
}

export async function getSimilarPatientCases(form: LiveAnalysisFormInput, limit = 3): Promise<SimilarCase[]> {
  const library = await loadPatientLibrary();

  return library
    .map((entry) => ({ ...entry, score: scoreSimilarCase(form, entry) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export async function buildPatientReferenceSummary(form: LiveAnalysisFormInput) {
  const similarCases = await getSimilarPatientCases(form, 3);

  if (similarCases.length === 0) {
    return "No close reference cases were available, so the review is based on the submitted vitals and symptoms alone.";
  }

  const caseSummary = similarCases
    .map((entry, index) => `${index + 1}) Age ${entry.age}, ${entry.gender}, ${entry.conditions.slice(0, 2).join(" / ") || "general eldercare pattern"}, adherence ${Math.round(entry.medicationAdherence)}%, mobility: ${entry.mobilityStatus}`)
    .join("; ");

  return `Reference matches from the patient library: ${caseSummary}.`;
}

function determineRiskLevel(score: number) {
  if (score >= 75) return "CRITICAL" as const;
  if (score >= 50) return "HIGH" as const;
  if (score >= 25) return "MODERATE" as const;
  return "LOW" as const;
}

function determinePriorityLevel(riskLevel: ReturnType<typeof determineRiskLevel>, escalation: boolean) {
  if (riskLevel === "CRITICAL") return "CRITICAL" as const;
  if (riskLevel === "HIGH") return "HIGH" as const;
  if (escalation) return "HIGH" as const;
  return riskLevel === "MODERATE" ? "MEDIUM" as const : "LOW" as const;
}

function buildHealthFallback(form: LiveAnalysisFormInput, referenceSummary: string) {
  const bpParts = form.bloodPressure.split("/");
  const systolic = Number(bpParts[0]) || 120;
  const diastolic = Number(bpParts[1]) || 80;

  let score = 15;
  if (systolic > 140 || diastolic > 90) score += 20;
  if (systolic > 165 || diastolic > 100) score += 20;
  if (form.heartRate > 100 || form.heartRate < 60) score += 15;
  if (form.oxygenSaturation < 95) score += 25;
  if (form.medicationAdherence < 80) score += 15;
  if (form.previousFalls > 0) score += 20;

  const riskLevel = determineRiskLevel(score);

  return {
    agent: "Health & Wellness Agent" as const,
    health_status: `Health review for ${form.fullName}: BP ${form.bloodPressure}, HR ${form.heartRate} bpm, SpO2 ${form.oxygenSaturation}%, adherence ${form.medicationAdherence}%. ${referenceSummary}`,
    risk_level: riskLevel,
    risk_score: Math.min(score, 100),
    medication_adherence: form.medicationAdherence,
    issues: uniqueStrings([
      ...(form.conditions ? form.conditions.split(",").map((item) => item.trim()).filter(Boolean) : []),
      form.oxygenSaturation < 95 ? "Low oxygen saturation" : "",
      form.medicationAdherence < 80 ? "Medication adherence is below target" : "",
      form.previousFalls > 0 ? "History of recent falls" : "",
    ]),
    trend_analysis: uniqueStrings([
      `Blood pressure is ${systolic > 140 || diastolic > 90 ? "elevated" : "within a manageable range"}.`,
      `Pulse is ${form.heartRate > 100 || form.heartRate < 60 ? "outside the ideal range" : "stable"}.`,
      `Sleep quality is ${form.sleepQuality >= 7 ? "supportive" : "somewhat limited"}.`,
    ]),
    recommendations: uniqueStrings([
      referenceSummary,
      "Continue close home monitoring of vitals and daily activity.",
      form.oxygenSaturation < 95 ? "Confirm respiratory status and oxygen support needs." : "Recheck oxygen saturation at the next monitoring interval.",
      form.medicationAdherence < 90 ? "Review medication timing and adherence reminders." : "Maintain the current medication routine.",
    ]),
    escalation_required: riskLevel !== "LOW",
    notify_agents: riskLevel === "LOW" ? ["Care Coordination Agent"] : ["Safety & Emergency Agent", "AI Care Manager"],
    executive_summary: `${form.fullName}'s health review suggests a ${riskLevel.toLowerCase()} risk profile. The most important focus areas are blood pressure, oxygen saturation, and adherence support.`,
  };
}

function buildSafetyFallback(form: LiveAnalysisFormInput, health: ReturnType<typeof buildHealthFallback>) {
  const incidentDetected = form.previousFalls > 0 || form.oxygenSaturation < 93 || health.risk_level !== "LOW";

  return {
    agent: "Safety & Emergency Agent" as const,
    incident_detected: incidentDetected,
    incident_type: form.previousFalls > 0 ? "Fall history monitoring" : form.oxygenSaturation < 93 ? "Oxygen saturation warning" : "No active incident",
    emergency_level: form.oxygenSaturation < 93 ? 3 : form.previousFalls > 1 ? 2 : 0,
    fall_risk_score: Math.min(100, Math.round(health.risk_score)),
    severity: health.risk_level,
    detected_risks: uniqueStrings([
      form.previousFalls > 0 ? "Fall history" : "",
      form.oxygenSaturation < 93 ? "Hypoxia" : "",
      form.mobilityStatus.toLowerCase().includes("wheel") || form.mobilityStatus.toLowerCase().includes("walker") ? "Mobility limitation" : "",
    ]),
    recommended_actions: uniqueStrings([
      form.previousFalls > 0 ? "Review floor hazards and transfer safety." : "Keep observing walking stability.",
      form.oxygenSaturation < 93 ? "Check for respiratory symptoms and consider urgent review." : "Track oxygen saturation during the day.",
      "Notify the care team if symptoms worsen.",
    ]),
    escalation_required: incidentDetected,
    notify_agents: incidentDetected ? ["AI Care Manager", "Care Coordination Agent"] : ["Care Coordination Agent"],
    executive_summary: incidentDetected
      ? `Safety review for ${form.fullName} indicates elevated monitoring needs because of mobility, oxygen, or fall-history concerns.`
      : `Safety review for ${form.fullName} does not show an active incident right now.`,
  };
}

function buildCareFallback(form: LiveAnalysisFormInput, health: ReturnType<typeof buildHealthFallback>, safety: ReturnType<typeof buildSafetyFallback>) {
  const priority = determinePriorityLevel(health.risk_level, safety.escalation_required);
  const familyNotifications = safety.escalation_required
    ? [`Please review ${form.fullName}'s status and medication timing today.`]
    : [`${form.fullName} remains stable and can be monitored on the usual schedule.`];

  return {
    agent: "Care Coordination Agent" as const,
    priority_level: priority,
    care_actions: uniqueStrings([
      "Maintain daily check-ins and observe mobility changes.",
      health.medication_adherence < 90 ? "Strengthen medication reminder support." : "Keep the current medication routine.",
      safety.escalation_required ? "Prepare an escalation-ready contact plan." : "Continue routine family coordination.",
    ]),
    assigned_caregiver: null,
    family_notifications: familyNotifications,
    appointments: [],
    pending_tasks: uniqueStrings([
      "Coordinate the next care review.",
      safety.escalation_required ? "Share the updated monitoring summary with family." : "Reconfirm support schedule.",
    ]),
    execution_status: safety.escalation_required ? "URGENT" : "MONITORING",
    notify_agents: safety.escalation_required ? ["AI Care Manager"] : ["Health & Wellness Agent"],
    executive_summary: `Care review for ${form.fullName} keeps the plan simple: monitor vitals, support medication timing, and adjust family communication as needed.`,
  };
}

function buildManagerFallback(form: LiveAnalysisFormInput, health: ReturnType<typeof buildHealthFallback>, safety: ReturnType<typeof buildSafetyFallback>, care: ReturnType<typeof buildCareFallback>) {
  const overallRiskScore = averageNumber([health.risk_score, safety.emergency_level * 20, form.previousFalls * 10, form.oxygenSaturation < 95 ? 15 : 0]);
  const overallRiskLevel = determineRiskLevel(overallRiskScore);

  return {
    agent: "AI Care Manager" as const,
    overall_risk_level: overallRiskLevel,
    overall_risk_score: overallRiskScore,
    priority_level: determinePriorityLevel(overallRiskLevel, safety.escalation_required),
    critical_findings: uniqueStrings([
      ...(health.issues ?? []),
      ...(safety.detected_risks ?? []),
    ]),
    recommended_actions: uniqueStrings([
      ...(health.recommendations ?? []),
      ...(safety.recommended_actions ?? []),
      ...(care.care_actions ?? []),
    ]),
    required_followups: uniqueStrings([
      "Review the patient within the next care window.",
      safety.escalation_required ? "Confirm emergency contact readiness." : "Maintain routine monitoring.",
    ]),
    care_plan: `Keep ${form.fullName} on a simple, easy-to-follow plan: monitor vitals, support medications, and recheck mobility and breathing regularly.`,
    executive_summary: `${form.fullName} receives a plain-language care review with practical next steps. The plan is designed to be easy for family and staff to follow.`,
  };
}

export async function buildFallbackLiveAnalysisResponse(form: LiveAnalysisFormInput) {
  const referenceSummary = await buildPatientReferenceSummary(form);
  const health = buildHealthFallback(form, referenceSummary);
  const safety = buildSafetyFallback(form, health);
  const care = buildCareFallback(form, health, safety);
  const manager = buildManagerFallback(form, health, safety, care);

  return {
    patient: {
      id: "live-patient-virtual",
      fullName: form.fullName,
      preferredName: form.fullName.split(" ")[0] ?? form.fullName,
      dateOfBirth: `${new Date().getFullYear() - form.age}-01-01`,
      gender: form.gender,
      language: "English",
      address: "Live Analysis Portal",
      livingArrangement: "Temporary live assessment session.",
      conditions: form.conditions.split(",").map((item) => item.trim()).filter(Boolean),
      allergies: [],
      medicationIds: form.medications.split(",").map((_, index) => `live-med-${index}`),
      caregiverIds: ["live-cg-1"],
      carePlanIds: [],
      emergencyContactIds: [],
      notes: form.additionalNotes || referenceSummary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    health,
    safety,
    care,
    manager,
  };
}