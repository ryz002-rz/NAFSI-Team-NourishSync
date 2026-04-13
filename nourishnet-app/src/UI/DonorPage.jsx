import React, { useRef, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './DonorPage.css';
import locations from '../data/locations_final_merged.json';

const highNeed = [...locations].sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0));
const FOOD_TYPES = [...new Set(locations.flatMap((l) => l.foodTypes || []))].sort();
const HEALTH_ATTRS = ['halal','vegan','vegetarian','noBeef','lowGI','freshProduce','dairyFree'];

const Arrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
);

function DonorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const r1 = useRef(null), r2 = useRef(null), r3 = useRef(null);
  const drag = useDrag();

  return (
    <div className="donor-root">
      <SearchHeader backTo="/portal" activeNav="home" navPrefix="/donor" />
      <section className="donor-hero anim-fade-up">
        <h1 className="donor-title">{t('ui.donorsPortal')}</h1>
        <p className="donor-subtitle">{t('ui.donorsPortalDesc')}</p>
      </section>

      <DonationWizard t={t} navigate={navigate} />

      {/* Community & Your Impact */}
      <ImpactSection t={t} />

      {/* Sort by Needs */}
      <section className="donor-section anim-fade-up anim-d2">
        <div className="donor-section-row">
          <h2 className="donor-section-title">{t('ui.sortByNeeds')}</h2>
          <button className="donor-section-arrow" onClick={() => navigate('/donor/needs')}><Arrow /></button>
        </div>
        <div className="donor-hscroll" ref={r1} {...drag(r1)}>
          {highNeed.slice(0, 20).map((loc) => (<DonorLocCard key={loc.id} loc={loc} t={t} navigate={navigate} />))}
        </div>
      </section>

      {/* Food Type */}
      <section className="donor-section anim-fade-up anim-d3">
        <div className="donor-section-row">
          <h2 className="donor-section-title">{t('ui.foodType')}</h2>
          <button className="donor-section-arrow" onClick={() => navigate('/donor/food-types')}><Arrow /></button>
        </div>
        <div className="donor-hscroll" ref={r2} {...drag(r2)}>
          {FOOD_TYPES.slice(0, 12).map((ft) => (
            <button key={ft} className="donor-green-card" onClick={() => navigate(`/donor/food/${encodeURIComponent(ft)}`)}>
              <span className="donor-green-label">{t(`foodType.${ft.toLowerCase()}`, ft)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Health Attributes */}
      <section className="donor-section anim-fade-up anim-d4">
        <div className="donor-section-row">
          <h2 className="donor-section-title">{t('ui.healthAttribute')}</h2>
          <button className="donor-section-arrow" onClick={() => navigate('/donor/health-types')}><Arrow /></button>
        </div>
        <div className="donor-hscroll" ref={r3} {...drag(r3)}>
          {HEALTH_ATTRS.map((attr) => (
            <button key={attr} className="donor-green-card" onClick={() => navigate(`/donor/health/${encodeURIComponent(attr)}`)}>
              <span className="donor-green-label">{t(`filter.${attr}`)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Impact Section ── */
function ImpactSection({ t }) {
  const communityMeals = 12450;
  const communityCo2 = 36225;
  const communityWater = 1345000;
  const communityDonors = 342;

  return (
    <section className="donor-section anim-fade-up" style={{ animationDelay: '0.15s' }}>
      <h2 className="donor-section-title">Community Impact</h2>
      <div className="dw-impact-grid" style={{ marginBottom: 24 }}>
        <div className="dw-impact-card"><span className="dw-impact-val">{communityMeals.toLocaleString()}</span><span className="dw-impact-lbl">Total Meals</span></div>
        <div className="dw-impact-card"><span className="dw-impact-val">{communityCo2.toLocaleString()} lbs</span><span className="dw-impact-lbl">CO₂ Saved</span></div>
        <div className="dw-impact-card"><span className="dw-impact-val">{communityWater.toLocaleString()} gal</span><span className="dw-impact-lbl">Water Saved</span></div>
        <div className="dw-impact-card"><span className="dw-impact-val">{communityDonors}</span><span className="dw-impact-lbl">Donors</span></div>
      </div>

      <h2 className="donor-section-title">Your Impact</h2>
      <div className="dw-impact-grid">
        <div className="dw-impact-card"><span className="dw-impact-val">0</span><span className="dw-impact-lbl">Meals Provided</span></div>
        <div className="dw-impact-card"><span className="dw-impact-val">0 lbs</span><span className="dw-impact-lbl">CO₂ Saved</span></div>
        <div className="dw-impact-card"><span className="dw-impact-val">0 gal</span><span className="dw-impact-lbl">Water Saved</span></div>
        <div className="dw-impact-card"><span className="dw-impact-val">0</span><span className="dw-impact-lbl">Donations</span></div>
      </div>
    </section>
  );
}

/* ── Donation Wizard ── */
function DonationWizard({ t, navigate }) {
  const [step, setStep] = useState(0);
  const [donationType, setDonationType] = useState(null);
  const [items, setItems] = useState('');
  const [lbs, setLbs] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState(null);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const meals = lbs ? Math.round(Number(lbs) * 1.2) : 0;
  const co2 = lbs ? (Number(lbs) * 3.5).toFixed(1) : 0;
  const water = lbs ? Math.round(Number(lbs) * 108) : 0;

  const handleConfirm = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setStep(0); setDonationType(null); setItems(''); setLbs(''); setMoneyAmount('');
      setDate(''); setTime(''); setMethod(null); setSelectedLoc(null); setPhotoPreview(null);
    }, 4000);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = (ev) => setPhotoPreview(ev.target.result); r.readAsDataURL(file); }
  };
  const handleTypeItems = () => { if (textareaRef.current) { textareaRef.current.focus(); textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };

  const nearbyLocs = useMemo(() => [...locations].sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0)).slice(0, 6), []);

  // Thank you popup
  if (showThankYou) {
    return (
      <section className="donor-wizard anim-fade-up anim-d1">
        <div className="dw-thankyou">
          <span className="dw-thankyou-icon">🎉</span>
          <h2 className="dw-thankyou-title">Thank You for Your Donation!</h2>
          <p className="dw-thankyou-msg">Your generosity makes a real difference in our community. Together, we're building a world where no one goes hungry.</p>
          {donationType === 'food' && lbs > 0 && (
            <div className="dw-impact-mini" style={{ justifyContent: 'center', marginTop: 12 }}>
              <span>🍽️ ~{meals} meals</span><span>🌿 ~{co2} lbs CO₂</span><span>💧 ~{water} gal water</span>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="donor-wizard anim-fade-up anim-d1">
      <div className="dw-header">
        <h2 className="donor-section-title">{step === 0 ? 'Start a Donation' : step === 5 ? '✅ Donation Summary' : `Step ${step} of 4`}</h2>
        {step > 0 && step < 5 && (<div className="dw-progress">{[1,2,3,4].map(s => (<span key={s} className={`dw-dot${step >= s ? ' dw-dot--active' : ''}`} />))}</div>)}
      </div>

      {step === 0 && (
        <div className="dw-step">
          <p className="dw-question">What would you like to donate?</p>
          <div className="dw-choice-row">
            <button className="dw-choice-btn" onClick={() => { setDonationType('food'); setStep(1); }}><span className="dw-choice-icon">🍎</span><span className="dw-choice-label">Food Resources</span></button>
            <button className="dw-choice-btn" onClick={() => { setDonationType('money'); setStep(1); }}><span className="dw-choice-icon">💰</span><span className="dw-choice-label">Monetary Donation</span></button>
          </div>
        </div>
      )}

      {step === 1 && donationType === 'food' && (
        <div className="dw-step">
          <p className="dw-question">📦 What are you donating?</p>
          <div className="dw-upload-row">
            <button className="dw-upload-box" onClick={() => fileInputRef.current?.click()}><span className="dw-upload-icon">📷</span><span>{t('ui.takePhoto')}</span></button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
            <button className="dw-upload-box" onClick={handleTypeItems}><span className="dw-upload-icon">📝</span><span>{t('ui.typeItems')}</span></button>
          </div>
          {photoPreview && (<div className="dw-photo-preview"><img src={photoPreview} alt="Preview" className="dw-photo-img" /><button className="dw-photo-remove" onClick={() => setPhotoPreview(null)}>✕</button></div>)}
          <textarea ref={textareaRef} className="dw-textarea" placeholder="Describe items..." value={items} onChange={e => setItems(e.target.value)} rows={3} />
          <div className="dw-qty-row"><label className="dw-label">Estimated weight</label><input className="dw-input" type="number" placeholder="e.g. 25" value={lbs} onChange={e => setLbs(e.target.value)} /><span className="dw-unit">lbs</span></div>
          {lbs > 0 && (<div className="dw-impact-mini"><span>🍽️ ~{meals} meals</span><span>🌿 ~{co2} lbs CO₂</span><span>💧 ~{water} gal water</span></div>)}
          <div className="dw-nav"><button className="dw-back" onClick={() => setStep(0)}>← Back</button><button className="dw-next" onClick={() => setStep(2)} disabled={!items && !lbs}>Next →</button></div>
        </div>
      )}

      {step === 1 && donationType === 'money' && (
        <div className="dw-step">
          <p className="dw-question">💰 How much would you like to donate?</p>
          <div className="dw-money-row">
            {['10','25','50','100'].map(amt => (<button key={amt} className={`dw-money-btn${moneyAmount === amt ? ' dw-money-btn--active' : ''}`} onClick={() => setMoneyAmount(amt)}>${amt}</button>))}
          </div>
          <div className="dw-qty-row"><label className="dw-label">Custom</label><span className="dw-unit">$</span><input className="dw-input" type="number" placeholder="Other" value={moneyAmount} onChange={e => setMoneyAmount(e.target.value)} /></div>
          {moneyAmount > 0 && (<div className="dw-impact-mini"><span>🍽️ ~{Math.round(Number(moneyAmount) * 3)} meals</span></div>)}
          <div className="dw-nav"><button className="dw-back" onClick={() => setStep(0)}>← Back</button><button className="dw-next" onClick={() => setStep(4)} disabled={!moneyAmount}>Next →</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="dw-step">
          <p className="dw-question">📅 When can you deliver/have it picked up?</p>
          <div className="dw-date-row">
            <div className="dw-field"><label className="dw-label">Date</label><input className="dw-input dw-input--wide" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
            <div className="dw-field"><label className="dw-label">Time</label><input className="dw-input dw-input--wide" type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
          </div>
          <div className="dw-nav"><button className="dw-back" onClick={() => setStep(1)}>← Back</button><button className="dw-next" onClick={() => setStep(3)} disabled={!date}>Next →</button></div>
        </div>
      )}

      {step === 3 && (
        <div className="dw-step">
          <p className="dw-question">🚗 How will the donation be delivered?</p>
          <div className="dw-method-row">
            {[['self-drive','🚗','Self-Drive',"I'll drop it off"],['volunteer-pickup','🤝','Volunteer Pickup','A volunteer picks up'],['mail','📦','Ship / Mail',"I'll ship it"]].map(([key,icon,label,desc]) => (
              <button key={key} className={`dw-method-btn${method === key ? ' dw-method-btn--active' : ''}`} onClick={() => setMethod(key)}>
                <span className="dw-method-icon">{icon}</span><span>{label}</span><span className="dw-method-desc">{desc}</span>
              </button>
            ))}
          </div>
          <div className="dw-nav"><button className="dw-back" onClick={() => setStep(2)}>← Back</button><button className="dw-next" onClick={() => setStep(4)} disabled={!method}>Next →</button></div>
        </div>
      )}

      {step === 4 && (
        <div className="dw-step">
          <p className="dw-question">📍 Where would you like to donate?</p>
          <div className="dw-loc-grid">
            {nearbyLocs.map(loc => (<button key={loc.id} className={`dw-loc-btn${selectedLoc?.id === loc.id ? ' dw-loc-btn--active' : ''}`} onClick={() => setSelectedLoc(loc)}>
              <span className="dw-loc-name">{loc.name}</span><span className="dw-loc-addr">{[loc.address?.street, loc.address?.city].filter(Boolean).join(', ')}</span>
              {loc.insecurityIndex >= 4 && <span className="dw-loc-badge">High Need (Level {loc.insecurityIndex})</span>}
            </button>))}
          </div>
          <button className="dw-browse-btn" onClick={() => navigate('/donor/map')}>🗺️ Browse on Map</button>
          <div className="dw-nav"><button className="dw-back" onClick={() => setStep(donationType === 'money' ? 1 : 3)}>← Back</button><button className="dw-next" onClick={() => setStep(5)} disabled={!selectedLoc}>Review →</button></div>
        </div>
      )}

      {step === 5 && (
        <div className="dw-step">
          <div className="dw-summary">
            <div className="dw-summary-row"><span className="dw-summary-label">Type</span><span>{donationType === 'food' ? '🍎 Food' : '💰 Money'}</span></div>
            {donationType === 'food' && items && <div className="dw-summary-row"><span className="dw-summary-label">Items</span><span>{items}</span></div>}
            {donationType === 'food' && lbs && <div className="dw-summary-row"><span className="dw-summary-label">Weight</span><span>{lbs} lbs</span></div>}
            {donationType === 'money' && <div className="dw-summary-row"><span className="dw-summary-label">Amount</span><span>${moneyAmount}</span></div>}
            {date && <div className="dw-summary-row"><span className="dw-summary-label">Date</span><span>{date} {time}</span></div>}
            {method && <div className="dw-summary-row"><span className="dw-summary-label">Delivery</span><span>{method}</span></div>}
            {selectedLoc && <div className="dw-summary-row"><span className="dw-summary-label">Location</span><span>{selectedLoc.name}</span></div>}
          </div>
          {donationType === 'food' && lbs > 0 && (
            <div className="dw-impact-final"><h3 className="dw-impact-title">Your Impact</h3>
              <div className="dw-impact-grid">
                <div className="dw-impact-card"><span className="dw-impact-val">{meals}</span><span className="dw-impact-lbl">Meals</span></div>
                <div className="dw-impact-card"><span className="dw-impact-val">{co2} lbs</span><span className="dw-impact-lbl">CO₂ Saved</span></div>
                <div className="dw-impact-card"><span className="dw-impact-val">{water} gal</span><span className="dw-impact-lbl">Water Saved</span></div>
              </div>
            </div>
          )}
          <div className="dw-nav"><button className="dw-back" onClick={() => setStep(4)}>← Back</button><button className="dw-confirm" onClick={handleConfirm}>✅ Confirm Donation</button></div>
        </div>
      )}
    </section>
  );
}

/* ── Location Card with Donate button ── */
function DonorLocCard({ loc, t, navigate }) {
  const [expanded, setExpanded] = useState(false);
  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
  const requirements = Array.isArray(loc.requirements) ? loc.requirements.join(', ') : loc.requirements || '';
  const website = loc.website || '';
  const sourceName = loc.source?.source_name || '';
  const sourceUrl = loc.source?.source_url || loc.source?.extracted_from || '';

  return (
    <div className="donor-loc-card">
      <div className="donor-loc-top">
        <div><span className="donor-loc-name">{loc.name}</span><span className="donor-loc-partner">{t('ui.partner')}</span></div>
        <button className="donor-loc-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
      </div>
      <div className="donor-loc-meta"><span>🕐 {loc.hours || t('ui.contactForHours')} 🔁 {t('ui.ongoing')}</span><span>📍 {addr}</span></div>
      <div className={`donor-loc-expand${expanded ? ' donor-loc-expand--open' : ''}`}>
        <div className="donor-loc-expand-inner">
          {website && (<div className="donor-loc-detail-row"><span className="donor-loc-detail-label">🔗 Website</span><a href={website} target="_blank" rel="noopener noreferrer" className="donor-loc-detail-link">{website}</a></div>)}
          {requirements && (<div className="donor-loc-detail-row"><span className="donor-loc-detail-label">📋 Requirements</span><span className="donor-loc-detail-value">{requirements}</span></div>)}
          {(sourceName || sourceUrl) && (<div className="donor-loc-detail-row"><span className="donor-loc-detail-label">📄 Source</span>{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="donor-loc-detail-link">{sourceName || sourceUrl}</a> : <span className="donor-loc-detail-value">{sourceName}</span>}</div>)}
          <button className="donor-loc-map-btn" onClick={() => navigate(`/donor/map?loc=${loc.id}`)}>🗺️ {t('ui.showInMap')}</button>
        </div>
      </div>
      <div className="donor-loc-footer">
        <div className="donor-loc-bottom">
          <div className="donor-loc-tags">{(loc.foodTypes || []).slice(0, 4).map((ft) => (<button key={ft} className="donor-loc-tag" onClick={() => navigate(`/donor/food/${encodeURIComponent(ft)}`)}>{t(`foodType.${ft.toLowerCase()}`, ft)}</button>))}</div>
          <a className="donor-loc-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
        </div>
        <button className="donor-card-donate-btn" onClick={() => navigate(`/donor/donate/${loc.id}`)}>{t('ui.donateBtn')}</button>
      </div>
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
