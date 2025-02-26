import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';

const savedLanguage = localStorage.getItem('userLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      de: { translation: deTranslations },
    },
    lng: savedLanguage, // Use the saved language or default to 'en'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;