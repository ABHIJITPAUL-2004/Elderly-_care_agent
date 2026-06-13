import { NextResponse } from "next/server";
import {
  executeHealthAgent,
  executeSafetyAgent,
  executeCareAgent,
  executeManagerAgent,
} from "@/lib/utils/agents";
import { normalizeLiveAnalysisInput } from "@/lib/analysis/live-analysis";
import { buildFallbackLiveAnalysisResponse, buildPatientReferenceSummary } from "@/lib/analysis/patient-library";
import { createLogger } from "@/lib/utils/logger";
import { createSafeErrorResponse } from "@/lib/utils/errors";

const logger = createLogger("api/analyze/live");

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();

    const normalized = await normalizeLiveAnalysisInput(rawBody);

    if (!normalized.success) {
      const errors = normalized.details;
      logger.warn("Live analysis validation failed", { errors });
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const form = normalized.data;
    logger.info("Live analysis request accepted for patient", { fullName: form.fullName });

    const referenceSummary = await buildPatientReferenceSummary(form);

    // Parse blood pressure
    const bpParts = form.bloodPressure.split("/");
    const systolic = parseInt(bpParts[0], 10) || 120;
    const diastolic = parseInt(bpParts[1], 10) || 80;

    // Approximate DOB from age
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - form.age;
    const dateOfBirth = `${birthYear}-01-01`;

    const nowIso = new Date().toISOString();

    // 1. Construct Virtual Patient Object
    const conditionsArray = form.conditions.split(",").map(c => c.trim()).filter(Boolean);
    const medicationsArray = form.medications.split(",").map(m => m.trim()).filter(Boolean);

    const patient = {
      id: "live-patient-virtual",
      fullName: form.fullName,
      preferredName: form.fullName.split(" ")[0] ?? form.fullName,
      dateOfBirth,
      gender: form.gender,
      language: "English",
      address: "Live Analysis Portal",
      livingArrangement: "Temporary live assessment session.",
      conditions: conditionsArray,
      allergies: [],
      medicationIds: medicationsArray.map((_, idx) => `live-med-${idx}`),
      caregiverIds: ["live-cg-1"],
      carePlanIds: [],
      emergencyContactIds: [],
      notes: form.additionalNotes || "None",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // 2. Construct Virtual Medications list
    const medications = medicationsArray.map((med, index) => ({
      id: `live-med-${index}`,
      patientId: patient.id,
      name: med,
      dosage: "As directed",
      frequency: "Daily",
      reminderTimes: [],
      active: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    }));

    // 3. Construct Virtual Health Record
    // Determine custom baseline risk score
    let baselineScore = 15;
    if (systolic > 140 || diastolic > 90) baselineScore += 20;
    if (systolic > 165 || diastolic > 100) baselineScore += 20;
    if (form.heartRate > 100 || form.heartRate < 60) baselineScore += 15;
    if (form.oxygenSaturation < 95) baselineScore += 25;
    if (form.medicationAdherence < 80) baselineScore += 15;
    if (form.previousFalls > 0) baselineScore += 20;
    baselineScore = Math.min(baselineScore, 100);

    const riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" = baselineScore >= 75 ? "CRITICAL" : baselineScore >= 50 ? "HIGH" : baselineScore >= 25 ? "MODERATE" : "LOW";

    const healthRecord = {
      id: "live-health-record-virtual",
      patientId: patient.id,
      recordedAt: nowIso,
      healthStatus: `Live data submitted. BP: ${form.bloodPressure}, HR: ${form.heartRate} bpm, SpO2: ${form.oxygenSaturation}%, Adherence: ${form.medicationAdherence}%. Activity: ${form.dailyActivityLevel}. Mobility: ${form.mobilityStatus}.`,
      riskLevel,
      riskScore: baselineScore,
      medicationAdherence: form.medicationAdherence,
      systolicBloodPressure: systolic,
      diastolicBloodPressure: diastolic,
      heartRate: form.heartRate,
      bodyTemperatureC: 36.5,
      sleepHours: form.sleepQuality,
      steps: form.dailyActivityLevel.toLowerCase().includes("active") ? 5000 : 800,
      activitySummary: form.dailyActivityLevel,
      issues: conditionsArray,
      recommendations: [referenceSummary, "Review patient's current status and logs."],
      escalationRequired: riskLevel === "CRITICAL" || riskLevel === "HIGH",
      notes: form.additionalNotes || referenceSummary,
    };
    const healthRecords = [healthRecord];

    // 4. Construct Virtual Incidents
    const incidents = [];
    if (form.previousFalls > 0) {
      incidents.push({
        id: "live-incident-fall-virtual",
        patientId: patient.id,
        incidentType: "History of Falls Alert",
        severity: form.previousFalls > 1 ? ("HIGH" as const) : ("MODERATE" as const),
        emergencyLevel: form.previousFalls > 1 ? 2 : 1,
        detectedAt: nowIso,
        location: "Home environment",
        description: `Patient has a history of ${form.previousFalls} fall(s). Gait/mobility status was reported as: ${form.mobilityStatus}`,
        source: "User self-report",
        detectedRisks: ["Fall history", "Mobility impairment"],
        recommendedActions: ["Home hazards assessment", "Mobility aids adjustment"],
        escalationRequired: false,
        notifyAgents: ["Safety & Emergency Agent", "Care Coordination Agent"] as any,
        status: "RESOLVED" as const,
        metadata: {},
      });
    }

    if (form.oxygenSaturation < 93) {
      incidents.push({
        id: "live-incident-hypoxia-virtual",
        patientId: patient.id,
        incidentType: "Oxygen saturation warning",
        severity: "HIGH" as const,
        emergencyLevel: 3,
        detectedAt: nowIso,
        location: "Home",
        description: `Low blood oxygen saturation detected at ${form.oxygenSaturation}%.`,
        source: "Vitals sensor input",
        detectedRisks: ["Hypoxia", "Respiratory distress"],
        recommendedActions: ["Check oxygen equipment", "Provide respiratory relief support"],
        escalationRequired: true,
        notifyAgents: ["Safety & Emergency Agent", "AI Care Manager"] as any,
        status: "OPEN" as const,
        metadata: {},
      });
    }

    // 5. Construct Virtual Caregivers
    const caregivers = [
      {
        id: "live-cg-1",
        fullName: "Kenji Sato",
        relationship: "Primary Nurse Support",
        phoneNumber: "090-9999-8888",
        email: "kenji.sato@example.com",
        role: "Nursing staff",
        languages: ["English", "Japanese"],
        specialties: ["Vital monitoring", "Emergency response"],
        availability: ["24/7"],
        assignedPatientIds: [patient.id],
        active: true,
        notes: "Assigned dynamically during live review session.",
        createdAt: nowIso,
        updatedAt: nowIso,
      },
    ];

    // 6. Invoke sequential multi-agent execution pipeline
    try {
      const healthResult = await executeHealthAgent({
        patient,
        healthRecords,
        medications,
        incidents,
      });

      const safetyResult = await executeSafetyAgent({
        patient,
        healthRecords,
        incidents,
      });

      const careResult = await executeCareAgent({
        patient,
        health: healthResult,
        safety: safetyResult,
        caregivers,
        medications,
        healthRecords,
        incidents,
      });

      const managerResult = await executeManagerAgent({
        patient,
        health: healthResult,
        safety: safetyResult,
        care: careResult,
        healthRecords,
        incidents,
      });

      // 7. Return complete multi-agent response
      return NextResponse.json({
        patient,
        health: healthResult,
        safety: safetyResult,
        care: careResult,
        manager: managerResult,
      });
    } catch (pipelineError) {
      logger.warn("Live analysis pipeline failed, returning fallback review", { pipelineError });
      const fallback = await buildFallbackLiveAnalysisResponse(form);
      return NextResponse.json(fallback);
    }

  } catch (error) {
    logger.error("Live analysis API failed", { error });
    return createSafeErrorResponse(error);
  }
}
