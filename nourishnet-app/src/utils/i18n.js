import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';
import fr from '../locales/fr.json';
import am from '../locales/am.json';
import tl from '../locales/tl.json';

// Read saved language from localStorage
function getSavedLanguage() {
  try {
    const prefs = JSON.parse(localStorage.getItem('nourishnet_prefs'));
    if (prefs && prefs.language) {
      return prefs.language;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', flag: '🇪🇹' },
  { code: 'tl', label: 'Tagalog', nativeLabel: 'Tagalog', flag: '🇵🇭' },
];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
    fr: { translation: fr },
    am: { translation: am },
    tl: { translation: tl },
  },
  lng: getSavedLanguage() || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
