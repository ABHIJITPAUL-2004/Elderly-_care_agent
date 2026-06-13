"use client";

import { useState, useTransition } from "react";

import { useLanguage } from "@/lib/language-context";

interface LiveAnalyzeResponse {
  manager: {
    executive_summary: string;
    overall_risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    overall_risk_score: number;
    priority_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
  health: {
    risk_level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    medication_adherence: number;
  };
  safety: {
    incident_detected: boolean;
    incident_type: string;
  };
  care: {
    priority_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
}

interface LiveAiRefreshProps {
  patientId: string;
  initialSummary: string;
  initialRiskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  initialRiskScore: number;
  initialPriority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const riskColors: Record<string, string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MODERATE: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
};

export function LiveAiRefresh({
  patientId,
  initialSummary,
  initialRiskLevel,
  initialRiskScore,
  initialPriority,
}: LiveAiRefreshProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState(initialSummary);
  const [riskLevel, setRiskLevel] = useState(initialRiskLevel);
  const [riskScore, setRiskScore] = useState(initialRiskScore);
  const [priority, setPriority] = useState(initialPriority);
  const [status, setStatus] = useState<"idle" | "loaded" | "error">("idle");

  function handleRefresh() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ patientId }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as LiveAnalyzeResponse;
        setSummary(data.manager.executive_summary);
        setRiskLevel(data.manager.overall_risk_level);
        setRiskScore(data.manager.overall_risk_score);
        setPriority(data.care.priority_level);
        setStatus("loaded");
      } catch {
        setStatus("error");
      }
    });
  }

  const statusBadge =
    status === "loaded"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "error"
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-stone-50 text-stone-500 border-stone-200";

  const statusText =
    status === "loaded"
      ? t.liveRefresh.liveConnected
      : status === "error"
        ? t.liveRefresh.liveUnavailable
        : t.liveRefresh.idle;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
            {t.liveRefresh.liveApiLabel}
          </p>
          <p className="mt-0.5 text-sm text-stone-500">{t.liveRefresh.subtitle}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge}`}
        >
          {status === "loaded" && (
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
          {statusText}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: t.liveRefresh.riskScore, value: Math.round(riskScore) },
          {
            label: t.liveRefresh.riskLevel,
            value: riskLevel,
            badge: riskColors[riskLevel] ?? riskColors.LOW,
          },
          { label: t.liveRefresh.priority, value: priority },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
          >
            <p className="text-xs text-stone-400">{item.label}</p>
            {item.badge ? (
              <span
                className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${item.badge}`}
              >
                {item.value}
              </span>
            ) : (
              <p className="mt-1 text-lg font-semibold text-stone-800">{item.value}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm leading-6 text-stone-600">{summary}</p>

      <button
        onClick={handleRefresh}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60"
      >
        {isPending && (
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {isPending ? t.liveRefresh.loadingButton : t.liveRefresh.loadButton}
      </button>
    </div>
  );
}
