"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/language-context";

const BRAND_ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" aria-hidden="true">
    <path
      d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
      fill="currentColor"
    />
  </svg>
);

const NAV_LINKS = [
  { href: "/",        labelKey: "dashboard" as const },
  { href: "/analyze", labelKey: "analyze"   as const },
  { href: "/agents",  labelKey: "agentHub"  as const },
];

const NAV_LABELS: Record<string, { en: string; ja: string }> = {
  dashboard: { en: "Dashboard", ja: "ダッシュボード" },
  analyze:   { en: "Live Analyze", ja: "ライブ分析" },
  agentHub:  { en: "Agent Hub", ja: "エージェントハブ" },
};

export function DashboardNav() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Yorisoi AI home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              {BRAND_ICON}
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">{t.nav.brand}</p>
              <p className="hidden text-xs text-stone-400 sm:block">{t.nav.tagline}</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              const label = NAV_LABELS[link.labelKey][locale];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-800",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Multi-agent AI · Next.js 15
          </span>
          <LanguageSwitcher />
        </div>

      </div>
    </header>
  );
}
