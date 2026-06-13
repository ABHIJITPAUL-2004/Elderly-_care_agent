import {
  caregiverSchema,
  incidentSchema,
  medicationSchema,
  patientSchema,
  healthRecordSchema,
} from "../../types";

import { patients } from "./patients";
import { caregivers } from "./caregivers";
import { medications } from "./medications";
import { incidents } from "./incidents";
import { healthRecords } from "./health-records";

export { patients, caregivers, medications, incidents, healthRecords };

export const validatedPatients = patients.map((patient) => {
  try {
    return patientSchema.parse(patient);
  } catch (err) {
    console.error("Patient validation failed for:", patient.id, err);
    throw err;
  }
});

export const validatedCaregivers = caregivers.map((caregiver) => {
  try {
    return caregiverSchema.parse(caregiver);
  } catch (err) {
    console.error("Caregiver validation failed for:", caregiver.id, err);
    throw err;
  }
});

export const validatedMedications = medications.map((medication) => {
  try {
    return medicationSchema.parse(medication);
  } catch (err) {
    console.error("Medication validation failed for:", medication.id, err);
    throw err;
  }
});

export const validatedIncidents = incidents.map((incident) => {
  try {
    return incidentSchema.parse(incident);
  } catch (err) {
    console.error("Incident validation failed for:", incident.id, err);
    throw err;
  }
});

export const validatedHealthRecords = healthRecords.map((record) => {
  try {
    return healthRecordSchema.parse(record);
  } catch (err) {
    console.error("HealthRecord validation failed for:", record.id, err);
    throw err;
  }
});
