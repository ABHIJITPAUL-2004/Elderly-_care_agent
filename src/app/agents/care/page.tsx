import { getDashboardTargetPatientId, buildFallbackDashboardSnapshot } from "@/lib/dashboard-data";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { AgentPageLayout } from "@/components/agents/AgentPageLayout";
import { CareAgentClient } from "@/components/agents/CareAgentClient";

export const metadata = {
  title: "Care Coordination Agent · Yorisoi AI",
  description: "Run the Care Agent independently to manage caregiver assignment, visit scheduling, and family notifications.",
};

export default function CareAgentPage() {
  const patientId = getDashboardTargetPatientId();
  const snapshot  = buildFallbackDashboardSnapshot(patientId);

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />
      <AgentPageLayout
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Agent Hub",  href: "/agents" },
          { label: "Care Agent", href: "/agents/care" },
        ]}
        eyebrow="Agent 03 · Standalone Mode"
        title="Care Coordination Agent"
        subtitle="Assigns caregivers, schedules visits, generates family notifications, and manages pending care tasks based on Health and Safety agent inputs."
        accentColor="sky"
        badge="Care Coordination"
      >
        <CareAgentClient patientId={patientId} snapshot={snapshot} />
      </AgentPageLayout>
      <DashboardFooter />
    </div>
  );
}
