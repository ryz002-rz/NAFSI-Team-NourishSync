import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchHeader from './SearchHeader';
import './DonorMapPage.css';
import locations from '../data/locations_final_merged.json';

delete L.Icon.Default.prototype._getIconUrl;

// Need-colored marker icons
function createIcon(color) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  });
}
const ICONS = { 1: createIcon('red'), 2: createIcon('orange'), 3: createIcon('gold'), 4: createIcon('green'), 5: createIcon('green') };
const LEVEL_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#16a34a' };
const LEVEL_LABELS = { 1: 'level.veryLow', 2: 'level.low', 3: 'level.moderate', 4: 'level.good', 5: 'level.excellent' };
const LEVEL_RADIUS = { 1: 1200, 2: 1400, 3: 1600, 4: 1800, 5: 2000 };

function getNeedLevel(idx) {
  if (idx >= 8) return 1;
  if (idx >= 6) return 2;
  if (idx >= 4) return 3;
  if (idx >= 2) return 4;
  return 5;
}

const ALL_FOOD_TYPES = [...new Set(locations.flatMap(l => l.foodTypes || []))].sort();
const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];
const DEFAULT_CENTER = [38.9, -76.95];
const RANGE_STEPS = [5, 10, 20, 55];

function distanceMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2-lat1)*Math.PI/180; const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function computeNeedClusters(locs) {
  const grid = {}; const step = 0.03;
  locs.forEach(l => {
    if (!l.lat || !l.lng) return;
    const key = `${Math.round(l.lat/step)}_${Math.round(l.lng/step)}`;
    if (!grid[key]) grid[key] = { lat: 0, lng: 0, count: 0, totalNeed: 0 };
    grid[key].lat += l.lat; grid[key].lng += l.lng; grid[key].count++; grid[key].totalNeed += (l.insecurityIndex || 0);
  });
  return Object.values(grid).map(g => {
    const avgNeed = g.totalNeed / g.count;
    const level = avgNeed >= 8 ? 1 : avgNeed >= 6 ? 2 : avgNeed >= 4 ? 3 : avgNeed >= 2 ? 4 : 5;
    return { lat: g.lat/g.count, lng: g.lng/g.count, level,
      color: LEVEL_COLORS[level], radius: LEVEL_RADIUS[level],
    };
  });
}

function rangeToZoom(mi) { if (mi <= 5) return 13; if (mi <= 10) return 12; if (mi <= 20) return 11; return 9; }

