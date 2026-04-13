import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FoodTypesPage.css';
import LanguagePopover from './LanguagePopover';
import arrowIcon from './assets/arrow-right.svg';
import locations from '../data/locations.json';

const FOOD_TYPES = [...new Set(locations.flatMap((l) => l.foodTypes || []))].sort();

function FoodTypesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="ft-root">
      <header className="ft-header">
        <button className="ft-back" onClick={() => navigate('/customer')} aria-label="Back">
          <img src={arrowIcon} alt="" className="ft-back-icon" />
        </button>
        <nav className="ft-nav-pill">
          <button className="ft-nav-btn ft-nav-btn--active">{t('ui.home')}</button>
          <button className="ft-nav-btn" onClick={() => navigate('/customer/map')}>{t('ui.map')}</button>
          <button className="ft-nav-btn">{t('ui.aboutUs')}</button>
        </nav>
        <div className="ft-header-right">
          <div className="ft-search-bar"><span className="ft-search-icon">🔍</span><input className="ft-search-input" placeholder={t('ui.search')} /></div>
          <button className="ft-voice-btn">🎙</button>
          <LanguagePopover />
        </div>
      </header>
      <h1 className="ft-title">{t('ui.foodType')}</h1>
      <div className="ft-grid">
        {FOOD_TYPES.map((ft) => (
          <button key={ft} className="ft-card" onClick={() => navigate(`/customer/food/${encodeURIComponent(ft)}`)}>
            <span className="ft-card-label">{ft}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FoodTypesPage;
