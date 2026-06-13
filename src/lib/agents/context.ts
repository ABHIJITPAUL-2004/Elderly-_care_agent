import { validatedCaregivers, validatedHealthRecords, validatedIncidents, validatedMedications, validatedPatients } from "@/data";
import { sortByDateDesc } from "@/lib/utils";
import { AppError } from "@/lib/utils/errors";

export interface PatientContext {
  patient: (typeof validatedPatients)[number];
  healthRecords: typeof validatedHealthRecords;
  incidents: typeof validatedIncidents;
  medications: typeof validatedMedications;
  caregivers: typeof validatedCaregivers;
}

export function buildPatientContext(patientId: string): PatientContext {
  const patient = validatedPatients.find((item) => item.id === patientId);

  if (!patient) {
    throw new AppError("Patient not found.", 404);
  }

  return {
    patient,
    healthRecords: sortByDateDesc(validatedHealthRecords.filter((record) => record.patientId === patientId)),
    incidents: sortByDateDesc(validatedIncidents.filter((incident) => incident.patientId === patientId)),
    medications: validatedMedications.filter((medication) => medication.patientId === patientId && medication.active),
    caregivers: validatedCaregivers.filter((caregiver) => caregiver.assignedPatientIds.includes(patientId) && caregiver.active),
  };
}
