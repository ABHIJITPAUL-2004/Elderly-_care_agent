import { getDashboardTargetPatientId, buildFallbackDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { AgentPageLayout } from "@/components/agents/AgentPageLayout";
import { SafetyAgentClient } from "@/components/agents/SafetyAgentClient";

export const metadata = {
  title: "Safety & Emergency Agent · Yorisoi AI",
  description: "Run the Safety Agent independently to assess fall risk, incident history, and emergency level.",
};

export default function SafetyAgentPage() {
  const patientId = getDashboardTargetPatientId();
  const snapshot  = buildFallbackDashboardSnapshot(patientId);

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />
      <AgentPageLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Agent Hub",  href: "/agents" },
          { label: "Safety Agent", href: "/agents/safety" },
        ]}
        eyebrow="Agent 02 · Standalone Mode"
        title="Safety & Emergency Agent"
        subtitle="Monitors incident history, assesses fall risk, determines emergency level, and recommends escalation actions when safety thresholds are exceeded."
        accentColor="rose"
        badge="Safety & Emergency"
      >
        <SafetyAgentClient patientId={patientId} snapshot={snapshot} />
      </AgentPageLayout>
      <DashboardFooter />
    </div>
  );
}
