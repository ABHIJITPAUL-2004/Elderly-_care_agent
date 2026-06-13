import {
  buildActivityFeed,
  loadDashboardSnapshot,
  getDashboardTargetPatientId,
} from "@/lib/dashboard-data";
import { HealthAnalyticsChart } from "@/components/dashboard/health-analytics-chart";
import { LiveAiRefresh } from "@/components/dashboard/live-ai-refresh";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

interface HomeProps {
  searchParams: Promise<{ patientId?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const patientId = resolvedParams.patientId ?? getDashboardTargetPatientId();
  const snapshot = await loadDashboardSnapshot(patientId);
  const activityFeed = buildActivityFeed(snapshot);

  return (
    <DashboardClient
      snapshot={snapshot}
      activityFeed={activityFeed}
      HealthAnalyticsChart={HealthAnalyticsChart}
      LiveAiRefresh={LiveAiRefresh}
    />
  );
}
