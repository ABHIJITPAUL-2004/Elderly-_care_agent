import { z } from "zod";

import { agentNameSchema, emergencyLevelSchema, nonEmptyStringSchema, percentageSchema, riskLevelSchema } from "./shared";

export const safetyAgentResponseSchema = z.strictObject({
  agent: z.literal("Safety & Emergency Agent"),
  incident_detected: z.boolean(),
  incident_type: nonEmptyStringSchema,
  emergency_level: emergencyLevelSchema,
  fall_risk_score: percentageSchema,
  severity: riskLevelSchema,
  detected_risks: z.array(nonEmptyStringSchema).default([]),
  recommended_actions: z.array(nonEmptyStringSchema).default([]),
  escalation_required: z.boolean(),
  notify_agents: z.array(agentNameSchema).default([]),
  executive_summary: nonEmptyStringSchema,
});

export type SafetyAgentResponse = z.infer<typeof safetyAgentResponseSchema>;
