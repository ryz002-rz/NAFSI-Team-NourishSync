import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NearbyPage.css';
import LanguagePopover from './LanguagePopover';
import arrowIcon from './assets/arrow-right.svg';
import locations from '../data/locations.json';

function NearbyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="nb-root">
      <header className="nb-header">
        <button className="nb-back" onClick={() => navigate('/customer')}><img src={arrowIcon} alt="" className="nb-back-icon" /></button>
        <span className="nb-logo">{t('ui.nourishOne')}</span>
        <LanguagePopover />
      </header>
      <h1 className="nb-title">{t('ui.nearbyYou')}</h1>
      <p className="nb-count">{locations.length} {t('ui.locations')}</p>
      <div className="nb-list">
        {locations.map((loc) => (
          <div key={loc.id} className="nb-card">
            <div className="nb-card-top">
              <span className="nb-card-name">{loc.name}</span>
              <button className="nb-card-map" onClick={() => navigate('/customer/map')}>{t('ui.showInMap')}</button>
            </div>
            <span className="nb-card-addr">{loc.address.street}, {loc.address.city}, {loc.address.state} {loc.address.zip}</span>
            <span className="nb-card-hours">{loc.hours}</span>
            <div className="nb-card-tags">{(loc.foodTypes || []).slice(0, 4).map((ft) => (<span key={ft} className="nb-card-tag">{ft}</span>))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NearbyPage;
