export const en = {
  meta: {
    title: "Yorisoi AI (寄り添いAI) | Eldercare Intelligence Platform",
    description:
      "Connecting care, AI that stays by your side. A unified multi-agent system for eldercare coordination.",
  },

  nav: {
    brand: "Yorisoi AI",
    tagline: "Connecting care, AI that stays by your side.",
    liveRefresh: "Live AI Analysis",
  },

  hero: {
    eyebrow: "Eldercare Intelligence Platform",
    headline: "AI that stays by your side.",
    subheadline:
      "Four specialized agents — Health, Safety, Care, and Manager — work together in real time to keep elderly individuals safe and families informed.",
    lastCapture: "Latest health capture",
  },

  patientCard: {
    label: "Patient",
    arrangement: "Living arrangement not specified.",
  },

  stats: {
    targetPatient: "Patient",
    latestRisk: "Risk Level",
    overallScore: "Overall Score",
    medicationAdherence: "Medication Adherence",
    medicationsTracked: "medications tracked",
    monitoringStatus: "Monitoring Status",
    actionRequired: "Action Required",
    stable: "Stable",
    assignedTo: "Assigned to",
    caregivers: "caregivers",
  },

  riskLabels: {
    LOW: "Stable",
    MODERATE: "Attention",
    HIGH: "Warning",
    CRITICAL: "Emergency",
  },

  managerCard: {
    description: "AI Care Manager Summary",
    overallRisk: "Overall Risk",
    health: "Health",
    safety: "Safety",
    care: "Care",
    noActiveIncident: "No active incident",
    viewCarePlan: "View Care Plan",
    runLiveAnalysis: "Run Live Analysis",
  },

  problemSolution: {
    title: "Why Yorisoi AI",
    problem: {
      badge: "Problem",
      body: "Japan's aging population faces caregiver shortages, elder isolation, medication non-adherence, and slow emergency response.",
    },
    system: {
      badge: "Solution",
      body: "Four AI agents specialize, validate, and escalate in a predictable chain — turning fragmented data into coordinated care.",
    },
    value: {
      badge: "Impact",
      body: "One dashboard turns complex care signals into clear actions for families, caregivers, and care coordinators.",
    },
  },

  agentFlow: {
    title: "How the agents work together",
    description: "Agent Collaboration Flow",
    patientData: "Patient Data",
    carePlan: "Care Plan",
    agents: {
      health: {
        name: "Health Agent",
        role: "Risk & Wellness",
        description:
          "Analyzes vital trends, medication adherence, and health records to calculate risk scores.",
      },
      safety: {
        name: "Safety Agent",
        role: "Incident & Emergency",
        description:
          "Monitors incidents, fall risk, and emergency signals. Triggers escalation when needed.",
      },
      care: {
        name: "Care Agent",
        role: "Coordination",
        description:
          "Assigns caregivers, schedules visits, and notifies families based on health and safety inputs.",
      },
      manager: {
        name: "Manager Agent",
        role: "Orchestration",
        description:
          "Synthesizes all agent outputs into a unified care plan and executive summary.",
      },
    },
  },

  agentCards: {
    title: "Four agents, one care loop",
    description: "Agent Status",
    active: "Active",
    health: {
      label: "Health Agent",
    },
    safety: {
      label: "Safety Agent",
      noOpenIncident: "No open incident",
    },
    care: {
      label: "Care Agent",
      unassigned: "No caregiver assigned",
      scheduleVisit: "Schedule next visit",
    },
    manager: {
      label: "Manager Agent",
      reviewFollowups: "Review follow-ups",
    },
    risk: "Risk",
    adherence: "Adherence",
    emergencyLevel: "Emergency level",
    priority: "Priority",
    overall: "Overall",
    score: "Score",
  },

  activityFeed: {
    title: "Recent coordination signals",
    description: "Agent Activity Feed",
    toneLabels: {
      health: "Health",
      safety: "Safety",
      care: "Care",
      manager: "Manager",
    },
  },

  analytics: {
    title: "Risk & Adherence Trend",
    description: "Health Analytics",
    avgRisk: "Avg Risk Score",
    avgAdherence: "Avg Adherence",
    snapshots: "Snapshots",
    chartLoading: "Chart loads after hydration.",
    riskScore: "Risk score",
    adherence: "Adherence",
  },

  patientDetails: {
    title: "Patient Details",
    description: "Patient Profile",
    ageContext: "Age Context",
    genderNotProvided: "Gender not provided",
    latestStatus: "Latest Status",
    addressNotProvided: "Address not provided",
    medicationAdherence: "Medication adherence",
    overallRisk: "Overall risk",
    conditions: "Conditions",
    caregivers: "Assigned Caregivers",
    medications: "Active Medications",
    recentIncident: "Recent Incident",
    noRecentIncident: "No recent incident",
    noIncidentSignals: "No open incident signals were detected.",
  },

  liveRefresh: {
    title: "On-demand Intelligence Refresh",
    description: "Live API Bridge",
    subtitle: "Run the full agent pipeline on demand against live data.",
    riskScore: "Risk score",
    riskLevel: "Risk level",
    priority: "Priority",
    idle: "Idle",
    liveConnected: "Live connected",
    liveUnavailable: "Live unavailable",
    loadButton: "Run Live AI Analysis",
    loadingButton: "Analyzing...",
    liveApiLabel: "Live API",
  },

  valueProposition: {
    title: "Why this wins a hackathon",
    description: "Impact Statement",
    points: [
      "Judges immediately see the problem: fragmented eldercare, delayed escalation, and too much manual coordination.",
      "The interface makes agent roles obvious, the care plan legible, and the patient impact concrete.",
      "The live API bridge proves this is not a static mockup — it is a real orchestration surface.",
    ],
  },

  footer: {
    built: "Built for",
    hackathon: "Hackathon 2026",
    tagline: "Connecting care, AI that stays by your side.",
  },
};

