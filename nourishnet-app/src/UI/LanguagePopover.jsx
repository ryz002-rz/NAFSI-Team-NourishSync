import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguagePopover.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'am', label: 'Amharic' },
  { code: 'tl', label: 'Tagalog' },
];

function LanguagePopover() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    try {
      const existing = JSON.parse(localStorage.getItem('nourishnet_prefs')) || {};
      localStorage.setItem('nourishnet_prefs', JSON.stringify({ ...existing, language: code }));
    } catch { localStorage.setItem('nourishnet_prefs', JSON.stringify({ language: code })); }
    setOpen(false);
  };

  return (
    <div className="lang-pop-wrap" ref={ref}>
      <button className="lang-pop-trigger" onClick={() => setOpen(!open)}>
        <span>{current.label}</span>
        <span className="lang-pop-caret">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="lang-pop-menu">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                className={`lang-pop-item${l.code === i18n.language ? ' lang-pop-item--active' : ''}`}
                onClick={() => handleSelect(l.code)}
              >{l.label}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguagePopover;
