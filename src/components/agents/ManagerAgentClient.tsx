"use client";

import { StandaloneAgentRunner } from "./StandaloneAgentRunner";
import { AgentResultCards } from "./AgentResultCards";
import type { DashboardSnapshot } from "@/lib/dashboard-data";

interface Props { patientId: string; snapshot: DashboardSnapshot }

export function ManagerAgentClient({ patientId, snapshot }: Props) {
  const m = snapshot.manager;

  return (
    <div className="space-y-8">
      {/* Static snapshot */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Current Snapshot · Fallback Data</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Manager assessment at a glance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Overall Risk Level", value: m.overall_risk_level },
            { label: "Risk Score",         value: String(Math.round(m.overall_risk_score)) },
            { label: "Priority Level",     value: m.priority_level },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{item.label}</p>
              <p className="mt-1.5 text-xl font-semibold text-stone-800">{item.value}</p>
            </div>
          ))}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">Agents Orchestrated</p>
            <p className="mt-1.5 text-xl font-semibold text-indigo-800">3 agents</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Executive Summary</p>
          <p className="mt-2 text-base font-medium leading-7 text-indigo-900">{m.executive_summary}</p>
        </div>

        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Care Plan</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">{m.care_plan}</p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {m.recommended_actions.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Recommended Actions</p>
              <ul className="mt-2 space-y-1">
                {m.recommended_actions.slice(0, 5).map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {m.required_followups.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Required Follow-ups</p>
              <ul className="mt-2 space-y-1">
                {m.required_followups.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-stone-200" />

      {/* Note about full pipeline */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Full Pipeline</p>
        <p className="mt-1 text-sm leading-6 text-indigo-800">
          Running the Manager Agent triggers the <strong>complete orchestration pipeline</strong>: Health Agent and Safety Agent run in parallel, then the Care Agent synthesizes their outputs, and finally the Manager Agent produces the unified care plan. This may take 10–20 seconds.
        </p>
      </div>

      {/* Live runner */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Live Agent Execution</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Run the full pipeline now</h2>
        <p className="mt-1 text-sm text-stone-500">
          Calls <code className="rounded bg-stone-100 px-1 font-mono text-stone-700">/api/manager-agent</code> which orchestrates all four agents and returns a complete care plan.
        </p>
        <div className="mt-4">
          <StandaloneAgentRunner
            patientId={patientId}
            endpoint="/api/manager-agent"
            agentName="AI Care Manager"
            agentColor="indigo"
            renderResult={(data) => (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Live result · {(data.agent as string) ?? "AI Care Manager"}
                </p>
                <AgentResultCards data={data} accentColor="indigo" />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
