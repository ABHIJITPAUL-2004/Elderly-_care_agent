"use client";

import { useState, useTransition } from "react";

export type AgentEndpoint =
  | "/api/health-agent"
  | "/api/safety-agent"
  | "/api/care-agent"
  | "/api/manager-agent";

interface Props {
  patientId: string;
  endpoint: AgentEndpoint;
  agentName: string;
  agentColor: "emerald" | "rose" | "sky" | "indigo";
  /** Render function receives the raw JSON result */
  renderResult: (data: Record<string, unknown>) => React.ReactNode;
}

const COLOR_MAP = {
  emerald: {
    btn:    "bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-emerald-500",
    badge:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot:    "bg-emerald-400",
    pulse:  "bg-emerald-500",
    border: "border-emerald-200",
    bg:     "bg-emerald-50/60",
    title:  "text-emerald-800",
  },
  rose: {
    btn:    "bg-rose-600 hover:bg-rose-500 focus-visible:ring-rose-500",
    badge:  "bg-rose-50 text-rose-700 border-rose-200",
    dot:    "bg-rose-400",
    pulse:  "bg-rose-500",
    border: "border-rose-200",
    bg:     "bg-rose-50/60",
    title:  "text-rose-800",
  },
  sky: {
    btn:    "bg-sky-600 hover:bg-sky-500 focus-visible:ring-sky-500",
    badge:  "bg-sky-50 text-sky-700 border-sky-200",
    dot:    "bg-sky-400",
    pulse:  "bg-sky-500",
    border: "border-sky-200",
    bg:     "bg-sky-50/60",
    title:  "text-sky-800",
  },
  indigo: {
    btn:    "bg-indigo-600 hover:bg-indigo-500 focus-visible:ring-indigo-500",
    badge:  "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot:    "bg-indigo-400",
    pulse:  "bg-indigo-500",
    border: "border-indigo-200",
    bg:     "bg-indigo-50/60",
    title:  "text-indigo-800",
  },
};

export function StandaloneAgentRunner({
  patientId,
  endpoint,
  agentName,
  agentColor,
  renderResult,
}: Props) {
  const c = COLOR_MAP[agentColor];
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ran, setRan] = useState(false);

  function handleRun() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ patientId }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as Record<string, unknown>;
        setResult(data);
        setRan(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setRan(true);
      }
    });
  }

  return (
    <section aria-label={`${agentName} standalone runner`} className="space-y-6">
      {/* Run panel */}
      <div className={`rounded-2xl border ${c.border} ${c.bg} p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${c.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ran && result ? c.pulse : "bg-stone-300"}`} />
                {ran && result ? "Live result" : "Ready"}
              </span>
              <span className="text-xs text-stone-400">Standalone mode</span>
            </div>
            <p className={`mt-2 text-sm font-medium ${c.title}`}>
              Run <strong>{agentName}</strong> independently against patient data.
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              Calls <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-stone-700">{endpoint}</code> directly.
            </p>
          </div>

          <button
            onClick={handleRun}
            disabled={isPending}
            aria-busy={isPending}
            className={[
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "disabled:opacity-60",
              c.btn,
            ].join(" ")}
          >
            {isPending && (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isPending ? "Running agent…" : `Run ${agentName}`}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <strong>Agent error:</strong> {error}
        </div>
      )}

      {/* Result */}
      {result && !error && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {renderResult(result)}
        </div>
      )}

      {/* Placeholder when not yet run */}
      {!ran && (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-400">
          Click <strong className="mx-1 text-stone-600">Run {agentName}</strong> to execute the agent and see live results.
        </div>
      )}
    </section>
  );
}
