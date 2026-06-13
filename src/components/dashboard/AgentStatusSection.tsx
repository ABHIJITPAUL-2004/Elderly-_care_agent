"use client";

import { useLanguage } from "@/lib/language-context";
import type { DashboardSnapshot, DashboardActivityItem } from "@/lib/dashboard-data";

const TONE_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
  health:  { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400", label: "" },
  safety:  { badge: "bg-rose-50    text-rose-700    border-rose-200",    dot: "bg-rose-400",    label: "" },
  care:    { badge: "bg-sky-50     text-sky-700     border-sky-200",     dot: "bg-sky-400",     label: "" },
  manager: { badge: "bg-indigo-50  text-indigo-700  border-indigo-200",  dot: "bg-indigo-400",  label: "" },
};

interface Props {
  snapshot: DashboardSnapshot;
  activityFeed: DashboardActivityItem[];
}

export function AgentStatusSection({ snapshot, activityFeed }: Props) {
  const { t } = useLanguage();

  const agents = [
    {
      key: "health",
      label: t.agentCards.health.label,
      tone: "health",
      summary: snapshot.health.health_status,
      details: [
        `${t.agentCards.risk} ${t.riskLabels[snapshot.health.risk_level as keyof typeof t.riskLabels] ?? snapshot.health.risk_level}`,
        `${t.agentCards.adherence} ${Math.round(snapshot.health.medication_adherence)}%`,
        snapshot.health.recommendations[0] ?? "No extra action needed",
      ],
    },
    {
      key: "safety",
      label: t.agentCards.safety.label,
      tone: "safety",
      summary: snapshot.safety.executive_summary,
      details: [
        snapshot.safety.incident_detected
          ? snapshot.safety.incident_type
          : t.agentCards.safety.noOpenIncident,
        `${t.agentCards.emergencyLevel} ${snapshot.safety.emergency_level}`,
        snapshot.safety.recommended_actions[0] ?? "Routine monitoring",
      ],
    },
    {
      key: "care",
      label: t.agentCards.care.label,
      tone: "care",
      summary: snapshot.care.executive_summary,
      details: [
        `${t.agentCards.priority} ${snapshot.care.priority_level}`,
        snapshot.care.assigned_caregiver?.fullName ?? t.agentCards.care.unassigned,
        snapshot.care.pending_tasks[0] ?? t.agentCards.care.scheduleVisit,
      ],
    },
    {
      key: "manager",
      label: t.agentCards.manager.label,
      tone: "manager",
      summary: snapshot.manager.executive_summary,
      details: [
        `${t.agentCards.overall} ${t.riskLabels[snapshot.manager.overall_risk_level as keyof typeof t.riskLabels] ?? snapshot.manager.overall_risk_level}`,
        `${t.agentCards.score} ${Math.round(snapshot.manager.overall_risk_score)}`,
        snapshot.manager.required_followups[0] ?? t.agentCards.manager.reviewFollowups,
      ],
    },
  ];

  return (
    <section className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Agent cards */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {t.agentCards.description}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">{t.agentCards.title}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {agents.map((agent) => {
                const style = TONE_STYLES[agent.tone];
                return (
                  <div key={agent.key} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        {agent.label}
                      </span>
                      <span className="text-xs text-stone-400">{t.agentCards.active}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-600">{agent.summary}</p>
                    <ul className="mt-3 space-y-1.5">
                      {agent.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-stone-500">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {t.activityFeed.description}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">{t.activityFeed.title}</h2>
            <div className="mt-6 space-y-3">
              {activityFeed.map((item) => {
                const style = TONE_STYLES[item.tone];
                const toneLabel = t.activityFeed.toneLabels[item.tone as keyof typeof t.activityFeed.toneLabels] ?? item.tone;
                return (
                  <div key={item.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-800">{item.title}</p>
                        <p className="mt-1 text-sm leading-5 text-stone-500">{item.detail}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                        {toneLabel}
                      </span>
                    </div>
                    <p className="mt-2.5 text-xs text-stone-400">{item.timestamp}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
