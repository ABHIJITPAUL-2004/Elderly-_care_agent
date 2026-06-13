import { averageNumber, sortByDateDesc, uniqueStrings } from "@/lib/utils";
import { validatedCaregivers, validatedHealthRecords, validatedIncidents, validatedMedications, validatedPatients } from "@/data";
import type { Caregiver, HealthRecord, Incident, Medication, Patient } from "@/types";
import type { HealthAgentResponse, SafetyAgentResponse, CareAgentResponse, ManagerAgentResponse } from "@/types";

export type DashboardPatient = Patient;

export interface DashboardSnapshot {
  patient: Patient;
  health: HealthAgentResponse;
  safety: SafetyAgentResponse;
  care: CareAgentResponse;
  manager: ManagerAgentResponse;
  healthRecords: HealthRecord[];
  incidents: Incident[];
  medications: Medication[];
  caregivers: Caregiver[];
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  tone: "health" | "safety" | "care" | "manager";
}

function getPrimaryPatient() {
  return validatedPatients[0];
}

function getPatientHealthRecords(patientId: string) {
  return sortByDateDesc(validatedHealthRecords.filter((record) => record.patientId === patientId));
}

function getPatientIncidents(patientId: string) {
  return sortByDateDesc(validatedIncidents.filter((incident) => incident.patientId === patientId));
}

function getPatientMedications(patientId: string) {
  return validatedMedications.filter((medication) => medication.patientId === patientId && medication.active);
}

function getPatientCaregivers(patientId: string) {
  return validatedCaregivers.filter((caregiver) => caregiver.assignedPatientIds.includes(patientId) && caregiver.active);
}

function buildCollections(patientId: string) {
  return {
    healthRecords: getPatientHealthRecords(patientId),
    incidents: getPatientIncidents(patientId),
    medications: getPatientMedications(patientId),
    caregivers: getPatientCaregivers(patientId),
  };
}

export function getDashboardTargetPatientId() {
  return getPrimaryPatient().id;
}

