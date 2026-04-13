import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './NearbyPage.css';
import locations from '../data/locations_final_merged.json';

function NearbyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="nb-root">
      <SearchHeader backTo="/customer" activeNav="home" navPrefix="/customer" />
      <h1 className="nb-title">{t('ui.nearbyYou')}</h1>
      <p className="nb-count">{locations.length} {t('ui.locations')}</p>
      <div className="nb-list">
        {locations.map((loc) => (<NbCard key={loc.id} loc={loc} t={t} navigate={navigate} />))}
      </div>
    </div>
  );
}

function NbCard({ loc, t, navigate }) {
  const [expanded, setExpanded] = useState(false);
  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
  const requirements = Array.isArray(loc.requirements) ? loc.requirements.join(', ') : loc.requirements || '';
  const notes = loc.notes || '';
  const website = loc.website || '';
  const sourceName = loc.source?.source_name || '';
  const sourceUrl = loc.source?.source_url || loc.source?.extracted_from || '';

  return (
    <div className="nb-card">
      <div className="nb-card-top">
        <div>
          <span className="nb-card-name">{loc.name}</span>
          <span className="nb-card-partner">{t('ui.partner')}</span>
        </div>
        <button className="nb-card-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
      <div className="nb-card-meta">
        <span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span>
        <span>📍 {addr}</span>
      </div>

      <div className={`nb-card-expand${expanded ? ' nb-card-expand--open' : ''}`}>
        <div className="nb-card-expand-inner">
          {website && (
            <div className="nb-card-detail-row">
              <span className="nb-card-detail-label">🔗 Website</span>
              <a href={website} target="_blank" rel="noopener noreferrer" className="nb-card-detail-link">{website}</a>
            </div>
          )}
          {requirements && (
            <div className="nb-card-detail-row">
              <span className="nb-card-detail-label">📋 Requirements</span>
              <span className="nb-card-detail-value">{requirements}</span>
            </div>
          )}
          {notes && (
            <div className="nb-card-detail-row">
              <span className="nb-card-detail-label">📝 Notes</span>
              <span className="nb-card-detail-value">{notes}</span>
            </div>
          )}
          {(sourceName || sourceUrl) && (
            <div className="nb-card-detail-row">
              <span className="nb-card-detail-label">📄 Source</span>
              {sourceUrl ? (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="nb-card-detail-link">{sourceName || sourceUrl}</a>
              ) : (
                <span className="nb-card-detail-value">{sourceName}</span>
              )}
            </div>
          )}
          <button className="nb-card-map-btn" onClick={() => navigate(`/customer/map?loc=${loc.id}`)}>🗺️ {t('ui.showInMap')}</button>
        </div>
      </div>

      <div className="nb-card-bottom">
        <div className="nb-card-tags">
          {(loc.foodTypes || []).slice(0, 5).map((ft) => (
            <button key={ft} className="nb-card-tag" onClick={() => navigate(`/customer/food/${encodeURIComponent(ft)}`)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>
          ))}
        </div>
        <a className="nb-card-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
      </div>
    </div>
  );
}

export default NearbyPage;
