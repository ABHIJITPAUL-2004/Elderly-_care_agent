import { z } from "zod";

import { nonEmptyStringSchema } from "./shared";

export const patientRequestSchema = z.strictObject({
  patientId: nonEmptyStringSchema,
});

export type PatientRequest = z.infer<typeof patientRequestSchema>;

export const analyzeRequestSchema = z.strictObject({
  patientId: nonEmptyStringSchema,
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
