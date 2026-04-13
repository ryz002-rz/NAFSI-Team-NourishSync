import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchHeader from './SearchHeader';
import './MapPage.css';
import locations from '../data/locations.json';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const center = [38.9, -76.95];
const sorted = [...locations].sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0));

function DonorMapPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [range, setRange] = useState(10);

  return (
    <div className="mp-root">
      <SearchHeader backTo="/donor" activeNav="map" navPrefix="/donor" />
      <div className="mp-body">
        <aside className="mp-sidebar">
          <h3 className="mp-filter-title">{t('ui.filter')}</h3>
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
            <label className="mp-filter-label">{t('donor.sortByNeed')}</label>
          </div>
          <button className="mp-clear-btn">{t('ui.clearFilter')}</button>
        </aside>
        <div className="mp-map-area">
          <MapContainer center={center} zoom={11} className="mp-leaflet">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {sorted.map((loc) => loc.lat && loc.lng && (
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

export default DonorMapPage;
