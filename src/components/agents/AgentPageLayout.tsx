import Link from "next/link";
import type { ReactNode } from "react";

interface Breadcrumb { label: string; href: string }

interface Props {
  breadcrumbs: Breadcrumb[];
  eyebrow: string;
  title: string;
  subtitle: string;
  accentColor: "emerald" | "rose" | "sky" | "indigo";
  badge?: string;
  children: ReactNode;
}

const ACCENT: Record<string, string> = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  rose:    "text-rose-600 bg-rose-50 border-rose-200",
  sky:     "text-sky-600 bg-sky-50 border-sky-200",
  indigo:  "text-indigo-600 bg-indigo-50 border-indigo-200",
};

const EYEBROW: Record<string, string> = {
  emerald: "text-emerald-600",
  rose:    "text-rose-600",
  sky:     "text-sky-600",
  indigo:  "text-indigo-600",
};

export function AgentPageLayout({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  accentColor,
  badge,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Breadcrumb bar */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-stone-700 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-medium text-stone-700" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Page header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className={`text-xs font-semibold uppercase tracking-widest ${EYEBROW[accentColor]}`}>
            {eyebrow}
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-500">{subtitle}</p>
            </div>
            {badge && (
              <span
                className={`mt-1 shrink-0 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${ACCENT[accentColor]}`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {children}
      </main>
    </div>
  );
}
