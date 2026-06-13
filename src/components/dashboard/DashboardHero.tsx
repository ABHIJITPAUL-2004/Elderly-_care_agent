"use client";

import { useLanguage } from "@/lib/language-context";
import type { DashboardSnapshot } from "@/lib/dashboard-data";

const RISK_COLORS: Record<string, { badge: string; dot: string }> = {
  LOW:      { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  MODERATE: { badge: "bg-amber-50   text-amber-700   border-amber-200",   dot: "bg-amber-400"  },
  HIGH:     { badge: "bg-orange-50  text-orange-700  border-orange-200",  dot: "bg-orange-500" },
  CRITICAL: { badge: "bg-rose-50    text-rose-700    border-rose-200",    dot: "bg-rose-500"   },
};

interface Props { snapshot: DashboardSnapshot }

export function DashboardHero({ snapshot }: Props) {
  const { t } = useLanguage();
  const riskKey = snapshot.manager.overall_risk_level as "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  const risk = RISK_COLORS[riskKey] ?? RISK_COLORS.LOW;
  const riskLabel = t.riskLabels[riskKey] ?? riskKey;

  const activeIncidents = snapshot.incidents.filter((i) => i.status !== "RESOLVED");

  const stats = [
    {
      label: t.stats.targetPatient,
      value: snapshot.patient.fullName,
      sub: snapshot.patient.preferredName ?? snapshot.patient.address ?? "—",
    },
    {
      label: t.stats.latestRisk,
      value: riskLabel,
      sub: `${t.stats.overallScore} ${Math.round(snapshot.manager.overall_risk_score)}`,
      badge: risk.badge,
      dot: risk.dot,
    },
    {
      label: t.stats.medicationAdherence,
      value: `${Math.round(snapshot.health.medication_adherence)}%`,
      sub: `${snapshot.medications.length} ${t.stats.medicationsTracked}`,
    },
    {
      label: t.stats.monitoringStatus,
      value: activeIncidents.length > 0 ? t.stats.actionRequired : t.stats.stable,
      sub: `${t.stats.assignedTo} ${snapshot.caregivers.length} ${t.stats.caregivers}`,
      badge: activeIncidents.length > 0 ? RISK_COLORS.HIGH.badge : RISK_COLORS.LOW.badge,
      dot:   activeIncidents.length > 0 ? RISK_COLORS.HIGH.dot   : RISK_COLORS.LOW.dot,
    },
  ];

  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          {t.hero.eyebrow}
        </p>

        {/* Headline */}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
          {t.hero.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-500 sm:text-lg">
          {t.hero.subheadline}
        </p>

        {/* Stats row */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
                {s.label}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {s.dot && <span className={`h-2 w-2 rounded-full ${s.dot}`} />}
                <p className={`text-xl font-semibold text-stone-800 ${s.badge ? "" : ""}`}>
                  {s.value}
                </p>
              </div>
              <p className="mt-1 text-sm text-stone-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
