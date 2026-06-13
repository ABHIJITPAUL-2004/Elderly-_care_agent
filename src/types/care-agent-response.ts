import { z } from "zod";

import { agentNameSchema, isoDateTimeSchema, nonEmptyStringSchema, priorityLevelSchema } from "./shared";
import { caregiverSchema } from "./caregiver";

export const careAppointmentSchema = z.strictObject({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  scheduledAt: isoDateTimeSchema,
  location: nonEmptyStringSchema.optional(),
  notes: nonEmptyStringSchema.optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED"]),
});

export type CareAppointment = z.infer<typeof careAppointmentSchema>;

export const careAgentResponseSchema = z.strictObject({
  agent: z.literal("Care Coordination Agent"),
  priority_level: priorityLevelSchema,
  care_actions: z.array(nonEmptyStringSchema).default([]),
  assigned_caregiver: caregiverSchema.partial().nullable(),
  family_notifications: z.array(nonEmptyStringSchema).default([]),
  appointments: z.array(careAppointmentSchema).default([]),
  pending_tasks: z.array(nonEmptyStringSchema).default([]),
  execution_status: nonEmptyStringSchema,
  notify_agents: z.array(agentNameSchema).default([]),
  executive_summary: nonEmptyStringSchema,
});

export type CareAgentResponse = z.infer<typeof careAgentResponseSchema>;
