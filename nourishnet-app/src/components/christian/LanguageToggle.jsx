import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * LanguageToggle Component
 * 
 * Dropdown language selector in the navbar
 * Shows all 6 supported languages
 */

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸', short: 'EN' },
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'zh', label: '中文', flag: '🇨🇳', short: '中文' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹', short: 'አማ' },
  { code: 'tl', label: 'Tagalog', flag: '🇵🇭', short: 'TL' },
];

function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get current language object
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Persist to localStorage
    try {
      const existingPrefs = JSON.parse(localStorage.getItem('nourishnet_prefs') || '{}');
      const updatedPrefs = { ...existingPrefs, language: langCode };
      localStorage.setItem('nourishnet_prefs', JSON.stringify(updatedPrefs));
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-gray-100 hover:bg-gray-200 transition-colors
          ${isOpen ? 'ring-2 ring-primary-300' : ''}
        `}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">{currentLang.short}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                w-full px-4 py-3 flex items-center gap-3 text-left
                hover:bg-primary-50 transition-colors
                ${i18n.language === lang.code ? 'bg-primary-100 text-primary-700' : 'text-gray-700'}
              `}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
              {i18n.language === lang.code && (
                <svg className="w-4 h-4 text-primary-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageToggle;
