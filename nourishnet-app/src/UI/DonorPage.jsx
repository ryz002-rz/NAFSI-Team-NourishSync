import React, { useRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './DonorPage.css';
import arrowIcon from './assets/arrow-right.svg';
import locations from '../data/locations.json';

const highNeed = [...locations].sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0));

function DonorPage() {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const drag = useDrag();
  const [lbs, setLbs] = useState('');

  const meals = lbs ? Math.round(Number(lbs) * 1.2) : 0;
  const co2 = lbs ? (Number(lbs) * 3.5).toFixed(1) : 0;
  const water = lbs ? Math.round(Number(lbs) * 108) : 0;

  return (
    <div className="donor-root">
      <SearchHeader backTo="/portal" activeNav="home" navPrefix="/donor" />

      <section className="donor-hero">
        <h1 className="donor-title">{t('ui.donorsPortal')}</h1>
        <p className="donor-subtitle">{t('ui.donorsPortalDesc')}</p>
      </section>

      {/* What are you donating? */}
      <section className="donor-section">
        <h2 className="donor-section-title">{t('ui.whatDonating')}</h2>
        <div className="donor-upload-row">
          <button className="donor-upload-box">
            <span className="donor-upload-icon">📷</span>
            <span className="donor-upload-label">{t('ui.takePhoto')}</span>
          </button>
          <button className="donor-upload-box">
            <span className="donor-upload-icon">📝</span>
            <span className="donor-upload-label">{t('ui.typeItems')}</span>
          </button>
        </div>
        <div className="donor-qty-row">
          <label className="donor-qty-label">{t('ui.quantity')}</label>
          <input className="donor-qty-input" type="number" placeholder="e.g. 25" value={lbs} onChange={(e) => setLbs(e.target.value)} />
          <span className="donor-qty-unit">lbs</span>
        </div>
        <button className="donor-donate-btn">{t('ui.donateBtn')}</button>
      </section>

      {/* High Need Areas */}
      <section className="donor-section">
        <div className="donor-section-row">
          <h2 className="donor-section-title">{t('ui.highNeedAreas')}</h2>
          <button className="donor-section-arrow"><img src={arrowIcon} alt="" className="donor-arrow-flip" /></button>
        </div>
        <div className="donor-hscroll" ref={scrollRef} {...drag(scrollRef)}>
          {highNeed.slice(0, 20).map((loc) => (
            <div key={loc.id} className="donor-loc-card">
              <div className="donor-loc-top">
                <div>
                  <span className="donor-loc-name">{loc.name}</span>
                  <span className="donor-loc-partner">{t('ui.partner')}</span>
                </div>
                <button className="donor-loc-details">{t('ui.showDetails')} ›</button>
              </div>
              <div className="donor-loc-meta">
                <span>🕐 {loc.hours || t('ui.contactForHours')} 📧 {t('ui.ongoing')}</span>
                <span>📍 {loc.address.street}, {loc.address.city}, {loc.address.state} {loc.address.zip}</span>
              </div>
              {loc.insecurityIndex && (
                <div className="donor-loc-need">
                  <span className="donor-need-badge">{t('ui.highNeed')}</span>
                  <span className="donor-need-score">{loc.insecurityIndex.toFixed(1)}</span>
                </div>
              )}
              <div className="donor-loc-bottom">
                <div className="donor-loc-tags">
                  {(loc.foodTypes || []).slice(0, 4).map((ft) => (<span key={ft} className="donor-loc-tag">{ft}</span>))}
                </div>
                <a className="donor-loc-dir" href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                  target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Calculator */}
      <section className="donor-section">
        <h2 className="donor-section-title">{t('ui.impactCalculator')}</h2>
        <p className="donor-impact-desc">{t('ui.impactCalcDesc')}</p>
        <div className="donor-impact-grid">
          <div className="donor-impact-card">
            <span className="donor-impact-value">{meals}</span>
            <span className="donor-impact-label">{t('impact.meals')}</span>
          </div>
          <div className="donor-impact-card">
            <span className="donor-impact-value">{co2} lbs</span>
            <span className="donor-impact-label">{t('impact.co2')}</span>
          </div>
          <div className="donor-impact-card">
            <span className="donor-impact-value">{water} gal</span>
            <span className="donor-impact-label">{t('impact.water')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function useDrag() {
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

export default DonorPage;
