import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapPage.css';
import LanguagePopover from './LanguagePopover';
import arrowIcon from './assets/arrow-right.svg';
import locations from '../data/locations.json';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];
const FOOD_TYPES = [...new Set(locations.flatMap((l) => l.foodTypes || []))].sort().slice(0, 8);
const center = [38.9, -76.95];

function MapPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState(10);
  const [heatmap, setHeatmap] = useState(true);

  return (
    <div className="mp-root">
      <header className="mp-header">
        <button className="mp-back" onClick={() => navigate('/customer')}><img src={arrowIcon} alt="" className="mp-back-icon" /></button>
        <nav className="mp-nav-pill">
          <button className="mp-nav-btn" onClick={() => navigate('/customer')}>{t('ui.home')}</button>
          <button className="mp-nav-btn mp-nav-btn--active">{t('ui.map')}</button>
          <button className="mp-nav-btn">{t('ui.aboutUs')}</button>
        </nav>
        <div className="mp-header-right">
          <div className="mp-search-bar"><span>🔍</span><input className="mp-search-input" placeholder={t('ui.search')} /></div>
          <button className="mp-voice-btn">🎙</button>
          <LanguagePopover />
        </div>
      </header>
      <div className="mp-body">
        <aside className="mp-sidebar">
          <h3 className="mp-filter-title">{t('ui.filter')}</h3>
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.foodResourceCoverage')}</label>
            <button className={`mp-toggle ${heatmap ? 'mp-toggle--on' : ''}`} onClick={() => setHeatmap(!heatmap)}>
              <span className="mp-toggle-knob" /><span className="mp-toggle-text">{heatmap ? 'on' : 'off'}</span>
            </button>
          </div>
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.searchingNear')}</label>
            <input className="mp-zip-input" placeholder="ZIP" />
          </div>
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.locationRange')}</label>
            <input type="range" min="5" max="20" step="5" value={range} onChange={(e) => setRange(e.target.value)} className="mp-range" />
            <div className="mp-range-labels"><span>5mi</span><span>10mi</span><span>15mi</span><span>20mi</span></div>
          </div>
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.foodType')}</label>
            <div className="mp-tag-list">{FOOD_TYPES.map((ft) => (<span key={ft} className="mp-tag">{ft}</span>))}</div>
          </div>
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.healthAttribute')}</label>
            <div className="mp-tag-list">{HEALTH_ATTRS.map((a) => (<span key={a} className="mp-tag">{t(`filter.${a}`)}</span>))}</div>
          </div>
          <button className="mp-clear-btn">{t('ui.clearFilter')}</button>
        </aside>
        <div className="mp-map-area">
          <MapContainer center={center} zoom={11} className="mp-leaflet">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((loc) => loc.lat && loc.lng && (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} eventHandlers={{ click: () => setSelected(loc) }}>
                <Popup>
                  <strong>{loc.name}</strong><br />{loc.address.street}, {loc.address.city}<br />
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer">📍 {t('ui.getDirections')}</a>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {selected && (
            <div className="mp-detail-card">
              <div className="mp-detail-top">
                <div><span className="mp-detail-name">{selected.name}</span><span className="mp-detail-partner">{t('ui.partner')}</span></div>
                <button className="mp-detail-link">{t('ui.showDetails')} ›</button>
              </div>
              <div className="mp-detail-meta">
                <span>🕐 {selected.hours || t('ui.contactForHours')} 📧 {t('ui.ongoing')}</span>
                <span>📍 {selected.address.street}, {selected.address.city}, {selected.address.state} {selected.address.zip}</span>
              </div>
              <div className="mp-detail-bottom">
                <div className="mp-detail-tags">{(selected.foodTypes || []).slice(0, 5).map((ft) => (<span key={ft} className="mp-detail-tag">{ft}</span>))}</div>
                <a className="mp-detail-dir" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapPage;
