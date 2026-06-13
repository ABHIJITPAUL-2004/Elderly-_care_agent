"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { scenarios } from "@/data/scenarios";

interface Props {
  currentPatientId: string;
}

const LOCAL_TRANSLATIONS = {
  en: {
    title: "Hackathon Quick Actions",
    description: "Control the presentation. Toggle predefined scenarios, trigger live agent analysis, or enter custom data.",
    scenarioLabel: "Select Predefined Scenario",
    selectPlaceholder: "Choose a care scenario...",
    analyzeCustom: "Analyze Custom Patient",
    runPipeline: "Run Multi-Agent Pipeline",
    runningPipeline: "Running Orchestration...",
    success: "Analysis complete! Dashboard updated.",
    error: "Pipeline failed to execute.",
  },
  ja: {
    title: "ハッカソン クイックアクション",
    description: "プレゼンテーション用操作パネル。シナリオの切り替え、マルチエージェント連携の実行、カスタムデータの入力が可能です。",
    scenarioLabel: "デモシナリオの選択",
    selectPlaceholder: "シナリオを選択してください...",
    analyzeCustom: "カスタム患者データ入力",
    runPipeline: "マルチエージェント連携を実行",
    runningPipeline: "連携実行中...",
    success: "分析完了！ダッシュボードが更新されました。",
    error: "パイプラインの実行に失敗しました。",
  },
};

export function QuickActionsCard({ currentPatientId }: Props) {
  const { locale } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const t = LOCAL_TRANSLATIONS[locale] ?? LOCAL_TRANSLATIONS.en;

  const currentScenario = scenarios.find(s => s.patientId === currentPatientId);

  const handleScenarioChange = (patientId: string) => {
    if (!patientId) return;
    setStatusMessage(null);
    router.push(`/?patientId=${patientId}`);
  };

  const handleRunPipeline = () => {
    setStatusMessage({ text: t.runningPipeline, type: "info" });
    startTransition(async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId: currentPatientId }),
        });

        if (!response.ok) {
          throw new Error("Pipeline call failed");
        }

        setStatusMessage({ text: t.success, type: "success" });
        router.refresh();
      } catch (err) {
        console.error(err);
        setStatusMessage({ text: t.error, type: "error" });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-bold text-white uppercase">
              Demo
            </span>
            {t.title}
          </h3>
          <p className="mt-1 text-sm text-stone-500 max-w-xl">
            {t.description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {/* Scenario selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            {t.scenarioLabel}
          </label>
          <select
            value={currentScenario?.patientId ?? ""}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm text-stone-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="" disabled>
              {t.selectPlaceholder}
            </option>
            {scenarios.map((s) => (
              <option key={s.id} value={s.patientId}>
                {s.title} ({s.riskLevel})
              </option>
            ))}
          </select>
        </div>

        {/* Pipeline Trigger */}
        <div className="flex flex-col justify-end">
          <button
            onClick={handleRunPipeline}
            disabled={isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.runningPipeline}
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 00-.7-2.13 11.96 11.96 0 00-3.41-5.51m10.11 2.13a11.96 11.96 0 00-3.41-5.51m0 0C19.05 4.56 16.9 4 14.71 4c-1.5 0-2.99.25-4.4.75m10.11 2.13c.19-.01.39-.02.58-.02h.01c.42 0 .84.03 1.25.1m-10.11 4.9a11.96 11.96 0 013.41 5.51m0 0A14.98 14.98 0 0112 18.04a14.98 14.98 0 01-3.41-5.51m3.41 5.51a14.98 14.98 0 01-1.88-4.57 14.96 14.96 0 01-1.53-2.13M12 4v16M4 12h16" />
                </svg>
                {t.runPipeline}
              </>
            )}
          </button>
        </div>

        {/* Custom analysis page */}
        <div className="flex flex-col justify-end">
          <Link
            href="/analyze"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 shadow-sm transition-colors hover:bg-stone-50"
          >
            <svg className="h-4 w-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.analyzeCustom}
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className={`mt-4 rounded-xl border p-3.5 text-sm leading-6 flex items-start gap-2.5 ${
          statusMessage.type === "success" 
            ? "border-emerald-200 bg-emerald-50 text-emerald-800" 
            : statusMessage.type === "error" 
            ? "border-rose-200 bg-rose-50 text-rose-800" 
            : "border-indigo-100 bg-indigo-50 text-indigo-800"
        }`}>
          {statusMessage.type === "info" && (
            <svg className="h-5 w-5 animate-spin text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {statusMessage.type === "success" && (
            <span className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
          )}
          {statusMessage.type === "error" && (
            <span className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {currentScenario && (
        <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Scenario Focus</p>
          <p className="mt-1 text-sm font-semibold text-stone-800">{currentScenario.description}</p>
          <p className="mt-1 text-xs text-stone-500 leading-relaxed">{currentScenario.riskDetails}</p>
        </div>
      )}
    </div>
  );
}
