export interface PredefinedScenario {
  id: string;
  title: string;
  description: string;
  patientId: string;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  riskDetails: string;
}

export const scenarios: PredefinedScenario[] = [
  {
    id: "scenario-healthy-senior",
    title: "Scenario 1: Healthy Senior",
    description: "Vitals are completely stable and medication adherence is 100%. No active incident reports.",
    patientId: "patient-006",
    riskLevel: "LOW",
    riskDetails: "Patient Ken Watanabe shows excellent adherence to his lipid medication. All vitals are within standard ranges. Safety monitoring indicates zero abnormalities.",
  },
  {
    id: "scenario-missed-medication",
    title: "Scenario 2: Missed Medication",
    description: "Mild cognitive lapses cause the patient to forget evening medication. Adherence has dropped to 65%.",
    patientId: "patient-007",
    riskLevel: "MODERATE",
    riskDetails: "Patient Yoko Yamamoto missed medication twice this week. Tremors are slight but blood pressure is rising, requiring medication reminder tracking.",
  },
  {
    id: "scenario-increasing-bp",
    title: "Scenario 3: Increasing Blood Pressure",
    description: "Systolic blood pressure has been steadily climbing over consecutive records, approaching 154 mmHg.",
    patientId: "patient-008",
    riskLevel: "HIGH",
    riskDetails: "Patient Shigeru Nakamura has a rising blood pressure trend despite taking standard heart medication, requiring escalation for nursing intervention.",
  },
  {
    id: "scenario-high-fall-risk",
    title: "Scenario 4: High Fall Risk",
    description: "Hip pain and gait instability led to a kitchen slip near-miss. Motion data suggests elevated danger.",
    patientId: "patient-009",
    riskLevel: "HIGH",
    riskDetails: "Patient Chiyo Kobayashi uses a walker but displays unsteady gait. Accelerometer detected a slip near-miss, indicating urgent need for home safety improvements.",
  },
  {
    id: "scenario-emergency-fall",
    title: "Scenario 5: Emergency Fall Event",
    description: "Bedroom optical sensor detected a sudden fall event today. Vitals are currently unstable.",
    patientId: "patient-010",
    riskLevel: "CRITICAL",
    riskDetails: "Patient Hiroshi Kato has experienced a critical fall. Vitals show tachycardia and hypertensive reaction. Safety Agent raised emergency level 4.",
  },
  {
    id: "scenario-caregiver-shortage",
    title: "Scenario 6: Caregiver Shortage",
    description: "Primary caregiver is out sick. The care coordinator needs to schedule backup help for a high-priority patient.",
    patientId: "patient-011",
    riskLevel: "HIGH",
    riskDetails: "Patient Kikue Yoshida has rheumatoid arthritis and COPD. Her coordinator is on leave. The system must raise alerts for alternative resource assignment.",
  },
];
