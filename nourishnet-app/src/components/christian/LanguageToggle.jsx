import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

function LanguageToggle() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  const filtered = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = search.toLowerCase();
    return (
      lang.label.toLowerCase().includes(q) ||
      lang.nativeLabel.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    try {
      const existing = JSON.parse(localStorage.getItem('nourishnet_prefs')) || {};
      localStorage.setItem(
        'nourishnet_prefs',
        JSON.stringify({ ...existing, language: code })
      );
    } catch {
      localStorage.setItem(
        'nourishnet_prefs',
        JSON.stringify({ language: code })
      );
    }
    setOpen(false);
    setSearch('');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-soft transition-all text-sm font-medium text-neutral-700"
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span>{currentLang.nativeLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-hover border border-neutral-200 z-50 overflow-hidden"
          role="listbox"
          aria-label="Language options"
        >
          <div className="p-2 border-b border-neutral-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={currentLang.code === 'en' ? 'Search languages...' : '🔍'}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
              aria-label="Search languages"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary-50 transition-colors ${
                    lang.code === i18n.language
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-neutral-700'
                  }`}
                  role="option"
                  aria-selected={lang.code === i18n.language}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{lang.nativeLabel}</span>
                    <span className="text-xs text-neutral-400">{lang.label}</span>
                  </div>
                  {lang.code === i18n.language && (
                    <svg className="w-4 h-4 ml-auto text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-neutral-400 text-center">
                No languages found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LanguageToggle;
