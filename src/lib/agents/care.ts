import "server-only";

import { z } from "zod";

import {
  careAgentResponseSchema,
  caregiverSchema,
  healthRecordSchema,
  incidentSchema,
  medicationSchema,
  patientSchema,
  safetyAgentResponseSchema,
  healthAgentResponseSchema,
} from "@/types";
import type { CareAgentResponse, HealthAgentResponse, SafetyAgentResponse } from "@/types";
import { CARE_AGENT_PROMPT, PROJECT_CONTEXT } from "@/prompts";
import { MAX_CONTEXT_RECORDS } from "./constants";
import { buildPatientContext } from "./context";
import { executeStructuredAgent } from "./framework";

export const careAgentInputSchema = z.strictObject({
  patient: patientSchema,
  health: healthAgentResponseSchema,
  safety: safetyAgentResponseSchema,
  caregivers: z.array(caregiverSchema),
  medications: z.array(medicationSchema),
  healthRecords: z.array(healthRecordSchema),
  incidents: z.array(incidentSchema),
});

export type CareAgentInput = z.infer<typeof careAgentInputSchema>;

const careSystemPrompt = `${PROJECT_CONTEXT}\n\n${CARE_AGENT_PROMPT}`;

export async function executeCareAgent(input: CareAgentInput): Promise<CareAgentResponse> {
  return executeStructuredAgent({
    name: "Care Coordination Agent",
    systemPrompt: careSystemPrompt,
    inputSchema: careAgentInputSchema,
    outputSchema: careAgentResponseSchema,
    buildUserMessage: (value) =>
      JSON.stringify({
        patient: value.patient,
        health: value.health,
        safety: value.safety,
        caregivers: value.caregivers,
        medications: value.medications,
        healthRecords: value.healthRecords.slice(0, MAX_CONTEXT_RECORDS),
        incidents: value.incidents.slice(0, MAX_CONTEXT_RECORDS),
      }),
  }, input);
}

export async function runCareAgentForPatient(patientId: string, health: HealthAgentResponse, safety: SafetyAgentResponse) {
  const context = buildPatientContext(patientId);

  return executeCareAgent({
    patient: context.patient,
    health,
    safety,
    caregivers: context.caregivers,
    medications: context.medications,
    healthRecords: context.healthRecords,
    incidents: context.incidents,
  });
}