export function buildFallbackDashboardSnapshot(patientId = getDashboardTargetPatientId()): DashboardSnapshot {
  const patient = validatedPatients.find((item) => item.id === patientId) ?? getPrimaryPatient();
  const { healthRecords, incidents, medications, caregivers } = buildCollections(patient.id);
  const latestHealth = healthRecords[0];
  const latestIncident = incidents[0];

  const health: HealthAgentResponse = {
    agent: "Health & Wellness Agent",
    health_status: latestHealth?.healthStatus ?? "Stable",
    risk_level: latestHealth?.riskLevel ?? "LOW",
    risk_score: latestHealth?.riskScore ?? 0,
    medication_adherence: latestHealth?.medicationAdherence ?? 100,
    issues: latestHealth?.issues ?? [],
    trend_analysis: healthRecords.slice(0, 3).map((record, index) => `${index + 1}. ${record.activitySummary}`),
    recommendations: latestHealth?.recommendations ?? [],
    escalation_required: latestHealth?.escalationRequired ?? false,
    notify_agents: latestHealth?.escalationRequired ? ["Safety & Emergency Agent", "AI Care Manager"] : ["Care Coordination Agent"],
    executive_summary: `${patient.fullName}'s health status is ${latestHealth?.riskLevel === "LOW" ? "stable" : "under observation"}.`,
  };

  const safety: SafetyAgentResponse = {
    agent: "Safety & Emergency Agent",
    incident_detected: Boolean(latestIncident && latestIncident.status !== "RESOLVED"),
    incident_type: latestIncident?.incidentType ?? "No abnormality",
    emergency_level: latestIncident?.emergencyLevel ?? 0,
    fall_risk_score: latestHealth?.riskScore ?? 0,
    severity: latestIncident?.severity ?? "LOW",
    detected_risks: latestIncident?.detectedRisks ?? [],
    recommended_actions: latestIncident?.recommendedActions ?? ["Continue normal monitoring"],
    escalation_required: latestIncident?.escalationRequired ?? false,
    notify_agents: latestIncident?.notifyAgents ?? [],
    executive_summary: latestIncident?.description ?? "There are no major safety abnormalities recently.",
  };

  const care: CareAgentResponse = {
    agent: "Care Coordination Agent",
    priority_level: latestIncident?.severity === "CRITICAL" ? "CRITICAL" : latestIncident?.severity === "HIGH" ? "HIGH" : latestHealth?.riskLevel === "MODERATE" ? "MEDIUM" : "LOW",
    care_actions: uniqueStrings([
      ...(latestHealth?.recommendations ?? []),
      ...(latestIncident?.recommendedActions ?? []),
      caregivers.length > 0 ? `Assigned to ${caregivers[0].fullName}` : "No caregiver assigned",
    ]),
    assigned_caregiver: caregivers[0] ?? null,
    family_notifications: [patient.preferredName ?? patient.fullName, latestIncident?.escalationRequired ? "requires information sharing." : "is stable."].filter(Boolean).join(" ") ? [`Updated the status of ${patient.fullName}.`] : [],
    appointments: [],
    pending_tasks: uniqueStrings(["Coordinate next visit", latestIncident?.escalationRequired ? "Contact family" : "Continue normal monitoring"]),
    execution_status: latestIncident?.escalationRequired ? "URGENT" : "MONITORING",
    notify_agents: latestIncident?.escalationRequired ? ["AI Care Manager"] : ["Health & Wellness Agent"],
    executive_summary: `Updated the care plan for ${patient.fullName}.`,
  };

  const manager: ManagerAgentResponse = {
    agent: "AI Care Manager",
    overall_risk_level: latestIncident?.severity === "CRITICAL" ? "CRITICAL" : latestHealth?.riskLevel ?? "LOW",
    overall_risk_score: averageNumber([latestHealth?.riskScore ?? 0, latestIncident?.emergencyLevel ? latestIncident.emergencyLevel * 20 : 0]),
    priority_level: care.priority_level,
    critical_findings: uniqueStrings([...(latestHealth?.issues ?? []), ...(latestIncident?.detectedRisks ?? [])]),
    recommended_actions: uniqueStrings([...(latestHealth?.recommendations ?? []), ...(latestIncident?.recommendedActions ?? []), ...care.care_actions]),
    required_followups: uniqueStrings(["Family coordination", "Continuous monitoring", ...(latestIncident?.escalationRequired ? ["Confirm emergency contact"] : [])]),
    care_plan: `Maintain the integrated care plan for ${patient.fullName}, continuing health observation, safety monitoring, and family coordination.`,
    executive_summary: `${patient.fullName} is ${latestIncident?.escalationRequired ? "requiring attention" : "stable"}.`,
  };

  return {
    patient,
    health,
    safety,
    care,
    manager,
    healthRecords,
    incidents,
    medications,
    caregivers,
  };
}

export function buildActivityFeed(snapshot: DashboardSnapshot): DashboardActivityItem[] {
  const latestHealth = snapshot.healthRecords[0];
  const latestIncident = snapshot.incidents[0];
  const latestMedication = snapshot.medications[0];

  const items: DashboardActivityItem[] = [
    {
      id: "health",
      title: "Health Agent updated risk trend",
      detail: latestHealth ? latestHealth.healthStatus : "Health snapshot refreshed.",
      timestamp: latestHealth?.recordedAt ?? snapshot.patient.updatedAt,
      tone: "health",
    },
    {
      id: "safety",
      title: "Safety Agent reviewed incident signals",
      detail: latestIncident ? latestIncident.incidentType : "No active safety incident.",
      timestamp: latestIncident?.detectedAt ?? snapshot.patient.updatedAt,
      tone: "safety",
    },
    {
      id: "care",
      title: "Care Agent adjusted follow-up tasks",
      detail: snapshot.care.pending_tasks[0] ?? "Routine care monitoring is active.",
      timestamp: snapshot.patient.updatedAt,
      tone: "care",
    },
    {
      id: "manager",
      title: "Manager Agent consolidated the plan",
      detail: snapshot.manager.executive_summary,
      timestamp: snapshot.patient.updatedAt,
      tone: "manager",
    },
    {
      id: "medication",
      title: "Medication adherence cross-check",
      detail: latestMedication ? latestMedication.name : "No active medication data.",
      timestamp: latestMedication?.updatedAt ?? snapshot.patient.updatedAt,
      tone: "health",
    },
  ];

  return items.sort((left, right) => right.timestamp.localeCompare(left.timestamp));
}

export async function loadDashboardSnapshot(patientId = getDashboardTargetPatientId()) {
  const fallbackSnapshot = buildFallbackDashboardSnapshot(patientId);

  return {
    ...fallbackSnapshot,
    ...buildCollections(patientId),
  };
}