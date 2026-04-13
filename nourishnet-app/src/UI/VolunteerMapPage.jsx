import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchHeader from './SearchHeader';
import MissionCard from './MissionCard';
import { getUrgencyLevel } from './MissionCard';
import './VolunteerMapPage.css';
import locations from '../data/locations_final_merged.json';

delete L.Icon.Default.prototype._getIconUrl;

function createIcon(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  });
}

const ICONS = {
  red: createIcon('red'),
  orange: createIcon('orange'),
  green: createIcon('green'),
};

function getMarkerIcon(insecurityIndex) {
  if (insecurityIndex === 5) return ICONS.red;
  if (insecurityIndex === 4) return ICONS.orange;
  return ICONS.green;
}

const locsWithMissions = locations.filter(l => l.missions && l.missions.length > 0 && l.lat && l.lng);

const ALL_SKILLS = [...new Set(
  locsWithMissions.flatMap(l => l.missions.flatMap(m => m.skillsRequired || []))
)].sort();

const ALL_LANGUAGES = [...new Set(
  locsWithMissions.flatMap(l => l.missions.flatMap(m => m.languagesNeeded || []))
)].sort();

const DEFAULT_CENTER = [38.9, -76.95];
const RANGE_STEPS = [5, 10, 20, 55];

function distanceMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function rangeToZoom(mi) { if (mi <= 5) return 13; if (mi <= 10) return 12; if (mi <= 20) return 11; return 9; }

function FlyTo({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!lat || !lng) return;
    const c = map.getCenter();
    const dist = Math.abs(c.lat - lat) + Math.abs(c.lng - lng);
    if (dist < 0.01) map.panTo([lat, lng], { animate: true, duration: 0.3 });
    else if (dist < 0.1) map.setView([lat, lng], zoom || 14, { animate: true, duration: 0.5 });
    else map.flyTo([lat, lng], zoom || 14, { duration: 1.0 });
  }, [lat, lng, zoom, map]);
  return null;
}

function OpenPopup({ locId, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (locId && markerRefs.current[locId]) {
      const timer = setTimeout(() => { const m = markerRefs.current[locId]; if (m) m.openPopup(); }, 600);
      return () => clearTimeout(timer);
    }
  }, [locId, markerRefs, map]);
  return null;
}

function MapCenterTracker({ onCenterChange }) {
  const map = useMap();
  useEffect(() => {
    const handler = () => { const c = map.getCenter(); onCenterChange({ lat: c.lat, lng: c.lng }); };
    map.on('moveend', handler); handler();
    return () => map.off('moveend', handler);
  }, [map, onCenterChange]);
  return null;
}

function SetZoom({ zoom }) {
  const map = useMap();
  useEffect(() => { if (zoom) map.setZoom(zoom, { animate: true }); }, [zoom, map]);
  return null;
}

function VolunteerMapPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const locId = searchParams.get('loc');
  const preSelected = locId ? locsWithMissions.find(l => l.id === locId) : null;

  const [range, setRange] = useState(55);
  const [zoomFromRange, setZoomFromRange] = useState(null);
  const [mapCenter, setMapCenter] = useState(
    preSelected ? { lat: preSelected.lat, lng: preSelected.lng } : { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] }
  );
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [selectedLanguages, setSelectedLanguages] = useState(new Set());
  const [selected, setSelected] = useState(preSelected || null);
  const [cardIndex, setCardIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [flyTarget, setFlyTarget] = useState(
    preSelected ? { lat: preSelected.lat, lng: preSelected.lng, zoom: 14 } : null
  );
  const [openPopupId, setOpenPopupId] = useState(preSelected?.id || null);
  const markerRefs = useRef({});

  const toggleSkill = useCallback(s => {
    setSelectedSkills(p => { const n = new Set(p); n.has(s) ? n.delete(s) : n.add(s); return n; });
  }, []);
  const toggleLanguage = useCallback(l => {
    setSelectedLanguages(p => { const n = new Set(p); n.has(l) ? n.delete(l) : n.add(l); return n; });
  }, []);
  const clearFilters = useCallback(() => {
    setRange(55); setZoomFromRange(null);
    setSelectedSkills(new Set()); setSelectedLanguages(new Set());
    setSelected(null); setCardIndex(0); setExpanded(false); setOpenPopupId(null);
  }, []);

  const handleSliderChange = val => {
    const snapped = RANGE_STEPS.reduce((p, c) => Math.abs(c - val) < Math.abs(p - val) ? c : p);
    setRange(snapped); setZoomFromRange(rangeToZoom(snapped));
  };
  const onMapCenterChange = useCallback(c => setMapCenter(c), []);

  const filtered = useMemo(() => {
    let result = locsWithMissions.filter(l => distanceMi(mapCenter.lat, mapCenter.lng, l.lat, l.lng) <= range);
    if (selectedSkills.size > 0) {
      result = result.filter(l => l.missions.some(m => (m.skillsRequired || []).some(s => selectedSkills.has(s))));
    }
    if (selectedLanguages.size > 0) {
      result = result.filter(l => l.missions.some(m => (m.languagesNeeded || []).some(lang => selectedLanguages.has(lang))));
    }
    result.sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0));
    return result;
  }, [range, mapCenter, selectedSkills, selectedLanguages]);

  useEffect(() => {
    if (selected) {
      const idx = filtered.findIndex(l => l.id === selected.id);
      if (idx >= 0) setCardIndex(idx);
      if (selected.lat && selected.lng) {
        setFlyTarget({ lat: selected.lat, lng: selected.lng, zoom: 14 });
        setOpenPopupId(selected.id);
      }
    }
  }, [selected, filtered]);

  const currentCard = filtered[cardIndex] || null;
  useEffect(() => { if (!selected && currentCard) setOpenPopupId(currentCard.id); }, [currentCard, selected]);

  const navigateToCard = i => {
    setCardIndex(i); setExpanded(false);
    const loc = filtered[i];
    if (loc) { setSelected(loc); setFlyTarget({ lat: loc.lat, lng: loc.lng, zoom: 14 }); setOpenPopupId(loc.id); }
  };
  const prevCard = () => { if (filtered.length) navigateToCard((cardIndex - 1 + filtered.length) % filtered.length); };
  const nextCard = () => { if (filtered.length) navigateToCard((cardIndex + 1) % filtered.length); };
  const handleMarkerClick = loc => {
    setSelected(loc); setExpanded(false);
    const idx = filtered.findIndex(l => l.id === loc.id);
    if (idx >= 0) setCardIndex(idx);
    setFlyTarget({ lat: loc.lat, lng: loc.lng, zoom: 14 }); setOpenPopupId(loc.id);
  };

  const addr = currentCard ? [currentCard.address?.street, currentCard.address?.city, currentCard.address?.state, currentCard.address?.zip].filter(Boolean).join(', ') : '';
  const dirUrl = currentCard ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}` : '';
  const urgency = currentCard ? getUrgencyLevel(currentCard.insecurityIndex || 0) : null;
  const missionCount = currentCard ? (currentCard.missions || []).length : 0;

  return (
    <div className="mp-root">
      <SearchHeader backTo="/volunteer" activeNav="map" navPrefix="/volunteer" />
      <div className="mp-body">
        <aside className="mp-sidebar">
          <h3 className="mp-filter-title">{t('ui.filter')}</h3>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.locationRange')}</label>
            <input type="range" min={5} max={55} value={range} onChange={e => handleSliderChange(Number(e.target.value))} className="mp-range" />
            <div className="mp-range-labels"><span>5mi</span><span>10mi</span><span>20mi</span><span>55mi</span></div>
            <span className="mp-range-status">{filtered.length} locations within {range}mi</span>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('volunteerPortal.filterBySkill')}</label>
            <div className="mp-tag-list">
              {ALL_SKILLS.map(s => (
                <button key={s} className={`mp-tag${selectedSkills.has(s) ? ' mp-tag--active' : ''}`} onClick={() => toggleSkill(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('volunteerPortal.filterByLanguage')}</label>
            <div className="mp-tag-list">
              {ALL_LANGUAGES.map(l => (
                <button key={l} className={`mp-tag${selectedLanguages.has(l) ? ' mp-tag--active' : ''}`} onClick={() => toggleLanguage(l)}>{l}</button>
              ))}
            </div>
          </div>

          <button className="mp-clear-btn" onClick={clearFilters}>{t('ui.clearFilter')}</button>
        </aside>

        <div className="mp-map-area">
          <MapContainer center={preSelected ? [preSelected.lat, preSelected.lng] : DEFAULT_CENTER} zoom={preSelected ? 14 : 11} className="mp-leaflet">
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapCenterTracker onCenterChange={onMapCenterChange} />
            {zoomFromRange && <SetZoom zoom={zoomFromRange} />}
            {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom} />}
            {openPopupId && <OpenPopup locId={openPopupId} markerRefs={markerRefs} />}
            {filtered.map(loc => {
              const locAddr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
              const u = getUrgencyLevel(loc.insecurityIndex || 0);
              const mc = (loc.missions || []).length;
              return (
                <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={getMarkerIcon(loc.insecurityIndex || 0)}
                  ref={el => { if (el) markerRefs.current[loc.id] = el; }}
                  eventHandlers={{ click: () => handleMarkerClick(loc) }}>
                  <Popup>
                    <strong style={{ fontSize: 14 }}>{loc.name}</strong><br />
                    <span style={{ fontSize: 12, color: '#555' }}>{locAddr}</span><br />
                    <span style={{ fontSize: 11 }}>{mc} {mc === 1 ? 'mission' : 'missions'}</span><br />
                    <span style={{ fontSize: 11, color: u.color, fontWeight: 600 }}>{u.emoji} {t(`volunteerPortal.${u.label}`)}</span><br />
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locAddr)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontSize: 13 }}>📍 {t('ui.getDirections')}</a>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {currentCard && (
            <div className="mp-detail-wrap">
              <button className="mp-detail-arrow" onClick={prevCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <div className="mp-detail-card">
                <div className="mp-detail-top">
                  <div>
                    <span className="mp-detail-name">{currentCard.name}</span>
                    <span className="mp-detail-partner">{missionCount} {missionCount === 1 ? 'mission' : 'missions'}</span>
                    {urgency && (
                      <span className="vm-urgency-badge" style={{ color: urgency.color }}>
                        {urgency.emoji} {t(`volunteerPortal.${urgency.label}`)}
                      </span>
                    )}
                  </div>
                  <button className="mp-detail-details" onClick={() => setExpanded(!expanded)}>
                    {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: 4 }}><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>
                <div className="mp-detail-meta">
                  <span>🕐 {currentCard.hours || t('ui.contactForHours')}</span>
                  <span>📍 {addr}</span>
                </div>
                <div className={`mp-detail-expand${expanded ? ' mp-detail-expand--open' : ''}`}>
                  <div className="mp-detail-expand-inner">
                    {currentCard.website && (
                      <div className="mp-detail-row"><span className="mp-detail-row-label">🔗 Website</span><a href={currentCard.website} target="_blank" rel="noopener noreferrer" className="mp-detail-row-link">{currentCard.website}</a></div>
                    )}
                    {currentCard.phone && (
                      <div className="mp-detail-row"><span className="mp-detail-row-label">📞 Phone</span><span className="mp-detail-row-value">{currentCard.phone}</span></div>
                    )}
                    <div className="vm-mission-list">
                      {(currentCard.missions || []).map((m, i) => (
                        <div key={i} className="vm-mission-item">
                          <span className="vm-mission-item-title">{m.title}</span>
                          <span className="vm-mission-item-skills">{(m.skillsRequired || []).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mp-detail-bottom">
                  <a className="mp-detail-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
                </div>
                <div className="mp-detail-counter">{cardIndex + 1} / {filtered.length}</div>
              </div>
              <button className="mp-detail-arrow" onClick={nextCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
              </button>
            </div>
          )}
          {filtered.length === 0 && <div className="mp-no-results">{t('common.noResults')}</div>}
        </div>
      </div>
    </div>
  );
}

export default VolunteerMapPage;
