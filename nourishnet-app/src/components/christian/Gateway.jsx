import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';

function Gateway() {
  const { t, i18n } = useTranslation();

  // Show language selector on first visit (no saved preference)
  const [showLanguageSelector, setShowLanguageSelector] = useState(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('nourishnet_prefs'));
      return !(prefs && prefs.language);
    } catch {
      return true;
    }
  });

  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  const filtered = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = search.toLowerCase();
    return (
      lang.label.toLowerCase().includes(q) ||
      lang.nativeLabel.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleLanguageSelect = (code) => {
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
    setShowLanguageSelector(false);
  };

  useEffect(() => {
    if (showLanguageSelector && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showLanguageSelector]);

  // Language selection screen
  if (showLanguageSelector) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🥗</div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">NourishNet</h1>
            <p className="text-neutral-500 text-lg">Select your language</p>
            <p className="text-neutral-400 text-sm">Selecciona tu idioma · 选择您的语言</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 overflow-hidden">
            <div className="p-3 border-b border-neutral-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search languages..."
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  aria-label="Search languages"
                />
              </div>
            </div>

            <ul className="max-h-80 overflow-y-auto" role="listbox" aria-label="Language options">
              {filtered.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => handleLanguageSelect(lang.code)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-primary-50 transition-colors border-b border-neutral-50 last:border-b-0"
                    role="option"
                    aria-selected={lang.code === i18n.language}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-neutral-800">{lang.nativeLabel}</span>
                      <span className="text-sm text-neutral-400">{lang.label}</span>
                    </div>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-4 text-sm text-neutral-400 text-center">
                  No languages found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Main gateway with portal cards
  const portals = [
    {
      emoji: '🍎',
      title: t('gateway.familyPortal'),
      desc: t('gateway.familyPortalDesc'),
      to: '/family',
      color: 'primary',
    },
    {
      emoji: '🤝',
      title: t('gateway.donorPortal'),
      desc: t('gateway.donorPortalDesc'),
      to: '/donor',
      color: 'warm',
    },
    {
      emoji: '💪',
      title: t('gateway.volunteerPortal'),
      desc: t('gateway.volunteerPortalDesc'),
      to: '/volunteer',
      color: 'primary',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-3">
          {t('gateway.title')}
        </h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto">
          {t('gateway.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {portals.map((portal) => (
          <Link
            key={portal.to}
            to={portal.to}
            className="group bg-white rounded-2xl shadow-soft border border-neutral-200 p-8 text-center hover:shadow-hover hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-5xl mb-4">{portal.emoji}</div>
            <h2 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
              {portal.title}
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {portal.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Gateway;
