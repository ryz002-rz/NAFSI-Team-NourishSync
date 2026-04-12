import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all 6 language files
import en from '../locales/en.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';
import fr from '../locales/fr.json';
import am from '../locales/am.json';
import tl from '../locales/tl.json';

// Read saved language preference from localStorage
const getSavedLanguage = () => {
  try {
    const savedPrefs = JSON.parse(localStorage.getItem('nourishnet_prefs') || '{}');
    return savedPrefs.language || 'en';
  } catch (error) {
    console.warn('Could not read language preference from localStorage:', error);
    return 'en';
  }
};

const savedLang = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
    fr: { translation: fr },
    am: { translation: am },
    tl: { translation: tl },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
