"use client";

import { StandaloneAgentRunner } from "./StandaloneAgentRunner";
import { AgentResultCards } from "./AgentResultCards";
import type { DashboardSnapshot } from "@/lib/dashboard-data";

interface Props { patientId: string; snapshot: DashboardSnapshot }

export function SafetyAgentClient({ patientId, snapshot }: Props) {
  const s = snapshot.safety;
  const latestIncident = snapshot.incidents[0];

  return (
    <div className="space-y-8">
      {/* Static snapshot */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Current Snapshot · Fallback Data</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Safety status at a glance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Incident Detected",  value: s.incident_detected ? "Yes" : "No",   warn: s.incident_detected },
            { label: "Incident Type",      value: s.incident_type },
            { label: "Emergency Level",    value: String(s.emergency_level) },
            { label: "Severity",           value: s.severity },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 shadow-sm ${item.warn ? "border-rose-200 bg-rose-50" : "border-stone-200 bg-white"}`}>
              <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{item.label}</p>
              <p className={`mt-1.5 text-xl font-semibold ${item.warn ? "text-rose-700" : "text-stone-800"}`}>{item.value}</p>
            </div>
          ))}
        </div>
        {latestIncident && (
          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Most Recent Incident</p>
            <p className="mt-1 text-sm font-semibold text-stone-800">{latestIncident.incidentType}</p>
            <p className="mt-1 text-sm leading-6 text-stone-500">{latestIncident.description}</p>
            <p className="mt-1 text-xs text-stone-400">Detected: {latestIncident.detectedAt}</p>
          </div>
        )}
      </div>

      <div className="border-t border-stone-200" />

      {/* Live runner */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Live Agent Execution</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Run the Safety Agent now</h2>
        <p className="mt-1 text-sm text-stone-500">
          Calls <code className="rounded bg-stone-100 px-1 font-mono text-stone-700">/api/safety-agent</code> with current patient context and returns a fresh AI-generated safety assessment.
        </p>
        <div className="mt-4">
          <StandaloneAgentRunner
            patientId={patientId}
            endpoint="/api/safety-agent"
            agentName="Safety Agent"
            agentColor="rose"
            renderResult={(data) => (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">
                  Live result · {(data.agent as string) ?? "Safety & Emergency Agent"}
                </p>
                <AgentResultCards data={data} accentColor="rose" />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
