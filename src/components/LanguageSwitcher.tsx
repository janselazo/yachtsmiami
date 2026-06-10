"use client";

import { locales, type Locale } from "@/i18n/translations";
import { useLanguage } from "@/i18n/LanguageProvider";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={`lang-switch relative z-20 shrink-0 ${className}`.trim()}
      role="group"
      aria-label={t.a11y.language}
    >
      {locales.map((code) => {
        const isActive = locale === code;

        return (
          <button
            key={code}
            type="button"
            className={`lang-switch-btn ${isActive ? "is-active" : ""}`}
            aria-pressed={isActive}
            aria-current={isActive ? "true" : undefined}
            onClick={() => setLocale(code)}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
