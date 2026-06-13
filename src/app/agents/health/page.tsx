import { getDashboardTargetPatientId, buildFallbackDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { AgentPageLayout } from "@/components/agents/AgentPageLayout";
import { HealthAgentClient } from "@/components/agents/HealthAgentClient";

export const metadata = {
  title: "Health & Wellness Agent · Yorisoi AI",
  description: "Run the Health Agent independently to analyze patient risk, medication adherence, and wellness trends.",
};

export default function HealthAgentPage() {
  const patientId = getDashboardTargetPatientId();
  const snapshot  = buildFallbackDashboardSnapshot(patientId);

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />
      <AgentPageLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Agent Hub",  href: "/agents" },
          { label: "Health Agent", href: "/agents/health" },
        ]}
        eyebrow="Agent 01 · Standalone Mode"
        title="Health & Wellness Agent"
        subtitle="Analyzes vital signs, medication adherence, activity levels, and historical health records to generate a risk score and forward-looking trend analysis."
        accentColor="emerald"
        badge="Health & Wellness"
      >
        <HealthAgentClient patientId={patientId} snapshot={snapshot} />
      </AgentPageLayout>
      <DashboardFooter />
    </div>
  );
}
