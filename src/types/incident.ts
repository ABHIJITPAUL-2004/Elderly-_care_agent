import { z } from "zod";

import { agentNameSchema, emergencyLevelSchema, incidentStatusSchema, isoDateTimeSchema, nonEmptyStringSchema, riskLevelSchema } from "./shared";

export const incidentSchema = z.strictObject({
  id: nonEmptyStringSchema,
  patientId: nonEmptyStringSchema,
  incidentType: nonEmptyStringSchema,
  severity: riskLevelSchema,
  emergencyLevel: emergencyLevelSchema,
  detectedAt: isoDateTimeSchema,
  resolvedAt: isoDateTimeSchema.optional(),
  location: nonEmptyStringSchema.optional(),
  description: nonEmptyStringSchema.optional(),
  source: nonEmptyStringSchema.optional(),
  detectedRisks: z.array(nonEmptyStringSchema).default([]),
  recommendedActions: z.array(nonEmptyStringSchema).default([]),
  escalationRequired: z.boolean(),
  notifyAgents: z.array(agentNameSchema).default([]),
  status: incidentStatusSchema,
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type Incident = z.infer<typeof incidentSchema>;
