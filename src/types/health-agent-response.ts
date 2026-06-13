import { z } from "zod";

import { agentNameSchema, nonEmptyStringSchema, percentageSchema, riskLevelSchema } from "./shared";

export const healthAgentResponseSchema = z.strictObject({
  agent: z.literal("Health & Wellness Agent"),
  health_status: nonEmptyStringSchema,
  risk_level: riskLevelSchema,
  risk_score: percentageSchema,
  medication_adherence: percentageSchema,
  issues: z.array(nonEmptyStringSchema).default([]),
  trend_analysis: z.array(nonEmptyStringSchema).default([]),
  recommendations: z.array(nonEmptyStringSchema).default([]),
  escalation_required: z.boolean(),
  notify_agents: z.array(agentNameSchema).default([]),
  executive_summary: nonEmptyStringSchema,
});

export type HealthAgentResponse = z.infer<typeof healthAgentResponseSchema>;
