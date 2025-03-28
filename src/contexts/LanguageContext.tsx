import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const value = {
    currentLanguage: i18n.language as Language,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}