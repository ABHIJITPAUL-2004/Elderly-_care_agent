"use client";

import { useLanguage } from "@/lib/language-context";

const AGENT_COLORS = {
  health:  { ring: "ring-emerald-200", bg: "bg-emerald-50",  icon: "text-emerald-600", bar: "bg-emerald-500"  },
  safety:  { ring: "ring-rose-200",    bg: "bg-rose-50",     icon: "text-rose-600",    bar: "bg-rose-500"    },
  care:    { ring: "ring-sky-200",     bg: "bg-sky-50",      icon: "text-sky-600",     bar: "bg-sky-500"     },
  manager: { ring: "ring-indigo-200",  bg: "bg-indigo-50",   icon: "text-indigo-600",  bar: "bg-indigo-500"  },
};

const ICONS = {
  health: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  ),
  safety: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  ),
  care: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  ),
  manager: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  ),
};

type AgentKey = keyof typeof AGENT_COLORS;

export function AgentFlowSection() {
  const { t } = useLanguage();

  const agents: AgentKey[] = ["health", "safety", "care", "manager"];

  return (
    <section className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          {t.agentFlow.description}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-stone-900">{t.agentFlow.title}</h2>

        <div className="mt-10 flex flex-col items-center gap-0 lg:flex-row lg:items-stretch lg:gap-0">
          {/* Patient Data source node */}
          <FlowNode label={t.agentFlow.patientData} isSource />

          {agents.map((key, i) => {
            const colors = AGENT_COLORS[key];
            const info = t.agentFlow.agents[key];
            return (
              <div key={key} className="flex flex-col items-center lg:flex-row">
                {/* Connector arrow */}
                <Arrow />
                {/* Agent card */}
                <div
                  className={`w-44 rounded-2xl border ${colors.ring} ring-1 ${colors.bg} px-4 py-5 text-center shadow-sm`}
                >
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} shadow-inner ring-1 ${colors.ring}`}>
                    <svg className={`h-5 w-5 ${colors.icon}`} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
                      {ICONS[key]}
                    </svg>
                  </div>
                  <p className={`mt-3 text-xs font-bold uppercase tracking-wide ${colors.icon}`}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-stone-800">{info.name}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{info.role}</p>
                  <p className="mt-2 text-xs leading-5 text-stone-500">{info.description}</p>
                  <div className={`mt-3 h-0.5 w-10 mx-auto rounded-full ${colors.bar}`} />
                </div>
              </div>
            );
          })}

          {/* Final care plan node */}
          <Arrow />
          <FlowNode label={t.agentFlow.carePlan} isDestination />
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center">
      {/* vertical on mobile, horizontal on lg */}
      <svg className="h-8 w-8 text-stone-300 lg:h-5 lg:w-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        {/* Down on mobile */}
        <path className="block lg:hidden" d="M16 4 L16 28 M10 22 L16 28 L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Right on desktop */}
        <path className="hidden lg:block" d="M4 16 L28 16 M22 10 L28 16 L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function FlowNode({ label, isSource, isDestination }: { label: string; isSource?: boolean; isDestination?: boolean }) {
  const color = isSource
    ? "bg-stone-100 border-stone-300 text-stone-600"
    : isDestination
      ? "bg-indigo-600 border-indigo-600 text-white"
      : "";
  return (
    <div className={`flex w-32 items-center justify-center rounded-2xl border-2 px-3 py-5 text-center text-sm font-semibold shadow-sm ${color}`}>
      {label}
    </div>
  );
}
