"use client";

import { StandaloneAgentRunner } from "./StandaloneAgentRunner";
import { AgentResultCards } from "./AgentResultCards";
import type { DashboardSnapshot } from "@/lib/dashboard-data";

interface Props { patientId: string; snapshot: DashboardSnapshot }

export function CareAgentClient({ patientId, snapshot }: Props) {
  const c = snapshot.care;

  return (
    <div className="space-y-8">
      {/* Static snapshot */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Current Snapshot · Fallback Data</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Care coordination at a glance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Priority Level",    value: c.priority_level },
            { label: "Execution Status",  value: c.execution_status },
            { label: "Assigned Caregiver", value: c.assigned_caregiver?.fullName ?? "Unassigned" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{item.label}</p>
              <p className="mt-1.5 text-xl font-semibold text-stone-800">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {c.pending_tasks.length > 0 && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">Pending Tasks</p>
              <ul className="mt-2 space-y-1">
                {c.pending_tasks.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-sky-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {c.care_actions.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Care Actions</p>
              <ul className="mt-2 space-y-1">
                {c.care_actions.slice(0, 4).map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Executive Summary</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">{c.executive_summary}</p>
        </div>
      </div>

      <div className="border-t border-stone-200" />

      {/* Live runner */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Live Agent Execution</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Run the Care Agent now</h2>
        <p className="mt-1 text-sm text-stone-500">
          Internally runs Health + Safety agents first, then synthesizes the results into care coordination output via{" "}
          <code className="rounded bg-stone-100 px-1 font-mono text-stone-700">/api/care-agent</code>.
        </p>
        <div className="mt-4">
          <StandaloneAgentRunner
            patientId={patientId}
            endpoint="/api/care-agent"
            agentName="Care Agent"
            agentColor="sky"
            renderResult={(data) => (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                  Live result · {(data.agent as string) ?? "Care Coordination Agent"}
                </p>
                <AgentResultCards data={data} accentColor="sky" />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
