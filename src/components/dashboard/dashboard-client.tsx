"use client";

import type { ComponentType } from "react";
import type { DashboardSnapshot, DashboardActivityItem } from "@/lib/dashboard-data";
import type { HealthRecord } from "@/types";

import { DashboardNav } from "./DashboardNav";
import { DashboardHero } from "./DashboardHero";
import { AgentFlowSection } from "./AgentFlowSection";
import { AgentStatusSection } from "./AgentStatusSection";
import { AnalyticsSection } from "./AnalyticsSection";
import { PatientAndLiveSection } from "./PatientAndLiveSection";
import { DashboardFooter } from "./DashboardFooter";

import { QuickActionsCard } from "./QuickActionsCard";

interface LiveAiRefreshProps {
  patientId: string;
  initialSummary: string;
  initialRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  initialRiskScore: number;
  initialPriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface Props {
  snapshot: DashboardSnapshot;
  activityFeed: DashboardActivityItem[];
  HealthAnalyticsChart: ComponentType<{ healthRecords: HealthRecord[] }>;
  LiveAiRefresh: ComponentType<LiveAiRefreshProps>;
}

export function DashboardClient({
  snapshot,
  activityFeed,
  HealthAnalyticsChart,
  LiveAiRefresh,
}: Props) {
  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />

      <main id="main-content">
        <DashboardHero snapshot={snapshot} />
        
        {/* Hackathon Quick Actions widget */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <QuickActionsCard currentPatientId={snapshot.patient.id} />
        </div>

        <AgentFlowSection />
        <AgentStatusSection snapshot={snapshot} activityFeed={activityFeed} />
        <AnalyticsSection snapshot={snapshot} HealthAnalyticsChart={HealthAnalyticsChart} />
        <PatientAndLiveSection snapshot={snapshot} LiveAiRefresh={LiveAiRefresh} />
      </main>

      <DashboardFooter />
    </div>
  );
}
