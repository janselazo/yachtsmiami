"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { translations, type Locale, type Translations } from "@/i18n/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LOCALE_EVENT = "yachtsmiami:locale";

function readLocale(): Locale {
  if (typeof window === "undefined") return "en";

  try {
    const stored = localStorage.getItem("locale");
    if (stored === "en" || stored === "es") return stored;
  } catch {
    // Storage blocked in some embedded browsers.
  }

  if (navigator.language.toLowerCase().startsWith("es")) return "es";
  return "en";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LOCALE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(LOCALE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot(): Locale {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, getServerSnapshot);

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem("locale", next);
    } catch {
      // Ignore storage failures.
    }

    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translations[locale].meta.title;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translations[locale],
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
