import { z } from "zod";

import { isoDateTimeSchema, nonEmptyStringSchema, percentageSchema, riskLevelSchema } from "./shared";

export const healthRecordSchema = z.strictObject({
  id: nonEmptyStringSchema,
  patientId: nonEmptyStringSchema,
  recordedAt: isoDateTimeSchema,
  healthStatus: nonEmptyStringSchema,
  riskLevel: riskLevelSchema,
  riskScore: percentageSchema,
  medicationAdherence: percentageSchema,
  systolicBloodPressure: z.number().int().min(60).max(240),
  diastolicBloodPressure: z.number().int().min(40).max(140),
  heartRate: z.number().int().min(35).max(180),
  bodyTemperatureC: z.number().min(34).max(42),
  sleepHours: z.number().min(0).max(24),
  steps: z.number().int().min(0),
  activitySummary: nonEmptyStringSchema,
  issues: z.array(nonEmptyStringSchema).default([]),
  recommendations: z.array(nonEmptyStringSchema).default([]),
  escalationRequired: z.boolean(),
  notes: nonEmptyStringSchema,
});

export type HealthRecord = z.infer<typeof healthRecordSchema>;
