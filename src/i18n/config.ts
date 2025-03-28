import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translations
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import zhTranslations from './locales/zh.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      },
      fr: {
        translation: frTranslations
      },
      de: {
        translation: deTranslations
      },
      zh: {
        translation: zhTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'querystring', 'cookie', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferredLanguage',
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupFromPathIndex: 1,
      lookupFromSubdomainIndex: 1,
      checkWhitelist: true
    }
  });

export default i18n; 