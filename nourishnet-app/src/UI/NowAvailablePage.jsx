import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './NowAvailablePage.css';
import locations from '../data/locations.json';

function NowAvailablePage() {
  const { t } = useTranslation();

  return (
    <div className="na-root">
      <SearchHeader backTo="/customer" activeNav="home" navPrefix="/customer" />
      <h1 className="na-title anim-fade-up">{t('ui.nowAvailable')}</h1>
      <div className="na-grid">
        {locations.map((loc, i) => (
          <div key={loc.id} className="na-card anim-fade-up" style={{ animationDelay: `${Math.min(i * 0.04, 0.6)}s` }}>
            <div className="na-card-top">
              <div>
                <span className="na-card-name">{loc.name}</span>
                <span className="na-card-partner">{t('ui.partner')}</span>
              </div>
              <button className="na-card-details">{t('ui.showDetails')} ›</button>
            </div>
            <div className="na-card-meta">
              <span>🕐 {loc.hours || t('ui.contactForHours')} 📧 {t('ui.ongoing')}</span>
              <span>📍 {loc.address.street}, {loc.address.city}, {loc.address.state} {loc.address.zip}</span>
            </div>
            <div className="na-card-bottom">
              <div className="na-card-tags">
                {(loc.foodTypes || []).slice(0, 5).map((ft) => (<span key={ft} className="na-card-tag">{ft}</span>))}
              </div>
              <a className="na-card-dir" href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NowAvailablePage;
