import { z } from "zod";

import { isoDateSchema, isoDateTimeSchema, nonEmptyStringSchema } from "./shared";

export const patientSchema = z.strictObject({
  id: nonEmptyStringSchema,
  fullName: nonEmptyStringSchema,
  preferredName: nonEmptyStringSchema.optional(),
  dateOfBirth: isoDateSchema.optional(),
  gender: nonEmptyStringSchema.optional(),
  language: nonEmptyStringSchema.optional(),
  address: nonEmptyStringSchema.optional(),
  livingArrangement: nonEmptyStringSchema.optional(),
  conditions: z.array(nonEmptyStringSchema).default([]),
  allergies: z.array(nonEmptyStringSchema).default([]),
  medicationIds: z.array(nonEmptyStringSchema).default([]),
  caregiverIds: z.array(nonEmptyStringSchema).default([]),
  carePlanIds: z.array(nonEmptyStringSchema).default([]),
  emergencyContactIds: z.array(nonEmptyStringSchema).default([]),
  notes: nonEmptyStringSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type Patient = z.infer<typeof patientSchema>;
