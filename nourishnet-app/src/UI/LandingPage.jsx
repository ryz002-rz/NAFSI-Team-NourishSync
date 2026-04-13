import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LandingPage.css';
import bgImage from './assets/bg-landing.jpg';
import arrowIcon from './assets/arrow-right.svg';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'am', label: 'Amharic' },
  { code: 'tl', label: 'Tagalog' },
];

const LANGUAGE_MESSAGES = {
  en: 'Choose English as your preference language.',
  es: 'Elige Español como tu idioma preferido.',
  zh: '选择中文作为您的首选语言。',
  fr: 'Choisissez le Français comme langue préférée.',
  am: 'አማርኛን እንደ ምርጫ ቋንቋዎ ይምረጡ።',
  tl: 'Piliin ang Tagalog bilang iyong gustong wika.',
};

function LandingPage() {
  const [selectedLang, setSelectedLang] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = useCallback((lang) => {
    setSelectedLang(lang);
    setAnimating(true);
    setFadingOut(false);
    i18n.changeLanguage(lang.code);
    try {
      const existing = JSON.parse(localStorage.getItem('nourishnet_prefs')) || {};
      localStorage.setItem('nourishnet_prefs', JSON.stringify({ ...existing, language: lang.code }));
    } catch {
      localStorage.setItem('nourishnet_prefs', JSON.stringify({ language: lang.code }));
    }
  }, [i18n]);

  const handleBack = useCallback(() => {
    setFadingOut(true);
    setTimeout(() => {
      setSelectedLang(null);
      setFadingOut(false);
    }, 300);
  }, []);

  const handleContinue = useCallback(() => {
    navigate('/welcome');
  }, [navigate]);

  return (
    <div className="landing-root" onClick={selectedLang && !fadingOut ? handleBack : undefined}>
      <div className="landing-bg">
        <img src={bgImage} alt="" className="landing-bg-img" />
        <div className="landing-bg-overlay" />
      </div>

      <div className="landing-content">
        <h1 className="landing-title">NourishOne</h1>

        {!selectedLang ? (
          <LanguageGrid onSelect={handleSelect} />
        ) : (
          <SelectedView
            lang={selectedLang}
            animating={animating}
            fadingOut={fadingOut}
            onAnimEnd={() => setAnimating(false)}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}

function LanguageGrid({ onSelect }) {
  return (
    <div className="lang-grid">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className="lang-card"
          onClick={() => onSelect(lang)}
          aria-label={`Select ${lang.label}`}
        >
          <span className="lang-card-label">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

function SelectedView({ lang, animating, fadingOut, onAnimEnd, onContinue }) {
  const className = `selected-view${animating ? ' selected-view--enter' : ''}${fadingOut ? ' selected-view--exit' : ''}`;
  const stopAndContinue = (e) => {
    e.stopPropagation();
    onContinue();
  };
  return (
    <div className={className} onAnimationEnd={onAnimEnd} onClick={(e) => e.stopPropagation()}>
      <button className="selected-panel selected-panel--info" onClick={stopAndContinue} aria-label={`Continue with ${lang.label}`}>
        <span className="selected-panel-lang">{lang.label}</span>
        <span className="selected-panel-msg">{LANGUAGE_MESSAGES[lang.code]}</span>
      </button>
      <button className="selected-panel selected-panel--arrow" onClick={stopAndContinue} aria-label="Continue">
        <img src={arrowIcon} alt="Continue" className="selected-arrow-icon" />
      </button>
    </div>
  );
}

export default LandingPage;
