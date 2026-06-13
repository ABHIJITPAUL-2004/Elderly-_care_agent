import { getDashboardTargetPatientId, buildFallbackDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { AgentPageLayout } from "@/components/agents/AgentPageLayout";
import { ManagerAgentClient } from "@/components/agents/ManagerAgentClient";

export const metadata = {
  title: "AI Care Manager · Yorisoi AI",
  description: "Run the AI Care Manager to orchestrate all agents and get a unified care plan and executive summary.",
};

export default function ManagerAgentPage() {
  const patientId = getDashboardTargetPatientId();
  const snapshot  = buildFallbackDashboardSnapshot(patientId);

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />
      <AgentPageLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Agent Hub",  href: "/agents" },
          { label: "AI Care Manager", href: "/agents/manager" },
        ]}
        eyebrow="Agent 04 · Full Pipeline Mode"
        title="AI Care Manager"
        subtitle="The orchestration layer. Runs Health, Safety, and Care agents in sequence, then synthesizes all outputs into a unified care plan, risk assessment, and executive summary."
        accentColor="indigo"
        badge="Orchestration"
      >
        <ManagerAgentClient patientId={patientId} snapshot={snapshot} />
      </AgentPageLayout>
      <DashboardFooter />
    </div>
  );
}
