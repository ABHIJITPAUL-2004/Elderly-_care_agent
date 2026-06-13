import { z } from "zod";

import { carePlanStatusSchema, isoDateTimeSchema, nonEmptyStringSchema, priorityLevelSchema, riskLevelSchema } from "./shared";

export const carePlanSchema = z.strictObject({
  id: nonEmptyStringSchema,
  patientId: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  summary: nonEmptyStringSchema,
  overallRiskLevel: riskLevelSchema,
  priorityLevel: priorityLevelSchema,
  status: carePlanStatusSchema,
  objectives: z.array(nonEmptyStringSchema).default([]),
  actions: z.array(nonEmptyStringSchema).default([]),
  assignedCaregiverIds: z.array(nonEmptyStringSchema).default([]),
  relatedIncidentIds: z.array(nonEmptyStringSchema).default([]),
  medicationIds: z.array(nonEmptyStringSchema).default([]),
  reviewNotes: z.array(nonEmptyStringSchema).default([]),
  startDate: isoDateTimeSchema.optional(),
  dueDate: isoDateTimeSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type CarePlan = z.infer<typeof carePlanSchema>;
