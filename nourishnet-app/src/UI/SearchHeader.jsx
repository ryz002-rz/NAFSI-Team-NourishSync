import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguagePopover from './LanguagePopover';
import './SearchHeader.css';

function SearchHeader({ backTo, activeNav = 'home', navPrefix = '/customer' }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);

  const handleVoice = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t('voice.notSupported') || 'Voice search not supported');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = document.documentElement.lang || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const input = document.querySelector('.sh-search-input');
      if (input) { input.value = text; input.dispatchEvent(new Event('input', { bubbles: true })); }
    };
    recognition.start();
  }, [t]);

  return (
    <header className="sh-header">
      {/* Left: back arrow + nav pill */}
      <div className="sh-left">
        <button className="sh-back" onClick={() => navigate(backTo)} aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <nav className="sh-nav-pill">
          <button className={`sh-nav-btn${activeNav === 'home' ? ' sh-nav-btn--active' : ''}`}
            onClick={() => navigate(navPrefix)}>{t('ui.home')}</button>
          <button className={`sh-nav-btn${activeNav === 'map' ? ' sh-nav-btn--active' : ''}`}
            onClick={() => navigate(`${navPrefix}/map`)}>{t('ui.map')}</button>
          <button className={`sh-nav-btn${activeNav === 'about' ? ' sh-nav-btn--active' : ''}`}
          onClick={() => navigate(`${navPrefix}/about`)}>{t('ui.aboutUs')}</button>
        </nav>
      </div>

      {/* Center: search bar */}
      <div className="sh-center">
        <div className="sh-search-bar">
          <span className="sh-search-icon">🔍</span>
          <input className="sh-search-input" placeholder={t('ui.search')} aria-label={t('ui.search')} />
          <button className={`sh-mic-btn${listening ? ' sh-mic-btn--active' : ''}`}
            onClick={handleVoice} aria-label="Voice search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dcfce8" strokeWidth="2">
              <rect x="9" y="1" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="17" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right: language popover */}
      <div className="sh-right">
        <LanguagePopover />
      </div>
    </header>
  );
}

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);
  return coords;
}

export default SearchHeader;
