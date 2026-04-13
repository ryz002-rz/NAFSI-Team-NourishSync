import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FoodDetailPage.css';
import LanguagePopover from './LanguagePopover';
import arrowIcon from './assets/arrow-right.svg';
import locations from '../data/locations.json';

function FoodDetailPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { foodType } = useParams();
  const decoded = decodeURIComponent(foodType);
  const filtered = locations.filter((l) => l.foodTypes && l.foodTypes.some((ft) => ft.toLowerCase() === decoded.toLowerCase()));

  return (
    <div className="fd-root">
      <header className="fd-header">
        <button className="fd-back" onClick={() => navigate(-1)}><img src={arrowIcon} alt="" className="fd-back-icon" /></button>
        <span className="fd-logo">{t('ui.nourishOne')}</span>
        <LanguagePopover />
      </header>
      <h1 className="fd-title">{decoded}</h1>
      <p className="fd-count">{filtered.length} {t('ui.locations')}</p>
      <div className="fd-list">
        {filtered.map((loc) => (
          <div key={loc.id} className="fd-card">
            <div className="fd-card-top">
              <span className="fd-card-name">{loc.name}</span>
              <button className="fd-card-map" onClick={() => navigate('/customer/map')}>{t('ui.showInMap')}</button>
            </div>
            <span className="fd-card-addr">{loc.address.street}, {loc.address.city}, {loc.address.state} {loc.address.zip}</span>
            <span className="fd-card-hours">{loc.hours}</span>
            <div className="fd-card-tags">{(loc.foodTypes || []).map((ft) => (<span key={ft} className="fd-card-tag">{ft}</span>))}</div>
          </div>
        ))}
        {filtered.length === 0 && <p className="fd-empty">{t('ui.noLocationsFound')} "{decoded}"</p>}
      </div>
    </div>
  );
}

export default FoodDetailPage;
