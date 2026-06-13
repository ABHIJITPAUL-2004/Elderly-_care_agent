"use client";

import { useLanguage } from "@/lib/language-context";
import type { DashboardSnapshot } from "@/lib/dashboard-data";
import type { ComponentType } from "react";

interface LiveAiRefreshProps {
  patientId: string;
  initialSummary: string;
  initialRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  initialRiskScore: number;
  initialPriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface Props {
  snapshot: DashboardSnapshot;
  LiveAiRefresh: ComponentType<LiveAiRefreshProps>;
}

const RISK_CHIP: Record<string, string> = {
  LOW:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  MODERATE: "bg-amber-50   text-amber-700   border-amber-200",
  HIGH:     "bg-orange-50  text-orange-700  border-orange-200",
  CRITICAL: "bg-rose-50    text-rose-700    border-rose-200",
};

export function PatientAndLiveSection({ snapshot, LiveAiRefresh }: Props) {
  const { t } = useLanguage();
  const latestHealth = snapshot.healthRecords[0];
  const riskChip = RISK_CHIP[snapshot.manager.overall_risk_level] ?? RISK_CHIP.LOW;

  return (
    <section className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Patient Details */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {t.patientDetails.description}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">{t.patientDetails.title}</h2>

            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-6">
              {/* Name + status */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-stone-900">{snapshot.patient.fullName}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {snapshot.patient.dateOfBirth ?? "—"} · {snapshot.patient.gender ?? t.patientDetails.genderNotProvided}
                  </p>
                </div>
                <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${riskChip}`}>
                  {t.riskLabels[snapshot.manager.overall_risk_level as keyof typeof t.riskLabels]}
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                <ProgressRow
                  label={t.patientDetails.medicationAdherence}
                  value={snapshot.health.medication_adherence}
                  color="bg-indigo-500"
                />
                <ProgressRow
                  label={t.patientDetails.overallRisk}
                  value={snapshot.manager.overall_risk_score}
                  color="bg-orange-400"
                />
              </div>

              {/* Conditions */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.patientDetails.conditions}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {snapshot.patient.conditions.map((c) => (
                    <span key={c} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-0.5 text-xs text-stone-600">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Caregivers & Meds */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.patientDetails.caregivers}</p>
                  <ul className="mt-2 space-y-1.5">
                    {snapshot.caregivers.map((cg) => (
                      <li key={cg.id} className="rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-stone-700">
                        {cg.fullName} · {cg.relationship}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.patientDetails.medications}</p>
                  <ul className="mt-2 space-y-1.5">
                    {snapshot.medications.map((m) => (
                      <li key={m.id} className="rounded-lg border border-stone-100 bg-stone-50 px-3 py-2 text-sm text-stone-700">
                        {m.name} · {m.frequency}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recent incident */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.patientDetails.recentIncident}</p>
                <div className="mt-2 rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-sm font-semibold text-stone-800">
                    {snapshot.incidents[0]?.incidentType ?? t.patientDetails.noRecentIncident}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">
                    {snapshot.incidents[0]?.description ?? t.patientDetails.noIncidentSignals}
                  </p>
                </div>
              </div>

              {/* Latest health status */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t.patientDetails.latestStatus}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {latestHealth?.healthStatus ?? snapshot.manager.executive_summary}
                </p>
              </div>
            </div>
          </div>

          {/* Live AI Refresh */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              {t.liveRefresh.description}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">{t.liveRefresh.title}</h2>
            <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <LiveAiRefresh
                patientId={snapshot.patient.id}
                initialSummary={snapshot.manager.executive_summary}
                initialRiskLevel={snapshot.manager.overall_risk_level}
                initialRiskScore={snapshot.manager.overall_risk_score}
                initialPriority={snapshot.manager.priority_level}
              />
            </div>

            {/* Manager summary panel */}
            <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">{t.managerCard.description}</p>
              <p className="mt-2 text-base font-semibold text-indigo-900 leading-6">
                {snapshot.manager.executive_summary}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                {[
                  { label: t.managerCard.health, value: t.riskLabels[snapshot.health.risk_level as keyof typeof t.riskLabels] ?? snapshot.health.risk_level },
                  { label: t.managerCard.safety, value: snapshot.safety.incident_detected ? snapshot.safety.incident_type : t.managerCard.noActiveIncident },
                  { label: t.managerCard.care, value: snapshot.care.priority_level },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/70 px-3 py-2">
                    <p className="text-xs text-indigo-400">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-indigo-800 truncate">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-600">{label}</span>
        <span className="font-medium text-stone-800">{Math.round(value)}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(value)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
