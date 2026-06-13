import { analyzeRequestSchema, patientRequestSchema } from "@/types";
import { executeCareAgent, runCareAgentForPatient as executeCareAgentForPatient } from "@/lib/agents/care";
import { executeHealthAgent, runHealthAgentForPatient } from "@/lib/agents/health";
import { executeManagerAgent, executeYorisoiAgentPipeline, runManagerAgentForPatient } from "@/lib/agents/manager";
import { executeSafetyAgent, runSafetyAgentForPatient } from "@/lib/agents/safety";

export { executeCareAgent, executeHealthAgent, executeManagerAgent, executeSafetyAgent };
export { runHealthAgentForPatient, runManagerAgentForPatient, runSafetyAgentForPatient };

export async function runAnalyzeAgentPipeline(patientId: string) {
  return executeYorisoiAgentPipeline(patientId);
}

export async function runCareAgentForPatient(patientId: string) {
  const [health, safety] = await Promise.all([
    runHealthAgentForPatient(patientId),
    runSafetyAgentForPatient(patientId),
  ]);

  return executeCareAgentForPatient(patientId, health, safety);
}

export function parsePatientRequestBody(body: unknown) {
  return patientRequestSchema.parse(body);
}

export function parseAnalyzeRequestBody(body: unknown) {
  return analyzeRequestSchema.parse(body);
}
