import { z } from "zod";

import { nonEmptyStringSchema, priorityLevelSchema, riskLevelSchema } from "./shared";

export const managerAgentResponseSchema = z.strictObject({
  agent: z.literal("AI Care Manager"),
  overall_risk_level: riskLevelSchema,
  overall_risk_score: z.number().min(0).max(100),
  priority_level: priorityLevelSchema,
  critical_findings: z.array(nonEmptyStringSchema).default([]),
  recommended_actions: z.array(nonEmptyStringSchema).default([]),
  required_followups: z.array(nonEmptyStringSchema).default([]),
  care_plan: nonEmptyStringSchema,
  executive_summary: nonEmptyStringSchema,
});

export type ManagerAgentResponse = z.infer<typeof managerAgentResponseSchema>;
