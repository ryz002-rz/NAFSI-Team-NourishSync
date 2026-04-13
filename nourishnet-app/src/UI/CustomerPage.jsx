import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader, { useGeolocation } from './SearchHeader';
import './CustomerPage.css';
import locations from '../data/locations_final_merged.json';

const FOOD_TYPES = [...new Set(locations.flatMap((l) => l.foodTypes || []))].sort();
const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];

const Arrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

function CustomerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const r1 = useRef(null), r2 = useRef(null), r3 = useRef(null), r4 = useRef(null);
  const drag = useScrollDrag();
  useGeolocation();

  return (
    <div className="cust-root">
      <SearchHeader backTo="/portal" activeNav="home" navPrefix="/customer" />

      <section className="cust-hero anim-fade-up">
        <h1 className="cust-title">{t('ui.customersPortal')}</h1>
        <p className="cust-subtitle">{t('ui.browseFood')}</p>
      </section>

      {/* Nearby You */}
      <section className="cust-section anim-fade-up anim-d1">
        <div className="cust-section-row">
          <h2 className="cust-section-title">{t('ui.nearbyYou')}</h2>
          <button className="cust-section-arrow" onClick={() => navigate('/customer/nearby')}><Arrow /></button>
        </div>
        <div className="cust-hscroll" ref={r1} {...drag(r1)}>
          {locations.slice(0, 20).map((loc) => (<LocCard key={loc.id} loc={loc} t={t} />))}
        </div>
      </section>

      {/* Food Type */}
      <section className="cust-section anim-fade-up anim-d2">
        <div className="cust-section-row">
          <h2 className="cust-section-title">{t('ui.foodType')}</h2>
          <button className="cust-section-arrow" onClick={() => navigate('/customer/food-types')}><Arrow /></button>
        </div>
        <div className="cust-hscroll" ref={r2} {...drag(r2)}>
          {FOOD_TYPES.slice(0, 12).map((ft) => (
            <button key={ft} className="cust-green-card" onClick={() => navigate(`/customer/food/${encodeURIComponent(ft)}`)}>
              <span className="cust-green-label">{t(`foodType.${ft.toLowerCase()}`, ft)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Health Attributes */}
      <section className="cust-section anim-fade-up anim-d3">
        <div className="cust-section-row">
          <h2 className="cust-section-title">{t('ui.healthAttribute')}</h2>
          <button className="cust-section-arrow" onClick={() => navigate('/customer/health-types')}><Arrow /></button>
        </div>
        <div className="cust-hscroll" ref={r3} {...drag(r3)}>
          {HEALTH_ATTRS.map((attr) => (
            <button key={attr} className="cust-green-card" onClick={() => navigate(`/customer/health/${encodeURIComponent(attr)}`)}>
              <span className="cust-green-label">{t(`filter.${attr}`)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Now Available */}
      <section className="cust-section anim-fade-up anim-d4">
        <div className="cust-section-row">
          <h2 className="cust-section-title">{t('ui.nowAvailable')}</h2>
          <button className="cust-section-arrow" onClick={() => navigate('/customer/available')}><Arrow /></button>
        </div>
        <div className="cust-hscroll" ref={r4} {...drag(r4)}>
          {locations.slice(0, 15).map((loc) => (<LocCard key={loc.id} loc={loc} t={t} />))}
        </div>
      </section>
    </div>
  );
}

function LocCard({ loc, t }) {
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();

  const street = loc.address?.street ?? '';
  const city = loc.address?.city ?? '';
  const state = loc.address?.state ?? '';
  const zip = loc.address?.zip ?? '';
  const addressLine = [street, city, state, zip].filter(Boolean).join(', ');
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine)}`;

  const requirements = Array.isArray(loc.requirements) ? loc.requirements.join(', ') : loc.requirements || '';
  const notes = loc.notes || '';
  const website = loc.website || '';
  const sourceName = loc.source?.source_name || '';
  const sourceUrl = loc.source?.source_url || loc.source?.extracted_from || '';

  const DetailArrow = ({ up }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <div className="cust-loc-card">
      <div className="cust-loc-top">
        <div>
          <span className="cust-loc-name">{loc.name}</span>
          <span className="cust-loc-partner">{t('ui.partner')}</span>
        </div>
        <button className="cust-loc-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <DetailArrow up={expanded} />
        </button>
      </div>
      <div className="cust-loc-meta">
        <span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span>
        <span>📍 {addressLine}</span>
      </div>

      {/* Slide-out details */}
      <div className={`cust-loc-expand${expanded ? ' cust-loc-expand--open' : ''}`}>
        <div className="cust-loc-expand-inner">
          {website && (
            <div className="cust-loc-detail-row">
              <span className="cust-loc-detail-label">🔗 {t('common.website') || 'Website'}</span>
              <a href={website} target="_blank" rel="noopener noreferrer" className="cust-loc-detail-link">{website}</a>
            </div>
          )}
          {requirements && (
            <div className="cust-loc-detail-row">
              <span className="cust-loc-detail-label">📋 Requirements</span>
              <span className="cust-loc-detail-value">{requirements}</span>
            </div>
          )}
          {notes && (
            <div className="cust-loc-detail-row">
              <span className="cust-loc-detail-label">📝 Notes</span>
              <span className="cust-loc-detail-value">{notes}</span>
            </div>
          )}
          {(sourceName || sourceUrl) && (
            <div className="cust-loc-detail-row">
              <span className="cust-loc-detail-label">📄 Source</span>
              {sourceUrl ? (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="cust-loc-detail-link">{sourceName || sourceUrl}</a>
              ) : (
                <span className="cust-loc-detail-value">{sourceName}</span>
              )}
            </div>
          )}
          <button className="cust-loc-map-btn" onClick={() => navigate(`/customer/map?loc=${loc.id}`)}>🗺️ {t('ui.showInMap')}</button>
        </div>
      </div>

      <div className="cust-loc-bottom">
        <div className="cust-loc-tags">
          {(loc.foodTypes || []).slice(0, 5).map((ft) => (
            <button key={ft} className="cust-loc-tag" onClick={() => navigate(`/customer/food/${encodeURIComponent(ft)}`)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>
          ))}
        </div>
        <a className="cust-loc-dir" href={directionsUrl}
          target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
      </div>
    </div>
  );
}

function useScrollDrag() {
  return useCallback((ref) => {
    let down = false, sx = 0, sl = 0;
    return {
      onMouseDown: (e) => { down = true; sx = e.pageX; sl = ref.current.scrollLeft; ref.current.style.cursor = 'grabbing'; },
      onMouseLeave: () => { down = false; if (ref.current) ref.current.style.cursor = 'grab'; },
      onMouseUp: () => { down = false; if (ref.current) ref.current.style.cursor = 'grab'; },
      onMouseMove: (e) => { if (!down) return; e.preventDefault(); ref.current.scrollLeft = sl - (e.pageX - sx); },
    };
  }, []);
}

export default CustomerPage;
