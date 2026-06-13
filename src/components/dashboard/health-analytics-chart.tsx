"use client";

import { useMemo, useSyncExternalStore } from "react";

import { averageNumber } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import type { HealthRecord } from "@/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HealthAnalyticsChartProps {
  healthRecords: HealthRecord[];
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function HealthAnalyticsChart({ healthRecords }: HealthAnalyticsChartProps) {
  const { t } = useLanguage();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const chartData = useMemo(
    () =>
      [...healthRecords]
        .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
        .map((record) => ({
          date: record.recordedAt.slice(5, 10),
          riskScore: record.riskScore,
          adherence: record.medicationAdherence,
          sleepHours: record.sleepHours,
        })),
    [healthRecords],
  );

  const averageRisk = averageNumber(chartData.map((e) => e.riskScore));
  const averageAdherence = averageNumber(chartData.map((e) => e.adherence));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: t.analytics.avgRisk, value: Math.round(averageRisk) },
          { label: t.analytics.avgAdherence, value: `${Math.round(averageAdherence)}%` },
          { label: t.analytics.snapshots, value: chartData.length },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <p className="text-xs font-medium text-stone-400">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-stone-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="h-[280px] min-w-0 rounded-xl border border-stone-200 bg-white p-4">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e7e5e4" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                stroke="#a8a29e"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#a8a29e"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e7e5e4",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  color: "#1c1917",
                  fontSize: "13px",
                }}
                labelStyle={{ color: "#78716c", fontWeight: 500 }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#78716c", paddingTop: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                name={t.analytics.riskScore}
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#f97316" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="adherence"
                name={t.analytics.adherence}
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#4f46e5" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            {t.analytics.chartLoading}
          </div>
        )}
      </div>
    </div>
  );
}
