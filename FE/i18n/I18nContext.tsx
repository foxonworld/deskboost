import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  locales,
  type Language,
  type TranslationKey,
  type TranslationParams,
} from "./locales";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const isSupportedLanguage = (value: string | null): value is Language =>
  Boolean(value && SUPPORTED_LANGUAGES.includes(value as Language));

const getInitialLanguage = (): Language => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(storedLanguage)
    ? storedLanguage
    : DEFAULT_LANGUAGE;
};

const interpolate = (value: string, params?: TranslationParams) => {
  if (!params) return value;

  return Object.entries(params).reduce(
    (result, [key, paramValue]) =>
      result.replaceAll(`{${key}}`, String(paramValue)),
    value,
  );
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  const toggleLanguage = () => {
    setLanguageState((currentLanguage) =>
      currentLanguage === "vi" ? "en" : "vi",
    );
  };

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: (key: TranslationKey, params?: TranslationParams) =>
        interpolate(locales[language][key] || locales.vi[key] || key, params),
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
};
