import React, { useState, useEffect, useMemo, useCallback, useRef, createRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchHeader from './SearchHeader';
import './MapPage.css';
import locations from '../data/locations_final_merged.json';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ALL_FOOD_TYPES = [...new Set(locations.flatMap((l) => l.foodTypes || []))].sort();
const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];
const DEFAULT_CENTER = [38.9, -76.95];

function distanceMi(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const ZIP_COORDS = (() => {
  const acc = {};
  locations.forEach(l => {
    const z = l.address?.zip;
    if (z && l.lat && l.lng) {
      if (!acc[z]) acc[z] = { lat: 0, lng: 0, n: 0 };
      acc[z].lat += l.lat; acc[z].lng += l.lng; acc[z].n++;
    }
  });
  const result = {};
  Object.entries(acc).forEach(([z, v]) => { result[z] = { lat: v.lat/v.n, lng: v.lng/v.n }; });
  return result;
})();

function findZipCenter(zip) {
  if (ZIP_COORDS[zip]) return ZIP_COORDS[zip];
  const matches = Object.keys(ZIP_COORDS).filter(z => z.startsWith(zip));
  if (matches.length > 0) {
    const avg = { lat: 0, lng: 0 };
    matches.forEach(z => { avg.lat += ZIP_COORDS[z].lat; avg.lng += ZIP_COORDS[z].lng; });
    return { lat: avg.lat / matches.length, lng: avg.lng / matches.length };
  }
  return null;
}

function computeCoverageClusters(locs) {
  const grid = {};
  const step = 0.03;
  locs.forEach(l => {
    if (!l.lat || !l.lng) return;
    const key = `${Math.round(l.lat/step)}_${Math.round(l.lng/step)}`;
    if (!grid[key]) grid[key] = { lat: 0, lng: 0, count: 0 };
    grid[key].lat += l.lat; grid[key].lng += l.lng; grid[key].count++;
  });
  return Object.values(grid).map(g => ({
    lat: g.lat/g.count, lng: g.lng/g.count, count: g.count,
    level: g.count >= 20 ? 5 : g.count >= 12 ? 4 : g.count >= 6 ? 3 : g.count >= 3 ? 2 : 1,
  }));
}

const LEVEL_COLORS = { 1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#16a34a' };
const LEVEL_LABELS = { 1: 'level.veryLow', 2: 'level.low', 3: 'level.moderate', 4: 'level.good', 5: 'level.excellent' };
const LEVEL_RADIUS = { 1: 1200, 2: 1400, 3: 1600, 4: 1800, 5: 2000 };

function FlyTo({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!lat || !lng) return;
    const current = map.getCenter();
    const dist = Math.abs(current.lat - lat) + Math.abs(current.lng - lng);
    if (dist < 0.01) {
      // Very close — just pan smoothly
      map.panTo([lat, lng], { animate: true, duration: 0.3 });
    } else if (dist < 0.1) {
      // Nearby — smooth pan without zoom bounce
      map.setView([lat, lng], zoom || 14, { animate: true, duration: 0.5 });
    } else {
      // Far — fly with short duration
      map.flyTo([lat, lng], zoom || 14, { duration: 1.0 });
    }
  }, [lat, lng, zoom, map]);
  return null;
}

// Component to open a specific marker's popup
function OpenPopup({ locId, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (locId && markerRefs.current[locId]) {
      // Wait for any animation to finish, then open
      const tryOpen = () => {
        const marker = markerRefs.current[locId];
        if (marker) marker.openPopup();
      };
      const delay = 600;
      const timer = setTimeout(tryOpen, delay);
      return () => clearTimeout(timer);
    }
  }, [locId, markerRefs, map]);
  return null;
}

// Miles to approximate Leaflet zoom level
const RANGE_STEPS = [5, 10, 20, 55];
function rangeToZoom(mi) {
  if (mi <= 5) return 13;
  if (mi <= 10) return 12;
  if (mi <= 20) return 11;
  return 9;
}

// Component to track map center for range filtering
function MapCenterTracker({ onCenterChange }) {
  const map = useMap();
  useEffect(() => {
    const handler = () => {
      const c = map.getCenter();
      onCenterChange({ lat: c.lat, lng: c.lng });
    };
    map.on('moveend', handler);
    handler();
    return () => map.off('moveend', handler);
  }, [map, onCenterChange]);
  return null;
}

// Component to set zoom
function SetZoom({ zoom }) {
  const map = useMap();
  useEffect(() => { if (zoom) map.setZoom(zoom, { animate: true }); }, [zoom, map]);
  return null;
}

function MapPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const locId = searchParams.get('loc');
  const preSelected = locId ? locations.find(l => l.id === locId) : null;

  const [coverage, setCoverage] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [confirmedZip, setConfirmedZip] = useState('');
  const [range, setRange] = useState(55);
  const [zoomFromRange, setZoomFromRange] = useState(null);
  const [mapCenter, setMapCenter] = useState(
    preSelected ? { lat: preSelected.lat, lng: preSelected.lng } : { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] }
  );
  const [selectedFoodTypes, setSelectedFoodTypes] = useState(new Set());
  const [selectedHealthAttrs, setSelectedHealthAttrs] = useState(new Set());
  const [selected, setSelected] = useState(preSelected || null);
  const [cardIndex, setCardIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [flyTarget, setFlyTarget] = useState(
    preSelected ? { lat: preSelected.lat, lng: preSelected.lng, zoom: 14 } : null
  );
  const [openPopupId, setOpenPopupId] = useState(preSelected?.id || null);
  const markerRefs = useRef({});

  const toggleFoodType = useCallback((ft) => {
    setSelectedFoodTypes(prev => { const n = new Set(prev); n.has(ft) ? n.delete(ft) : n.add(ft); return n; });
  }, []);
  const toggleHealthAttr = useCallback((attr) => {
    setSelectedHealthAttrs(prev => { const n = new Set(prev); n.has(attr) ? n.delete(attr) : n.add(attr); return n; });
  }, []);
  const clearFilters = useCallback(() => {
    setZipInput(''); setConfirmedZip(''); setRange(55); setZoomFromRange(null);
    setSelectedFoodTypes(new Set()); setSelectedHealthAttrs(new Set());
    setSelected(null); setCardIndex(0); setExpanded(false); setOpenPopupId(null);
  }, []);

  const handleConfirmZip = () => {
    const trimmed = zipInput.trim();
    if (!trimmed) return;
    setConfirmedZip(trimmed);
    // Find center — try exact, then partial, then nearest
    let c = findZipCenter(trimmed);
    if (!c) {
      // Find nearest ZIP by prefix
      const allZips = Object.keys(ZIP_COORDS);
      const nearest = allZips.reduce((best, z) => {
        const diff = Math.abs(parseInt(z) - parseInt(trimmed));
        return diff < best.diff ? { zip: z, diff } : best;
      }, { zip: null, diff: Infinity });
      if (nearest.zip) c = ZIP_COORDS[nearest.zip];
    }
    if (c) {
      setMapCenter({ lat: c.lat, lng: c.lng });
      setFlyTarget({ lat: c.lat, lng: c.lng, zoom: rangeToZoom(range) });
    }
  };

  // Snap slider value to nearest step
  const handleSliderChange = (val) => {
    const snapped = RANGE_STEPS.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
    setRange(snapped);
    setZoomFromRange(rangeToZoom(snapped));
  };

  const onMapCenterChange = useCallback((center) => {
    setMapCenter(center);
  }, []);

  const filtered = useMemo(() => {
    let result = locations.filter(l => l.lat && l.lng);
    const zipCenter = confirmedZip.length >= 3 ? findZipCenter(confirmedZip) : null;
    const filterCenter = zipCenter || mapCenter;
    if (filterCenter) {
      result = result.filter(l => distanceMi(filterCenter.lat, filterCenter.lng, l.lat, l.lng) <= range);
    }
    if (selectedFoodTypes.size > 0) {
      result = result.filter(l => l.foodTypes && l.foodTypes.some(ft => selectedFoodTypes.has(ft)));
    }
    if (selectedHealthAttrs.size > 0) {
      result = result.filter(l => l.healthAttributes && [...selectedHealthAttrs].some(a => l.healthAttributes[a]));
    }
    return result;
  }, [confirmedZip, range, mapCenter, selectedFoodTypes, selectedHealthAttrs]);

  const clusters = useMemo(() => coverage ? computeCoverageClusters(filtered) : [], [coverage, filtered]);

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

  // Auto-open popup for first card on load
  useEffect(() => {
    if (!selected && currentCard) {
      setOpenPopupId(currentCard.id);
    }
  }, [currentCard, selected]);

  const navigateToCard = (i) => {
    setCardIndex(i); setExpanded(false);
    const loc = filtered[i];
    if (loc) {
      setSelected(loc);
      setFlyTarget({ lat: loc.lat, lng: loc.lng, zoom: 14 });
      setOpenPopupId(loc.id);
    }
  };
  const prevCard = () => { if (filtered.length === 0) return; navigateToCard((cardIndex - 1 + filtered.length) % filtered.length); };
  const nextCard = () => { if (filtered.length === 0) return; navigateToCard((cardIndex + 1) % filtered.length); };

  const handleMarkerClick = (loc) => {
    setSelected(loc); setExpanded(false);
    const idx = filtered.findIndex(l => l.id === loc.id);
    if (idx >= 0) setCardIndex(idx);
    setFlyTarget({ lat: loc.lat, lng: loc.lng, zoom: 14 });
    setOpenPopupId(loc.id);
  };

  const addr = currentCard ? [currentCard.address?.street, currentCard.address?.city, currentCard.address?.state, currentCard.address?.zip].filter(Boolean).join(', ') : '';
  const dirUrl = currentCard ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}` : '';
  const requirements = currentCard ? (Array.isArray(currentCard.requirements) ? currentCard.requirements.join(', ') : currentCard.requirements || '') : '';
  const website = currentCard?.website || '';
  const notes = currentCard?.notes || '';
  const sourceName = currentCard?.source?.source_name || '';
  const sourceUrl = currentCard?.source?.source_url || currentCard?.source?.extracted_from || '';

  return (
    <div className="mp-root">
      <SearchHeader backTo="/customer" activeNav="map" navPrefix="/customer" />
      <div className="mp-body">
        <aside className="mp-sidebar">
          <h3 className="mp-filter-title">{t('ui.filter')}</h3>

          {/* Coverage toggle + legend */}
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.foodResourceCoverage')}</label>
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

          {/* Range */}
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.locationRange')}</label>
            <input type="range" min={5} max={55} value={range} onChange={e => handleSliderChange(Number(e.target.value))} className="mp-range" />
            <div className="mp-range-labels"><span>5mi</span><span>10mi</span><span>20mi</span><span>55mi</span></div>
            <span className="mp-range-status">{filtered.length} locations within {range}mi</span>
          </div>

          {/* Food Types */}
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.foodType')}</label>
            <div className="mp-tag-list">
              {ALL_FOOD_TYPES.map(ft => (
                <button key={ft} className={`mp-tag${selectedFoodTypes.has(ft) ? ' mp-tag--active' : ''}`} onClick={() => toggleFoodType(ft)}>{ft}</button>
              ))}
            </div>
          </div>

          {/* Health Attributes */}
          <div className="mp-filter-group">
            <label className="mp-filter-label">{t('ui.healthAttribute')}</label>
            <div className="mp-tag-list">
              {HEALTH_ATTRS.map(a => (
                <button key={a} className={`mp-tag${selectedHealthAttrs.has(a) ? ' mp-tag--active' : ''}`} onClick={() => toggleHealthAttr(a)}>{t(`filter.${a}`)}</button>
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
            {coverage && clusters.map((c, i) => (
              <Circle key={i} center={[c.lat, c.lng]} radius={LEVEL_RADIUS[c.level]}
                pathOptions={{ color: LEVEL_COLORS[c.level], fillColor: LEVEL_COLORS[c.level], fillOpacity: 0.25, weight: 1 }} />
            ))}
            {filtered.map(loc => {
              const locAddr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
              return (
                <Marker key={loc.id} position={[loc.lat, loc.lng]}
                  ref={el => { if (el) markerRefs.current[loc.id] = el; }}
                  eventHandlers={{ click: () => handleMarkerClick(loc) }}>
                  <Popup>
                    <strong style={{ fontSize: '14px' }}>{loc.name}</strong><br />
                    <span style={{ fontSize: '12px', color: '#555' }}>{locAddr}</span><br />
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locAddr)}`}
                      target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontSize: '13px', fontWeight: 500 }}>📍 {t('ui.getDirections')}</a>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {currentCard && (
            <div className="mp-detail-wrap">
              <button className="mp-detail-arrow" onClick={prevCard} aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <div className="mp-detail-card">
                <div className="mp-detail-top">
                  <div>
                    <span className="mp-detail-name">{currentCard.name}</span>
                    <span className="mp-detail-partner">{t('ui.partner')}</span>
                  </div>
                  <button className="mp-detail-details" onClick={() => setExpanded(!expanded)}>
                    {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
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
                    {notes && (<div className="mp-detail-row"><span className="mp-detail-row-label">📝 Notes</span><span className="mp-detail-row-value">{notes}</span></div>)}
                    {(sourceName || sourceUrl) && (<div className="mp-detail-row"><span className="mp-detail-row-label">📄 Source</span>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mp-detail-row-link">{sourceName || sourceUrl}</a> : <span className="mp-detail-row-value">{sourceName}</span>}</div>)}
                  </div>
                </div>
                <div className="mp-detail-bottom">
                  <div className="mp-detail-tags">{(currentCard.foodTypes || []).slice(0, 5).map(ft => (<span key={ft} className="mp-detail-tag">{ft}</span>))}</div>
                  <a className="mp-detail-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
                </div>
                <div className="mp-detail-counter">{cardIndex + 1} / {filtered.length}</div>
              </div>
              <button className="mp-detail-arrow" onClick={nextCard} aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
              </button>
            </div>
          )}
          {filtered.length === 0 && <div className="mp-no-results">No locations found with current filters.</div>}
        </div>
      </div>
    </div>
  );
}

export default MapPage;
