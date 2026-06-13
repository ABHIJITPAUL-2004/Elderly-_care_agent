import "server-only";

import { z } from "zod";

import {
  careAgentResponseSchema,
  healthAgentResponseSchema,
  healthRecordSchema,
  incidentSchema,
  managerAgentResponseSchema,
  patientSchema,
  safetyAgentResponseSchema,
} from "@/types";
import type { ManagerAgentResponse } from "@/types";
import { MANAGER_AGENT_PROMPT, PROJECT_CONTEXT } from "@/prompts";
import { buildPatientContext } from "./context";
import { executeCareAgent } from "./care";
import { executeHealthAgent } from "./health";
import { executeSafetyAgent } from "./safety";
import { executeStructuredAgent } from "./framework";

export const managerAgentInputSchema = z.strictObject({
  patient: patientSchema,
  health: healthAgentResponseSchema,
  safety: safetyAgentResponseSchema,
  care: careAgentResponseSchema,
  healthRecords: z.array(healthRecordSchema),
  incidents: z.array(incidentSchema),
});

export type ManagerAgentInput = z.infer<typeof managerAgentInputSchema>;

const managerSystemPrompt = `${PROJECT_CONTEXT}\n\n${MANAGER_AGENT_PROMPT}`;

export async function executeManagerAgent(input: ManagerAgentInput): Promise<ManagerAgentResponse> {
  return executeStructuredAgent({
    name: "AI Care Manager",
    systemPrompt: managerSystemPrompt,
    inputSchema: managerAgentInputSchema,
    outputSchema: managerAgentResponseSchema,
    buildUserMessage: (value) =>
      JSON.stringify({
        patient: value.patient,
        health: value.health,
        safety: value.safety,
        care: value.care,
        healthRecords: value.healthRecords.slice(0, 5),
        incidents: value.incidents.slice(0, 5),
      }),
  }, input);
}

export async function executeYorisoiAgentPipeline(patientId: string) {
  const context = buildPatientContext(patientId);

  const [health, safety] = await Promise.all([
    executeHealthAgent({
      patient: context.patient,
      healthRecords: context.healthRecords,
      medications: context.medications,
      incidents: context.incidents,
    }),
    executeSafetyAgent({
      patient: context.patient,
      healthRecords: context.healthRecords,
      incidents: context.incidents,
    }),
  ]);

  const care = await executeCareAgent({
    patient: context.patient,
    health,
    safety,
    caregivers: context.caregivers,
    medications: context.medications,
    healthRecords: context.healthRecords,
    incidents: context.incidents,
  });

  const manager = await executeManagerAgent({
    patient: context.patient,
    health,
    safety,
    care,
    healthRecords: context.healthRecords,
    incidents: context.incidents,
  });

  return {
    patient: context.patient,
    health,
    safety,
    care,
    manager,
  };
}

export async function runManagerAgentForPatient(patientId: string) {
  const context = buildPatientContext(patientId);

  const [health, safety] = await Promise.all([
    executeHealthAgent({
      patient: context.patient,
      healthRecords: context.healthRecords,
      medications: context.medications,
      incidents: context.incidents,
    }),
    executeSafetyAgent({
      patient: context.patient,
      healthRecords: context.healthRecords,
      incidents: context.incidents,
    }),
  ]);

  const care = await executeCareAgent({
    patient: context.patient,
    health,
    safety,
    caregivers: context.caregivers,
    medications: context.medications,
    healthRecords: context.healthRecords,
    incidents: context.incidents,
  });

  return executeManagerAgent({
    patient: context.patient,
    health,
    safety,
    care,
    healthRecords: context.healthRecords,
    incidents: context.incidents,
  });
}
