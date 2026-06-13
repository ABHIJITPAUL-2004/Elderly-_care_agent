"use client";

import { useLanguage } from "@/lib/language-context";

export function DashboardFooter() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-white" aria-hidden="true">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="currentColor"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-stone-700">{t.nav.brand}</p>
        </div>
        <p className="text-xs text-stone-400">
          {t.footer.built} {t.footer.hackathon} · {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
