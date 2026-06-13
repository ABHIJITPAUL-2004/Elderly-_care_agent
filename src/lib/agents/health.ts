import "server-only";

import { z } from "zod";

import { healthAgentResponseSchema, incidentSchema, medicationSchema, patientSchema, healthRecordSchema } from "@/types";
import type { HealthAgentResponse } from "@/types";
import { HEALTH_AGENT_PROMPT, PROJECT_CONTEXT } from "@/prompts";
import { MAX_CONTEXT_RECORDS } from "./constants";
import { buildPatientContext } from "./context";
import { executeStructuredAgent } from "./framework";

export const healthAgentInputSchema = z.strictObject({
  patient: patientSchema,
  healthRecords: z.array(healthRecordSchema),
  medications: z.array(medicationSchema),
  incidents: z.array(incidentSchema),
});

export type HealthAgentInput = z.infer<typeof healthAgentInputSchema>;

const healthSystemPrompt = `${PROJECT_CONTEXT}\n\n${HEALTH_AGENT_PROMPT}`;

export async function executeHealthAgent(input: HealthAgentInput): Promise<HealthAgentResponse> {
  return executeStructuredAgent({
    name: "Health & Wellness Agent",
    systemPrompt: healthSystemPrompt,
    inputSchema: healthAgentInputSchema,
    outputSchema: healthAgentResponseSchema,
    buildUserMessage: (value) =>
      JSON.stringify({
        patient: value.patient,
        medications: value.medications,
        healthRecords: value.healthRecords.slice(0, MAX_CONTEXT_RECORDS),
        incidents: value.incidents.slice(0, MAX_CONTEXT_RECORDS),
      }),
  }, input);
}

export async function runHealthAgentForPatient(patientId: string) {
  const context = buildPatientContext(patientId);

  return executeHealthAgent({
    patient: context.patient,
    healthRecords: context.healthRecords,
    medications: context.medications,
    incidents: context.incidents,
  });
}
