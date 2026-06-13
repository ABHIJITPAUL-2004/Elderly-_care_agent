"use client";

import { useLanguage, type Locale } from "@/lib/language-context";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ja", label: "日本語" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="flex items-center rounded-full border border-stone-200 bg-white p-0.5 shadow-sm"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setLocale(option.value)}
          aria-pressed={locale === option.value}
          className={[
            "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
            locale === option.value
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-stone-500 hover:text-stone-800",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
