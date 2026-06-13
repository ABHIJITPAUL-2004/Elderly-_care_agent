import Link from "next/link";
import { getDashboardTargetPatientId } from "@/lib/dashboard-data";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";

const AGENTS = [
  {
    href: "/agents/health",
    number: "01",
    name: "Health & Wellness Agent",
    role: "Risk & Vitals Analysis",
    description:
      "Analyzes health records, medication adherence, sleep patterns, and step counts to generate a risk score and wellness trend analysis.",
    capabilities: ["Risk score calculation", "Medication adherence tracking", "Trend analysis over time", "Escalation to Safety Agent"],
    endpoint: "/api/health-agent",
    color: "emerald",
    icon: "heart",
  },
  {
    href: "/agents/safety",
    number: "02",
    name: "Safety & Emergency Agent",
    role: "Incident & Fall Risk",
    description:
      "Monitors incident history, detects fall risk, assesses emergency levels, and triggers escalation when life-safety thresholds are crossed.",
    capabilities: ["Incident detection", "Fall risk assessment", "Emergency level scoring", "Escalation to AI Care Manager"],
    endpoint: "/api/safety-agent",
    color: "rose",
    icon: "shield",
  },
  {
    href: "/agents/care",
    number: "03",
    name: "Care Coordination Agent",
    role: "Scheduling & Family",
    description:
      "Assigns caregivers, manages visit scheduling, generates family notifications, and tracks pending care tasks based on health and safety inputs.",
    capabilities: ["Caregiver assignment", "Visit scheduling", "Family notifications", "Pending task management"],
    endpoint: "/api/care-agent",
    color: "sky",
    icon: "users",
  },
  {
    href: "/agents/manager",
    number: "04",
    name: "AI Care Manager",
    role: "Orchestration & Synthesis",
    description:
      "The orchestration layer. Receives outputs from all three specialist agents and synthesizes them into a unified care plan with executive summary.",
    capabilities: ["Multi-agent orchestration", "Risk prioritization", "Unified care plan generation", "Executive summary"],
    endpoint: "/api/analyze",
    color: "indigo",
    icon: "chart",
  },
] as const;

const COLORS: Record<string, { border: string; bg: string; badge: string; btn: string; num: string; dot: string }> = {
  emerald: { border: "border-emerald-200", bg: "bg-emerald-50/50", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", btn: "bg-emerald-600 hover:bg-emerald-500 text-white", num: "text-emerald-500", dot: "bg-emerald-400" },
  rose:    { border: "border-rose-200",    bg: "bg-rose-50/50",    badge: "bg-rose-50 text-rose-700 border-rose-200",       btn: "bg-rose-600    hover:bg-rose-500    text-white", num: "text-rose-500",    dot: "bg-rose-400"    },
  sky:     { border: "border-sky-200",     bg: "bg-sky-50/50",     badge: "bg-sky-50 text-sky-700 border-sky-200",          btn: "bg-sky-600     hover:bg-sky-500     text-white", num: "text-sky-500",     dot: "bg-sky-400"     },
  indigo:  { border: "border-indigo-200",  bg: "bg-indigo-50/50",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200", btn: "bg-indigo-600  hover:bg-indigo-500  text-white", num: "text-indigo-500",  dot: "bg-indigo-400"  },
};

const ICONS: Record<string, React.ReactNode> = {
  heart: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />,
};

export const metadata = {
  title: "Agent Hub · Yorisoi AI",
  description: "Explore and run each AI agent independently or watch them collaborate in the multi-agent pipeline.",
};

export default function AgentsPage() {
  const patientId = getDashboardTargetPatientId();

  return (
    <div className="min-h-screen bg-transparent">
      <DashboardNav />

      {/* Hero */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Agent Hub
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            Four specialized agents.<br className="hidden sm:block" /> One care system.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-stone-500">
            Each agent operates independently or as part of the multi-agent pipeline. Run any agent
            directly to see how it reasons, or use the full pipeline from the Dashboard.
          </p>

          {/* Mode explanation */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Standalone Mode</p>
              <p className="mt-1 text-sm font-semibold text-stone-800">Run any single agent</p>
              <p className="mt-1 text-sm leading-6 text-stone-500">
                Visit an agent page and click Run to call its dedicated API endpoint directly. Results appear instantly — no other agents involved.
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Orchestration Mode</p>
              <p className="mt-1 text-sm font-semibold text-indigo-800">Full pipeline via Dashboard</p>
              <p className="mt-1 text-sm leading-6 text-indigo-700">
                The Dashboard runs Health → Safety → Care → Manager in sequence. Each output feeds the next agent before the Care Manager synthesizes everything.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Agent cards grid */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {AGENTS.map((agent) => {
            const c = COLORS[agent.color];
            return (
              <div
                key={agent.href}
                className={`rounded-2xl border ${c.border} ${c.bg} p-6`}
              >
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${c.border} bg-white shadow-sm`}>
                    <svg className={`h-5 w-5 ${c.num}`} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
                      {ICONS[agent.icon]}
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${c.num}`}>{agent.number}</p>
                    <p className="text-base font-semibold text-stone-900">{agent.name}</p>
                    <span className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${c.badge}`}>
                      {agent.role}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-stone-600">{agent.description}</p>

                {/* Capabilities */}
                <ul className="mt-4 space-y-1.5">
                  {agent.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center gap-2 text-sm text-stone-600">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
                      {cap}
                    </li>
                  ))}
                </ul>

                {/* Endpoint */}
                <p className="mt-4 text-xs text-stone-400">
                  Endpoint:{" "}
                  <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-stone-600">
                    POST {agent.endpoint}
                  </code>
                </p>

                {/* CTA */}
                <div className="mt-5 flex gap-3">
                  <Link
                    href={agent.href}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${c.btn}`}
                  >
                    Open agent
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm transition-colors hover:bg-stone-50"
                  >
                    Full pipeline
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pipeline diagram */}
        <div className="mt-12 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Multi-Agent Orchestration Flow</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-900">How they collaborate</h2>
          <p className="mt-2 text-sm leading-6 text-stone-500 max-w-xl">
            In orchestration mode, the pipeline runs sequentially. Health and Safety agents execute in parallel,
            then feed the Care Agent, which feeds the AI Care Manager for final synthesis.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { label: "Patient Data", color: "bg-stone-200 text-stone-700" },
              null,
              { label: "Health Agent + Safety Agent", color: "bg-emerald-100 text-emerald-800", parallel: true },
              null,
              { label: "Care Agent", color: "bg-sky-100 text-sky-800" },
              null,
              { label: "AI Care Manager", color: "bg-indigo-100 text-indigo-800" },
              null,
              { label: "Care Plan", color: "bg-indigo-600 text-white" },
            ].map((item, i) => {
              if (!item) {
                return (
                  <svg key={`arrow-${i}`} className="h-4 w-4 shrink-0 text-stone-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                );
              }
              return (
                <span key={item.label} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${item.color}`}>
                  {item.label}
                </span>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Patient ID used for this session:{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-stone-600">{patientId}</code>
          </p>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}
