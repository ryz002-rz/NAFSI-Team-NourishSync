import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './DonorPage.css';
import locations from '../data/locations_final_merged.json';

function DonateToPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { locId } = useParams();
  const loc = locations.find(l => l.id === locId);

  const [step, setStep] = useState(0);
  const [donationType, setDonationType] = useState(null);
  const [items, setItems] = useState('');
  const [lbs, setLbs] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const meals = lbs ? Math.round(Number(lbs) * 1.2) : 0;
  const co2 = lbs ? (Number(lbs) * 3.5).toFixed(1) : 0;
  const water = lbs ? Math.round(Number(lbs) * 108) : 0;

  const handleConfirm = () => {
    setShowThankYou(true);
    setTimeout(() => navigate('/donor'), 4000);
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = (ev) => setPhotoPreview(ev.target.result); r.readAsDataURL(file); }
  };

  if (!loc) return <div className="donor-root"><SearchHeader backTo="/donor" activeNav="home" navPrefix="/donor" /><p style={{ padding: 40, color: '#4a7c59' }}>Location not found.</p></div>;

  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');

  if (showThankYou) {
    return (
      <div className="donor-root">
        <SearchHeader backTo="/donor" activeNav="home" navPrefix="/donor" />
        <section className="donor-wizard" style={{ padding: '40px' }}>
          <div className="dw-thankyou">
            <span className="dw-thankyou-icon">🎉</span>
            <h2 className="dw-thankyou-title">Thank You!</h2>
            <p className="dw-thankyou-msg">Your donation to <strong>{loc.name}</strong> has been submitted. Redirecting...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="donor-root">
      <SearchHeader backTo="/donor" activeNav="home" navPrefix="/donor" />
      <section className="donor-hero anim-fade-up">
        <h1 className="donor-title">Donate to {loc.name}</h1>
        <p className="donor-subtitle">📍 {addr}</p>
      </section>

      <section className="donor-wizard anim-fade-up anim-d1">
        <div className="dw-header">
          <h2 className="donor-section-title">{step === 0 ? 'Choose Donation Type' : step === 4 ? '✅ Review' : `Step ${step} of 3`}</h2>
          {step > 0 && step < 4 && (<div className="dw-progress">{[1,2,3].map(s => (<span key={s} className={`dw-dot${step >= s ? ' dw-dot--active' : ''}`} />))}</div>)}
        </div>

        {step === 0 && (
          <div className="dw-step">
            <div className="dw-choice-row">
              <button className="dw-choice-btn" onClick={() => { setDonationType('food'); setStep(1); }}><span className="dw-choice-icon">🍎</span><span className="dw-choice-label">Food</span></button>
              <button className="dw-choice-btn" onClick={() => { setDonationType('money'); setStep(1); }}><span className="dw-choice-icon">💰</span><span className="dw-choice-label">Money</span></button>
            </div>
          </div>
        )}

        {step === 1 && donationType === 'food' && (
          <div className="dw-step">
            <p className="dw-question">📦 What are you donating?</p>
            <div className="dw-upload-row">
              <button className="dw-upload-box" onClick={() => fileInputRef.current?.click()}><span className="dw-upload-icon">📷</span><span>{t('ui.takePhoto')}</span></button>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
              <button className="dw-upload-box" onClick={() => textareaRef.current?.focus()}><span className="dw-upload-icon">📝</span><span>{t('ui.typeItems')}</span></button>
            </div>
            {photoPreview && (<div className="dw-photo-preview"><img src={photoPreview} alt="Preview" className="dw-photo-img" /><button className="dw-photo-remove" onClick={() => setPhotoPreview(null)}>✕</button></div>)}
            <textarea ref={textareaRef} className="dw-textarea" placeholder="Describe items..." value={items} onChange={e => setItems(e.target.value)} rows={3} />
            <div className="dw-qty-row"><label className="dw-label">Weight</label><input className="dw-input" type="number" placeholder="lbs" value={lbs} onChange={e => setLbs(e.target.value)} /><span className="dw-unit">lbs</span></div>
            {lbs > 0 && (<div className="dw-impact-mini"><span>🍽️ ~{meals} meals</span><span>🌿 ~{co2} lbs CO₂</span></div>)}
            <div className="dw-nav"><button className="dw-back" onClick={() => setStep(0)}>← Back</button><button className="dw-next" onClick={() => setStep(2)} disabled={!items && !lbs}>Next →</button></div>
          </div>
        )}

        {step === 1 && donationType === 'money' && (
          <div className="dw-step">
            <p className="dw-question">💰 Amount</p>
            <div className="dw-money-row">
              {['10','25','50','100'].map(amt => (<button key={amt} className={`dw-money-btn${moneyAmount === amt ? ' dw-money-btn--active' : ''}`} onClick={() => setMoneyAmount(amt)}>${amt}</button>))}
            </div>
            <div className="dw-qty-row"><span className="dw-unit">$</span><input className="dw-input" type="number" placeholder="Custom" value={moneyAmount} onChange={e => setMoneyAmount(e.target.value)} /></div>
            <div className="dw-nav"><button className="dw-back" onClick={() => setStep(0)}>← Back</button><button className="dw-next" onClick={() => setStep(2)} disabled={!moneyAmount}>Next →</button></div>
          </div>
        )}

        {step === 2 && (
          <div className="dw-step">
            <p className="dw-question">📅 When?</p>
            <div className="dw-date-row">
              <div className="dw-field"><label className="dw-label">Date</label><input className="dw-input dw-input--wide" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
              <div className="dw-field"><label className="dw-label">Time</label><input className="dw-input dw-input--wide" type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
            </div>
            <div className="dw-nav"><button className="dw-back" onClick={() => setStep(1)}>← Back</button><button className="dw-next" onClick={() => setStep(donationType === 'food' ? 3 : 4)} disabled={!date}>Next →</button></div>
          </div>
        )}

        {step === 3 && (
          <div className="dw-step">
            <p className="dw-question">🚗 Delivery method?</p>
            <div className="dw-method-row">
              {[['self-drive','🚗','Self-Drive'],['volunteer-pickup','🤝','Volunteer Pickup'],['mail','📦','Ship/Mail']].map(([key,icon,label]) => (
                <button key={key} className={`dw-method-btn${method === key ? ' dw-method-btn--active' : ''}`} onClick={() => setMethod(key)}>
                  <span className="dw-method-icon">{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
            <div className="dw-nav"><button className="dw-back" onClick={() => setStep(2)}>← Back</button><button className="dw-next" onClick={() => setStep(4)} disabled={!method}>Review →</button></div>
          </div>
        )}

        {step === 4 && (
          <div className="dw-step">
            <div className="dw-summary">
              <div className="dw-summary-row"><span className="dw-summary-label">To</span><span>{loc.name}</span></div>
              <div className="dw-summary-row"><span className="dw-summary-label">Type</span><span>{donationType === 'food' ? '🍎 Food' : '💰 Money'}</span></div>
              {items && <div className="dw-summary-row"><span className="dw-summary-label">Items</span><span>{items}</span></div>}
              {lbs && <div className="dw-summary-row"><span className="dw-summary-label">Weight</span><span>{lbs} lbs</span></div>}
              {moneyAmount && donationType === 'money' && <div className="dw-summary-row"><span className="dw-summary-label">Amount</span><span>${moneyAmount}</span></div>}
              {date && <div className="dw-summary-row"><span className="dw-summary-label">Date</span><span>{date} {time}</span></div>}
              {method && <div className="dw-summary-row"><span className="dw-summary-label">Delivery</span><span>{method}</span></div>}
            </div>
            <div className="dw-nav"><button className="dw-back" onClick={() => setStep(donationType === 'food' ? 3 : 2)}>← Back</button><button className="dw-confirm" onClick={handleConfirm}>✅ Confirm</button></div>
          </div>
        )}
      </section>
    </div>
  );
}

export default DonateToPage;
