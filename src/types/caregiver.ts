import { z } from "zod";

import { isoDateTimeSchema, nonEmptyStringSchema } from "./shared";

export const caregiverSchema = z.strictObject({
  id: nonEmptyStringSchema,
  fullName: nonEmptyStringSchema,
  relationship: nonEmptyStringSchema,
  phoneNumber: nonEmptyStringSchema,
  email: nonEmptyStringSchema.optional(),
  role: nonEmptyStringSchema.optional(),
  languages: z.array(nonEmptyStringSchema).default([]),
  specialties: z.array(nonEmptyStringSchema).default([]),
  availability: z.array(nonEmptyStringSchema).default([]),
  assignedPatientIds: z.array(nonEmptyStringSchema).default([]),
  active: z.boolean(),
  notes: nonEmptyStringSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type Caregiver = z.infer<typeof caregiverSchema>;
