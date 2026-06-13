"use client";

import { StandaloneAgentRunner } from "./StandaloneAgentRunner";
import { AgentResultCards } from "./AgentResultCards";
import type { DashboardSnapshot } from "@/lib/dashboard-data";

interface Props { patientId: string; snapshot: DashboardSnapshot }

export function HealthAgentClient({ patientId, snapshot }: Props) {
  const h = snapshot.health;

  return (
    <div className="space-y-8">
      {/* Static snapshot */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Current Snapshot · Fallback Data
        </p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Patient health at a glance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Health Status",        value: h.health_status },
            { label: "Risk Level",           value: h.risk_level },
            { label: "Risk Score",           value: String(Math.round(h.risk_score)) },
            { label: "Medication Adherence", value: `${Math.round(h.medication_adherence)}%` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-400">{item.label}</p>
              <p className="mt-1.5 text-xl font-semibold text-stone-800">{item.value}</p>
            </div>
          ))}
        </div>
        {h.recommendations.length > 0 && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Recommendations</p>
            <ul className="mt-2 space-y-1">
              {h.recommendations.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-emerald-800">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-stone-200" />

      {/* Live runner */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Live Agent Execution</p>
        <h2 className="mt-1 text-lg font-semibold text-stone-900">Run the Health Agent now</h2>
        <p className="mt-1 text-sm text-stone-500">
          Calls <code className="rounded bg-stone-100 px-1 font-mono text-stone-700">/api/health-agent</code> with the current patient context and returns a fresh AI-generated assessment.
        </p>
        <div className="mt-4">
          <StandaloneAgentRunner
            patientId={patientId}
            endpoint="/api/health-agent"
            agentName="Health Agent"
            agentColor="emerald"
            renderResult={(data) => (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Live result from Groq · {(data.agent as string) ?? "Health & Wellness Agent"}
                </p>
                <AgentResultCards data={data} accentColor="emerald" />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
