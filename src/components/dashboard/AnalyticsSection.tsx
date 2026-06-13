"use client";

import { useLanguage } from "@/lib/language-context";
import type { DashboardSnapshot } from "@/lib/dashboard-data";
import type { ComponentType } from "react";
import type { HealthRecord } from "@/types";

interface ChartProps { healthRecords: HealthRecord[] }

interface Props {
  snapshot: DashboardSnapshot;
  HealthAnalyticsChart: ComponentType<ChartProps>;
}

export function AnalyticsSection({ snapshot, HealthAnalyticsChart }: Props) {
  const { t } = useLanguage();

  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          {t.analytics.description}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-stone-900">{t.analytics.title}</h2>
        <div className="mt-6">
          <HealthAnalyticsChart healthRecords={snapshot.healthRecords} />
        </div>
      </div>
    </section>
  );
}
