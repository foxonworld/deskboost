import React, { useEffect, useState } from "react";

import { useI18n } from "../i18n";

const getSystemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") return true;
  if (storedTheme === "light") return false;
  return getSystemPrefersDark();
};

const applyTheme = (isDark: boolean) => {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
};

const ThemeToggle: React.FC = () => {
  const { t } = useI18n();
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    if (localStorage.getItem("theme")) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) =>
      setIsDark(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-24 right-6 z-50 rounded-full border border-[#E4EEE6] bg-surface-light p-3 text-text-main shadow-lg transition-colors hover:border-primary/40 hover:text-primary active:scale-95 dark:border-[#2A4532] dark:bg-surface-dark dark:text-slate-200"
      aria-label={t("theme.toggleLabel")}
      title={t("theme.toggleLabel")}
    >
      <span className="material-symbols-outlined">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
