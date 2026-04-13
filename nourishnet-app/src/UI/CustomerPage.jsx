import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader, { useGeolocation } from './SearchHeader';
import './CustomerPage.css';
import arrowIcon from './assets/arrow-right.svg';
import locations from '../data/locations.json';

const FOOD_TYPES = [...new Set(locations.flatMap((l) => l.foodTypes || []))].sort();
const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];

function CustomerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const nearbyRef = useRef(null);
  const foodRef = useRef(null);
  const availRef = useRef(null);
  const dietRef = useRef(null);
  const drag = useScrollDrag();
  useGeolocation();

  return (
    <div className="cust-root">
      <SearchHeader backTo="/portal" activeNav="home" navPrefix="/customer" />

      <section className="cust-hero">
        <h1 className="cust-title">{t('ui.customersPortal')}</h1>
        <p className="cust-subtitle">{t('ui.browseFood')}</p>
      </section>

      {/* Nearby You */}
      <Section title={t('ui.nearbyYou')} onArrow={() => navigate('/customer/nearby')}>
        <div className="cust-hscroll" ref={nearbyRef} {...drag(nearbyRef)}>
          {locations.slice(0, 20).map((loc) => (
            <LocCard key={loc.id} loc={loc} t={t} />
          ))}
        </div>
      </Section>

      {/* Food Type */}
      <Section title={t('ui.foodType')} onArrow={() => navigate('/customer/food-types')}>
        <div className="cust-hscroll" ref={foodRef} {...drag(foodRef)}>
          {FOOD_TYPES.slice(0, 12).map((ft) => (
            <button key={ft} className="cust-food-card" onClick={() => navigate(`/customer/food/${encodeURIComponent(ft)}`)}>
              <span className="cust-food-label">{ft}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Now Available */}
      <Section title={t('ui.nowAvailable')}>
        <div className="cust-hscroll" ref={availRef} {...drag(availRef)}>
          {locations.slice(0, 15).map((loc) => (
            <LocCard key={loc.id} loc={loc} t={t} />
          ))}
        </div>
      </Section>

      {/* Dietary Options */}
      <Section title={t('ui.dietaryOptions')}>
        <div className="cust-hscroll" ref={dietRef} {...drag(dietRef)}>
          {HEALTH_ATTRS.map((attr) => (
            <button key={attr} className="cust-diet-card">
              <span className="cust-diet-label">{t(`filter.${attr}`)}</span>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, onArrow, children }) {
  return (
    <section className="cust-section">
      <div className="cust-section-row">
        <h2 className="cust-section-title">{title}</h2>
        {onArrow && (
          <button className="cust-section-arrow" onClick={onArrow}>
            <img src={arrowIcon} alt="" className="cust-arrow-flip" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function LocCard({ loc, t }) {
  return (
    <div className="cust-loc-card">
      <div className="cust-loc-top">
        <div>
          <span className="cust-loc-name">{loc.name}</span>
          <span className="cust-loc-partner">{t('ui.partner')}</span>
        </div>
        <button className="cust-loc-details">{t('ui.showDetails')} ›</button>
      </div>
      <div className="cust-loc-meta">
        <span>🕐 {loc.hours || t('ui.contactForHours')} 📧 {t('ui.ongoing')}</span>
        <span>📍 {loc.address.street}, {loc.address.city}, {loc.address.state} {loc.address.zip}</span>
      </div>
      <div className="cust-loc-bottom">
        <div className="cust-loc-tags">
          {(loc.foodTypes || []).slice(0, 5).map((ft) => (
            <span key={ft} className="cust-loc-tag">{ft}</span>
          ))}
        </div>
        <a className="cust-loc-dir"
          href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
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
