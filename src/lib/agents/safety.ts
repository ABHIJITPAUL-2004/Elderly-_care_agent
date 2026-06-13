import "server-only";

import { z } from "zod";

import { healthRecordSchema, incidentSchema, patientSchema, safetyAgentResponseSchema } from "@/types";
import type { SafetyAgentResponse } from "@/types";
import { SAFETY_AGENT_PROMPT, PROJECT_CONTEXT } from "@/prompts";
import { MAX_CONTEXT_RECORDS } from "./constants";
import { buildPatientContext } from "./context";
import { executeStructuredAgent } from "./framework";

export const safetyAgentInputSchema = z.strictObject({
  patient: patientSchema,
  healthRecords: z.array(healthRecordSchema),
  incidents: z.array(incidentSchema),
});

export type SafetyAgentInput = z.infer<typeof safetyAgentInputSchema>;

const safetySystemPrompt = `${PROJECT_CONTEXT}\n\n${SAFETY_AGENT_PROMPT}`;

export async function executeSafetyAgent(input: SafetyAgentInput): Promise<SafetyAgentResponse> {
  return executeStructuredAgent({
    name: "Safety & Emergency Agent",
    systemPrompt: safetySystemPrompt,
    inputSchema: safetyAgentInputSchema,
    outputSchema: safetyAgentResponseSchema,
    buildUserMessage: (value) =>
      JSON.stringify({
        patient: value.patient,
        healthRecords: value.healthRecords.slice(0, MAX_CONTEXT_RECORDS),
        incidents: value.incidents.slice(0, MAX_CONTEXT_RECORDS),
        movementData: value.healthRecords.slice(0, 3).map((record) => ({
          recordedAt: record.recordedAt,
          steps: record.steps,
          activitySummary: record.activitySummary,
        })),
      }),
  }, input);
}

export async function runSafetyAgentForPatient(patientId: string) {
  const context = buildPatientContext(patientId);

  return executeSafetyAgent({
    patient: context.patient,
    healthRecords: context.healthRecords,
    incidents: context.incidents,
  });
}
