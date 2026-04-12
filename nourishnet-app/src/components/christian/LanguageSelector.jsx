import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageSelector Component
 * 
 * Full-screen language selection that appears on first visit
 * Shows a dropdown with all 6 supported languages
 * Once selected, user proceeds to the main Gateway
 */

// All 6 supported languages
const LANGUAGES = [
  { 
    code: 'en', 
    label: 'English', 
    flag: '🇺🇸',
    nativeName: 'English',
    greeting: 'Welcome to NourishNet',
  },
  { 
    code: 'es', 
    label: 'Spanish', 
    flag: '🇪🇸',
    nativeName: 'Español',
    greeting: 'Bienvenido a NourishNet',
  },
  { 
    code: 'zh', 
    label: 'Chinese', 
    flag: '🇨🇳',
    nativeName: '中文',
    greeting: '欢迎来到 NourishNet',
  },
  { 
    code: 'fr', 
    label: 'French', 
    flag: '🇫🇷',
    nativeName: 'Français',
    greeting: 'Bienvenue sur NourishNet',
  },
  { 
    code: 'am', 
    label: 'Amharic', 
    flag: '🇪🇹',
    nativeName: 'አማርኛ',
    greeting: 'እንኳን ወደ NourishNet በደህና መጡ',
  },
  { 
    code: 'tl', 
    label: 'Tagalog', 
    flag: '🇵🇭',
    nativeName: 'Tagalog',
    greeting: 'Maligayang pagdating sa NourishNet',
  },
];

function LanguageSelector({ onLanguageSelected }) {
  const { i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setIsDropdownOpen(false);
    
    // Change i18n language
    i18n.changeLanguage(lang.code);
    
    // Persist to localStorage
    try {
      const existingPrefs = JSON.parse(localStorage.getItem('nourishnet_prefs') || '{}');
      const updatedPrefs = { 
        ...existingPrefs, 
        language: lang.code,
        hasSelectedLanguage: true 
      };
      localStorage.setItem('nourishnet_prefs', JSON.stringify(updatedPrefs));
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }

    // Small delay for visual feedback, then proceed
    setTimeout(() => {
      onLanguageSelected(lang.code);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-7xl">🥗</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">NourishNet</h1>
          <p className="text-gray-500 mt-2">Connecting communities to food resources</p>
        </div>

        {/* Language Selection Prompt */}
        <p className="text-lg text-gray-700 mb-6 font-medium">
          Select your preferred language
        </p>

        {/* Language Dropdown */}
        <div className="relative mb-6">
          {/* Dropdown Trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`
              w-full p-4 bg-white rounded-2xl shadow-soft border-2 
              flex items-center justify-between
              transition-all duration-200
              ${isDropdownOpen ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200 hover:border-primary-300'}
              ${selectedLang ? 'bg-primary-50' : ''}
            `}
          >
            {selectedLang ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedLang.flag}</span>
                <div className="text-left">
                  <span className="font-bold text-gray-900">{selectedLang.nativeName}</span>
                  <span className="text-gray-500 ml-2">({selectedLang.label})</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-500">
                <span className="text-2xl">🌐</span>
                <span>Tap to select language...</span>
              </div>
            )}
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`
                    w-full p-4 flex items-center gap-4 text-left
                    hover:bg-primary-50 transition-colors
                    border-b border-gray-100 last:border-b-0
                    ${selectedLang?.code === lang.code ? 'bg-primary-100' : ''}
                  `}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{lang.nativeName}</div>
                    <div className="text-sm text-gray-500">{lang.label}</div>
                  </div>
                  {selectedLang?.code === lang.code && (
                    <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Language Greeting */}
        {selectedLang && (
          <div className="animate-fade-in bg-white rounded-2xl shadow-soft p-6 mb-6">
            <p className="text-xl font-medium text-primary-600">{selectedLang.greeting}</p>
            <p className="text-sm text-gray-500 mt-2">Loading your experience...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Footer note */}
        {!selectedLang && (
          <p className="text-sm text-muted">
            You can change your language anytime from the menu
          </p>
        )}
      </div>
    </div>
  );
}

export default LanguageSelector;
