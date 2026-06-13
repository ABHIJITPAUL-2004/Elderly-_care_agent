import { z } from "zod";

import { isoDateSchema, isoDateTimeSchema, nonEmptyStringSchema, percentageSchema } from "./shared";

export const medicationSchema = z.strictObject({
  id: nonEmptyStringSchema,
  patientId: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  genericName: nonEmptyStringSchema.optional(),
  dosage: nonEmptyStringSchema,
  unit: nonEmptyStringSchema.optional(),
  route: nonEmptyStringSchema.optional(),
  frequency: nonEmptyStringSchema,
  instructions: nonEmptyStringSchema.optional(),
  prescribingClinician: nonEmptyStringSchema.optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  reminderTimes: z.array(nonEmptyStringSchema).default([]),
  adherenceTarget: percentageSchema.optional(),
  active: z.boolean(),
  notes: nonEmptyStringSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type Medication = z.infer<typeof medicationSchema>;
