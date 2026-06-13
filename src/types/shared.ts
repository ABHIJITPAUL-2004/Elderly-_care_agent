import { z } from "zod";

export const agentNameValues = [
  "Health & Wellness Agent",
  "Safety & Emergency Agent",
  "Care Coordination Agent",
  "AI Care Manager",
] as const;

export const agentNameSchema = z.enum(agentNameValues);
export type AgentName = z.infer<typeof agentNameSchema>;

export const riskLevelValues = ["LOW", "MODERATE", "HIGH", "CRITICAL"] as const;
export const riskLevelSchema = z.enum(riskLevelValues);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const priorityLevelValues = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
export const priorityLevelSchema = z.enum(priorityLevelValues);
export type PriorityLevel = z.infer<typeof priorityLevelSchema>;

export const carePlanStatusValues = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"] as const;
export const carePlanStatusSchema = z.enum(carePlanStatusValues);
export type CarePlanStatus = z.infer<typeof carePlanStatusSchema>;

export const incidentStatusValues = ["OPEN", "ACKNOWLEDGED", "RESOLVED"] as const;
export const incidentStatusSchema = z.enum(incidentStatusValues);
export type IncidentStatus = z.infer<typeof incidentStatusSchema>;

export const nonEmptyStringSchema = z.string().trim().min(1);
export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const isoDateTimeSchema = z.string().datetime({ offset: true });
export const percentageSchema = z.number().min(0).max(100);
export const emergencyLevelSchema = z.number().int().min(0).max(4);