export type RiskLabelKey = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface Translations {
  meta: { title: string; description: string };
  nav: { brand: string; tagline: string; liveRefresh: string };
  hero: { eyebrow: string; headline: string; subheadline: string; lastCapture: string };
  patientCard: { label: string; arrangement: string };
  stats: {
    targetPatient: string; latestRisk: string; overallScore: string;
    medicationAdherence: string; medicationsTracked: string; monitoringStatus: string;
    actionRequired: string; stable: string; assignedTo: string; caregivers: string;
  };
  riskLabels: Record<RiskLabelKey, string>;
  managerCard: {
    description: string; overallRisk: string; health: string; safety: string;
    care: string; noActiveIncident: string; viewCarePlan: string; runLiveAnalysis: string;
  };
  problemSolution: {
    title: string;
    problem: { badge: string; body: string };
    system: { badge: string; body: string };
    value: { badge: string; body: string };
  };
  agentFlow: {
    title: string; description: string; patientData: string; carePlan: string;
    agents: Record<"health" | "safety" | "care" | "manager", { name: string; role: string; description: string }>;
  };
  agentCards: {
    title: string; description: string; active: string;
    health: { label: string };
    safety: { label: string; noOpenIncident: string };
    care: { label: string; unassigned: string; scheduleVisit: string };
    manager: { label: string; reviewFollowups: string };
    risk: string; adherence: string; emergencyLevel: string;
    priority: string; overall: string; score: string;
  };
  activityFeed: {
    title: string; description: string;
    toneLabels: Record<"health" | "safety" | "care" | "manager", string>;
  };
  analytics: {
    title: string; description: string; avgRisk: string; avgAdherence: string;
    snapshots: string; chartLoading: string; riskScore: string; adherence: string;
  };
  patientDetails: {
    title: string; description: string; ageContext: string; genderNotProvided: string;
    latestStatus: string; addressNotProvided: string; medicationAdherence: string;
    overallRisk: string; conditions: string; caregivers: string; medications: string;
    recentIncident: string; noRecentIncident: string; noIncidentSignals: string;
  };
  liveRefresh: {
    title: string; description: string; subtitle: string;
    riskScore: string; riskLevel: string; priority: string;
    idle: string; liveConnected: string; liveUnavailable: string;
    loadButton: string; loadingButton: string; liveApiLabel: string;
  };
  valueProposition: { title: string; description: string; points: string[] };
  footer: { built: string; hackathon: string; tagline: string };
}
