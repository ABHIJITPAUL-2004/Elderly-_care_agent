"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

import { en } from "@/locales/en";
import { ja } from "@/locales/ja";
import type { Translations } from "@/locales/en";

export type Locale = "en" | "ja";

const LOCALE_STORAGE_KEY = "yorisoi_locale";

const translations: Record<Locale, Translations> = { en, ja };

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  t: en,
  setLocale: () => {},
});

let listeners: Array<() => void> = [];

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
};

const getSnapshot = () => {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return (stored === "ja" ? "ja" : "en") as Locale;
};

const getServerSnapshot = () => "en" as Locale;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore<Locale>(subscribe, getSnapshot, getServerSnapshot);

  function setLocale(next: Locale) {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    }
    // Notify all active listeners in this window
    listeners.forEach((l) => l());
  }

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

