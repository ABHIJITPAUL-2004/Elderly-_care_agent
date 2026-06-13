import { z } from "zod";

import { chatWithOllama, OLLAMA_MODEL } from "@/lib/services/ollama";

export const liveAnalysisFormSchema = z.object({
  fullName: z.string().trim().min(1, "Patient name is required"),
  age: z.coerce.number().int().min(0, "Age must be positive").max(130, "Age must be realistic (less than 130)"),
  gender: z.enum(["Male", "Female", "Other", "Unknown"]).default("Unknown"),
  conditions: z.string().optional().default(""),
  medications: z.string().optional().default(""),
  heartRate: z.coerce.number().int().min(35, "Heart rate must be at least 35 bpm").max(180, "Heart rate must be at most 180 bpm"),
  bloodPressure: z.string().trim().regex(/^\d{2,3}\/\d{2,3}$/, "Blood pressure must be in Systolic/Diastolic format (e.g., 120/80)"),
  oxygenSaturation: z.coerce.number().int().min(50, "Oxygen saturation must be at least 50%").max(100, "Oxygen saturation must be at most 100%"),
  dailyActivityLevel: z.string().trim().min(1, "Daily activity level is required"),
  sleepQuality: z.coerce.number().min(0, "Sleep hours cannot be negative").max(24, "Sleep hours cannot exceed 24 hours"),
  medicationAdherence: z.coerce.number().min(0, "Adherence cannot be less than 0%").max(100, "Adherence cannot exceed 100%"),
  previousFalls: z.coerce.number().int().nonnegative("Previous falls must be a non-negative number").default(0),
  mobilityStatus: z.string().trim().min(1, "Mobility status is required"),
  additionalNotes: z.string().optional().default(""),
});

export type LiveAnalysisFormInput = z.infer<typeof liveAnalysisFormSchema>;

type NormalizationResult =
  | { success: true; data: LiveAnalysisFormInput }
  | { success: false; details: Record<string, string[]> };

const GENDER_SYNONYMS: Record<string, LiveAnalysisFormInput["gender"]> = {
  m: "Male",
  male: "Male",
  man: "Male",
  boy: "Male",
  f: "Female",
  female: "Female",
  woman: "Female",
  girl: "Female",
  other: "Other",
  nonbinary: "Other",
  non_binary: "Other",
  nb: "Other",
  unknown: "Unknown",
  unsaid: "Unknown",
  "not sure": "Unknown",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean).join(", ");
  }

  return normalizeText(value);
}

function normalizeGender(value: unknown): LiveAnalysisFormInput["gender"] {
  const normalized = normalizeText(value).toLowerCase().replace(/[._-]/g, " ").trim();
  return GENDER_SYNONYMS[normalized] ?? GENDER_SYNONYMS[normalized.replace(/\s+/g, " ")] ?? "Unknown";
}

function extractNumericValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = normalizeText(value).toLowerCase();
  if (!text) {
    return Number.NaN;
  }

  const percentMatch = text.match(/-?\d+(?:\.\d+)?/);
  if (percentMatch) {
    return Number.parseFloat(percentMatch[0]);
  }

  return Number.NaN;
}

function normalizeBloodPressure(value: unknown) {
  const text = normalizeText(value).toLowerCase();

  if (!text) {
    return "";
  }

  const directMatch = text.match(/(\d{2,3})\s*(?:\/|x|\-|by|over)\s*(\d{2,3})/i);
  if (directMatch) {
    return `${directMatch[1]}/${directMatch[2]}`;
  }

  const spacedMatch = text.match(/(\d{2,3})\s+(\d{2,3})/i);
  if (spacedMatch) {
    return `${spacedMatch[1]}/${spacedMatch[2]}`;
  }

  return text;
}

function buildHeuristicCandidate(rawBody: unknown) {
  if (!isRecord(rawBody)) {
    if (typeof rawBody === "string") {
      return {
        fullName: "",
        age: "",
        gender: "Unknown",
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
        additionalNotes: rawBody,
      };
    }

    return {};
  }

  const candidate = {
    fullName: normalizeText(rawBody.fullName),
    age: extractNumericValue(rawBody.age),
    gender: normalizeGender(rawBody.gender),
    conditions: normalizeStringList(rawBody.conditions),
    medications: normalizeStringList(rawBody.medications),
    heartRate: extractNumericValue(rawBody.heartRate),
    bloodPressure: normalizeBloodPressure(rawBody.bloodPressure),
    oxygenSaturation: extractNumericValue(rawBody.oxygenSaturation ?? rawBody.spo2 ?? rawBody.o2),
    dailyActivityLevel: normalizeText(rawBody.dailyActivityLevel ?? rawBody.activityLevel ?? rawBody.activity),
    sleepQuality: extractNumericValue(rawBody.sleepQuality ?? rawBody.sleepHours),
    medicationAdherence: extractNumericValue(rawBody.medicationAdherence ?? rawBody.adherence),
    previousFalls: extractNumericValue(rawBody.previousFalls ?? rawBody.falls ?? 0),
    mobilityStatus: normalizeText(rawBody.mobilityStatus ?? rawBody.mobility),
    additionalNotes: normalizeText(rawBody.additionalNotes ?? rawBody.notes ?? rawBody.summary),
  };

  return candidate;
}

async function repairWithOllama(rawBody: unknown, fieldErrors: Record<string, string[]>) {
  const content = await chatWithOllama({
    model: OLLAMA_MODEL,
    temperature: 0.1,
    format: "json",
    messages: [
      {
        role: "system",
        content:
          "You convert messy eldercare intake data into a strict JSON object. Infer the most likely meaning of casual, misspelled, or out-of-range inputs. Return only a JSON object with these keys: fullName, age, gender, conditions, medications, heartRate, bloodPressure, oxygenSaturation, dailyActivityLevel, sleepQuality, medicationAdherence, previousFalls, mobilityStatus, additionalNotes. Use age as an integer 0-130. Use bloodPressure in systolic/diastolic format like 120/80. Use gender as Male, Female, Other, or Unknown. Put any uncertainty in additionalNotes.",
      },
      {
        role: "user",
        content: JSON.stringify({ rawBody, fieldErrors }, null, 2),
      },
    ],
  });

  return JSON.parse(content) as unknown;
}

export async function normalizeLiveAnalysisInput(rawBody: unknown): Promise<NormalizationResult> {
  const heuristicCandidate = buildHeuristicCandidate(rawBody);
  const firstPass = liveAnalysisFormSchema.safeParse(heuristicCandidate);

  if (firstPass.success) {
    return { success: true, data: firstPass.data };
  }

  try {
    const repairedCandidate = await repairWithOllama(rawBody, firstPass.error.flatten().fieldErrors);
    const secondPass = liveAnalysisFormSchema.safeParse(repairedCandidate);

    if (secondPass.success) {
      return { success: true, data: secondPass.data };
    }

    return { success: false, details: secondPass.error.flatten().fieldErrors };
  } catch {
    return { success: false, details: firstPass.error.flatten().fieldErrors };
  }
}