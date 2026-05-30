import React from "react";
import { useI18n } from "../i18n";

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage, t } = useI18n();
  const nextLanguage = language === "vi" ? "EN" : "VI";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="fixed bottom-40 right-6 z-50 inline-flex h-12 min-w-12 items-center justify-center rounded-full border border-[#E4EEE6] bg-surface-light px-3 text-xs font-bold text-text-main shadow-lg transition-colors hover:border-primary/40 hover:text-primary active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-200"
      aria-label={t("language.toggleLabel")}
      title={t("language.current", { language: language.toUpperCase() })}
    >
      {nextLanguage}
    </button>
  );
};

export default LanguageToggle;
