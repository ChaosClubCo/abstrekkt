import { useState } from 'react';

/**
 * Representation of a translation dictionary. Keys map to localized
 * strings. In a real implementation, dictionaries would be loaded
 * from JSON files or a CMS and support interpolation and pluralization.
 */
export type TranslationDict = Record<string, string>;

export interface Language {
  code: string;
  name: string;
  dict: TranslationDict;
}

/**
 * Hook to manage localization and language selection. Provides a
 * translation function `t` that returns the localized string for a
 * given key. Allows switching languages and adding new translations.
 */
export function useLocalization() {
  const [languages, setLanguages] = useState<Language[]>([{
    code: 'en',
    name: 'English',
    dict: {
      greeting: 'Hello',
      description: 'Welcome to FlashFusion!',
    },
  }, {
    code: 'es',
    name: 'Español',
    dict: {
      greeting: 'Hola',
      description: '¡Bienvenido a FlashFusion!',
    },
  }]);
  const [currentLanguageCode, setCurrentLanguageCode] = useState<string>('en');
  const [logs, setLogs] = useState<string[]>([]);

  const addLanguage = (code: string, name: string, dict: TranslationDict) => {
    setLanguages((prev) => [...prev, { code, name, dict }]);
    setLogs((prev) => [`[${new Date().toISOString()}] Added language: ${code}`, ...prev]);
  };

  const changeLanguage = (code: string) => {
    setCurrentLanguageCode(code);
    setLogs((prev) => [`[${new Date().toISOString()}] Changed language to ${code}`, ...prev]);
  };

  const t = (key: string): string => {
    const lang = languages.find((l) => l.code === currentLanguageCode);
    return lang?.dict[key] ?? key;
  };

  return {
    languages,
    currentLanguageCode,
    addLanguage,
    changeLanguage,
    t,
    logs,
  };
}