function FlyTo({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!lat || !lng) return;
    const c = map.getCenter(); const dist = Math.abs(c.lat-lat) + Math.abs(c.lng-lng);
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

function DonorMapPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locId = searchParams.get('loc');
  const preSelected = locId ? locations.find(l => l.id === locId) : null;

  const [coverage, setCoverage] = useState(false);
  const [range, setRange] = useState(55);
  const [zoomFromRange, setZoomFromRange] = useState(null);
  const [mapCenter, setMapCenter] = useState(preSelected ? { lat: preSelected.lat, lng: preSelected.lng } : { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] });
  const [selectedFoodTypes, setSelectedFoodTypes] = useState(new Set());
  const [selectedHealthAttrs, setSelectedHealthAttrs] = useState(new Set());
  const [selected, setSelected] = useState(preSelected || null);
  const [cardIndex, setCardIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [flyTarget, setFlyTarget] = useState(preSelected ? { lat: preSelected.lat, lng: preSelected.lng, zoom: 14 } : null);
  const [openPopupId, setOpenPopupId] = useState(preSelected?.id || null);
  const markerRefs = useRef({});

  const toggleFoodType = useCallback(ft => { setSelectedFoodTypes(p => { const n = new Set(p); n.has(ft) ? n.delete(ft) : n.add(ft); return n; }); }, []);
  const toggleHealthAttr = useCallback(a => { setSelectedHealthAttrs(p => { const n = new Set(p); n.has(a) ? n.delete(a) : n.add(a); return n; }); }, []);
  const clearFilters = useCallback(() => { setRange(55); setZoomFromRange(null); setSelectedFoodTypes(new Set()); setSelectedHealthAttrs(new Set()); setSelected(null); setCardIndex(0); setExpanded(false); setOpenPopupId(null); }, []);

  const handleSliderChange = val => { const snapped = RANGE_STEPS.reduce((p, c) => Math.abs(c-val) < Math.abs(p-val) ? c : p); setRange(snapped); setZoomFromRange(rangeToZoom(snapped)); };
  const onMapCenterChange = useCallback(c => setMapCenter(c), []);

  const filtered = useMemo(() => {
    let result = locations.filter(l => l.lat && l.lng);
    result = result.filter(l => distanceMi(mapCenter.lat, mapCenter.lng, l.lat, l.lng) <= range);
    if (selectedFoodTypes.size > 0) result = result.filter(l => l.foodTypes && l.foodTypes.some(ft => selectedFoodTypes.has(ft)));
    if (selectedHealthAttrs.size > 0) result = result.filter(l => l.healthAttributes && [...selectedHealthAttrs].some(a => l.healthAttributes[a]));
    // Sort by need (highest first)
    result.sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0));
    return result;
  }, [range, mapCenter, selectedFoodTypes, selectedHealthAttrs]);

  const clusters = useMemo(() => coverage ? computeNeedClusters(filtered) : [], [coverage, filtered]);

  useEffect(() => {
    if (selected) {
      const idx = filtered.findIndex(l => l.id === selected.id);
      if (idx >= 0) setCardIndex(idx);
      if (selected.lat && selected.lng) { setFlyTarget({ lat: selected.lat, lng: selected.lng, zoom: 14 }); setOpenPopupId(selected.id); }
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
  const requirements = currentCard ? (Array.isArray(currentCard.requirements) ? currentCard.requirements.join(', ') : currentCard.requirements || '') : '';
  const website = currentCard?.website || '';
  const sourceName = currentCard?.source?.source_name || '';
  const sourceUrl = currentCard?.source?.source_url || currentCard?.source?.extracted_from || '';
  const needLevel = currentCard ? getNeedLevel(currentCard.insecurityIndex || 0) : 'good';

  return (
    <div className="mp-root">
      <SearchHeader backTo="/donor" activeNav="map" navPrefix="/donor" />
      <div className="mp-body">
        <aside className="mp-sidebar">
          <h3 className="mp-filter-title">{t('ui.filter')}</h3>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('level.needCoverage')}</label>
            <button className={`mp-toggle ${coverage ? 'mp-toggle--on' : ''}`} onClick={() => setCoverage(!coverage)}>
              <span className="mp-toggle-track"><span className="mp-toggle-knob" /></span>
              <span className="mp-toggle-label">{coverage ? 'ON' : 'OFF'}</span>
            </button>
            {coverage && (
              <div className="mp-legend">
                {[1,2,3,4,5].map(lvl => (
                  <div key={lvl} className="mp-legend-item">
                    <span className="mp-legend-dot" style={{ background: LEVEL_COLORS[lvl] }} />
                    <span className="mp-legend-text">{t('level.level')} {lvl} — {t(LEVEL_LABELS[lvl])}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.locationRange')}</label>
            <input type="range" min={5} max={55} value={range} onChange={e => handleSliderChange(Number(e.target.value))} className="mp-range" />
            <div className="mp-range-labels"><span>5mi</span><span>10mi</span><span>20mi</span><span>55mi</span></div>
            <span className="mp-range-status">{filtered.length} locations within {range}mi</span>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.foodType')}</label>
            <div className="mp-tag-list">
              {ALL_FOOD_TYPES.map(ft => (<button key={ft} className={`mp-tag${selectedFoodTypes.has(ft) ? ' mp-tag--active' : ''}`} onClick={() => toggleFoodType(ft)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>))}
            </div>
          </div>

          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.healthAttribute')}</label>
            <div className="mp-tag-list">
              {HEALTH_ATTRS.map(a => (<button key={a} className={`mp-tag${selectedHealthAttrs.has(a) ? ' mp-tag--active' : ''}`} onClick={() => toggleHealthAttr(a)}>{t(`filter.${a}`)}</button>))}
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
            {coverage && clusters.map((c, i) => (
              <Circle key={i} center={[c.lat, c.lng]} radius={c.radius} pathOptions={{ color: c.color, fillColor: c.color, fillOpacity: 0.25, weight: 1 }} />
            ))}
            {filtered.map(loc => {
              const locAddr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
              const level = getNeedLevel(loc.insecurityIndex || 0);
              return (
                <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={ICONS[level]}
                  ref={el => { if (el) markerRefs.current[loc.id] = el; }}
                  eventHandlers={{ click: () => handleMarkerClick(loc) }}>
                  <Popup>
                    <strong style={{ fontSize: 14 }}>{loc.name}</strong><br />
                    <span style={{ fontSize: 12, color: '#555' }}>{locAddr}</span><br />
                    {<span style={{ fontSize: 11, color: LEVEL_COLORS[level], fontWeight: 600 }}>{t('level.level')} {level} — {t(LEVEL_LABELS[level])}</span>}
                    <br />
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locAddr)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontSize: 13 }}>📍 {t('ui.getDirections')}</a>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {currentCard && (
            <div className="mp-detail-wrap">
              <button className="mp-detail-arrow" onClick={prevCard}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg></button>
              <div className="mp-detail-card">
                <div className="mp-detail-top">
                  <div>
                    <span className="mp-detail-name">{currentCard.name}</span>
                    <span className="mp-detail-partner">{t('ui.partner')}</span>
                    <span className="dm-need-badge" style={{ color: LEVEL_COLORS[needLevel] }}>
                      {t('level.level')} {needLevel} — {t(LEVEL_LABELS[needLevel])} ({currentCard.insecurityIndex || 0})
                    </span>
                  </div>
                  <button className="mp-detail-details" onClick={() => setExpanded(!expanded)}>
                    {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: 4 }}><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>
                <div className="mp-detail-meta">
                  <span>🕐 {currentCard.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span>
                  <span>📍 {addr}</span>
                </div>
                <div className={`mp-detail-expand${expanded ? ' mp-detail-expand--open' : ''}`}>
                  <div className="mp-detail-expand-inner">
                    {website && (<div className="mp-detail-row"><span className="mp-detail-row-label">🔗 Website</span><a href={website} target="_blank" rel="noopener noreferrer" className="mp-detail-row-link">{website}</a></div>)}
                    {requirements && (<div className="mp-detail-row"><span className="mp-detail-row-label">📋 Requirements</span><span className="mp-detail-row-value">{requirements}</span></div>)}
                    {(sourceName || sourceUrl) && (<div className="mp-detail-row"><span className="mp-detail-row-label">📄 Source</span>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mp-detail-row-link">{sourceName || sourceUrl}</a> : <span className="mp-detail-row-value">{sourceName}</span>}</div>)}
                  </div>
                </div>
                <div className="mp-detail-bottom">
                  <div className="mp-detail-tags">{(currentCard.foodTypes || []).slice(0, 5).map(ft => (<span key={ft} className="mp-detail-tag">{t(`foodType.${ft.toLowerCase()}`, ft)}</span>))}</div>
                  <a className="mp-detail-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
                </div>
                <button className="dm-donate-btn" onClick={() => navigate(`/donor/donate/${currentCard.id}`)}>{t('ui.donateBtn')}</button>
                <div className="mp-detail-counter">{cardIndex + 1} / {filtered.length}</div>
              </div>
              <button className="mp-detail-arrow" onClick={nextCard}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></button>
            </div>
          )}
          {filtered.length === 0 && <div className="mp-no-results">No locations found with current filters.</div>}
        </div>
      </div>
    </div>
  );
}

export default DonorMapPage;
