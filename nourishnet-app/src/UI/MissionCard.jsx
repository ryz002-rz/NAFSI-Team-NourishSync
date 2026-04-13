import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { translateHours } from '../utils/translateHours';
import './MissionCard.css';

/**
 * Returns urgency level info based on insecurityIndex.
 * Exported for reuse in other volunteer portal components and tests.
 */
export function getUrgencyLevel(insecurityIndex) {
  if (insecurityIndex === 5) return { label: 'critical', color: '#ef4444', emoji: '🔴' };
  if (insecurityIndex === 4) return { label: 'highNeed', color: '#f97316', emoji: '🟠' };
  if (insecurityIndex === 3) return { label: 'moderate', color: '#eab308', emoji: '🟡' };
  return { label: 'standard', color: '#22c55e', emoji: '🟢' };
}

/**
 * Displays a mission's title, description, date, required skills (badges),
 * needed languages (badges), urgency badge, parent location info,
 * volunteersNeeded count, and a Sign Up CTA.
 *
 * @param {Object} props
 * @param {Object} props.mission - Mission object {title, description, date, skillsRequired[], languagesNeeded[]}
 * @param {Object} props.location - Parent location object
 * @param {Function} [props.onSignUp] - Callback when Sign Up is clicked
 */
function MissionCard({ mission, location, onSignUp }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [signUpStep, setSignUpStep] = useState(0); // 0=button, 1=form, 2=confirmed
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', transportation: '', hours: '' });

  if (!mission || !location) return null;

  const handleSubmit = () => {
    if (onSignUp) onSignUp(mission, location, formData);
    setSignUpStep(2);
    setTimeout(() => setSignUpStep(0), 5000);
  };

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const canSubmit = formData.name.trim() && formData.transportation && formData.hours;

  const urgency = getUrgencyLevel(location.insecurityIndex || 0);
  const addr = [location.address?.street, location.address?.city, location.address?.state, location.address?.zip].filter(Boolean).join(', ');
  const skills = mission.skillsRequired || [];
  const languages = mission.languagesNeeded || [];

  return (
    <div className="vol-card">
      <div className="vol-card-top">
        <div className="vol-card-header">
          <span className="vol-card-title">{mission.title}</span>
          <span className="vol-card-urgency" style={{ color: urgency.color }}>
            {urgency.emoji} {t(`volunteerPortal.${urgency.label}`)}
          </span>
        </div>
        <button className="vol-card-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <p className="vol-card-desc">{mission.description}</p>

      {mission.date && (
        <span className="vol-card-date">📅 {mission.date}</span>
      )}

      {/* Skills badges */}
      {skills.length > 0 && (
        <div className="vol-card-section">
          <span className="vol-card-label">{t('volunteerPortal.skillsRequired')}</span>
          <div className="vol-card-badges">
            {skills.map(skill => (
              <span key={skill} className="vol-card-badge vol-card-badge--skill">{t(`skill.${skill}`, skill)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Language badges */}
      {languages.length > 0 && (
        <div className="vol-card-section">
          <span className="vol-card-label">{t('volunteerPortal.languagesNeeded')}</span>
          <div className="vol-card-badges">
            {languages.map(lang => (
              <span key={lang} className="vol-card-badge vol-card-badge--lang">{t(`lang.${lang}`, lang)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Expandable location details */}
      <div className={`vol-card-expand${expanded ? ' vol-card-expand--open' : ''}`}>
        <div className="vol-card-expand-inner">
          <div className="vol-card-loc-name">📍 {location.name}</div>
          {addr && <div className="vol-card-loc-addr">{addr}</div>}
          {location.hours && <div className="vol-card-loc-hours">🕐 {translateHours(location.hours, t, i18n.language)}</div>}
          {location.phone && <div className="vol-card-loc-hours">📞 {location.phone}</div>}
          {location.website && <div className="vol-card-loc-hours"><a href={location.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4a7c59', textDecoration: 'underline' }}>🔗 {location.website}</a></div>}
          <button className="vol-card-map-btn" onClick={() => navigate(`/volunteer/map?loc=${location.id}`)}>🗺️ {t('ui.showInMap')}</button>
        </div>
      </div>

      <div className="vol-card-footer">
        {location.volunteersNeeded != null && signUpStep === 0 && (
          <span className="vol-card-volunteers">
            👥 {t('volunteerPortal.volunteersNeeded')}: {location.volunteersNeeded}
          </span>
        )}

        {/* Step 0: Sign Up button */}
        {signUpStep === 0 && (
          <button className="vol-card-signup" onClick={() => setSignUpStep(1)}>
            {t('volunteerPortal.signUp')}
          </button>
        )}

        {/* Step 1: Sign Up form */}
        {signUpStep === 1 && (
          <div className="vol-signup-form">
            <div className="vol-signup-title">📋 {t('volunteerPortal.signUpFor')} {mission.title}</div>

            <div className="vol-signup-field">
              <label className="vol-signup-label">👤 {t('volunteerPortal.yourName')}</label>
              <input className="vol-signup-input" type="text" placeholder={t('volunteerPortal.fullName')} value={formData.name} onChange={e => updateField('name', e.target.value)} />
            </div>

            <div className="vol-signup-field">
              <label className="vol-signup-label">📧 {t('volunteerPortal.yourEmail')}</label>
              <input className="vol-signup-input" type="email" placeholder={t('volunteerPortal.emailPlaceholder')} value={formData.email} onChange={e => updateField('email', e.target.value)} />
            </div>

            <div className="vol-signup-field">
              <label className="vol-signup-label">📞 {t('volunteerPortal.yourPhone')}</label>
              <input className="vol-signup-input" type="tel" placeholder={t('volunteerPortal.phonePlaceholder')} value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>

            <div className="vol-signup-field">
              <label className="vol-signup-label">🚗 {t('volunteerPortal.transportation')}</label>
              <div className="vol-signup-options">
                {[['own-car', '🚗', t('volunteerPortal.ownCar')], ['public-transit', '🚌', t('volunteerPortal.publicTransit')], ['need-ride', '🤝', t('volunteerPortal.needRide')]].map(([key, icon, label]) => (
                  <button key={key} className={`vol-signup-opt${formData.transportation === key ? ' vol-signup-opt--active' : ''}`} onClick={() => updateField('transportation', key)}>
                    <span>{icon}</span> <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="vol-signup-field">
              <label className="vol-signup-label">⏰ {t('volunteerPortal.hoursAvailable')}</label>
              <div className="vol-signup-options">
                {[['1-2', t('volunteerPortal.hours1to2')], ['3-4', t('volunteerPortal.hours3to4')], ['5+', t('volunteerPortal.hours5plus')], ['full-day', t('volunteerPortal.fullDay')]].map(([key, label]) => (
                  <button key={key} className={`vol-signup-opt${formData.hours === key ? ' vol-signup-opt--active' : ''}`} onClick={() => updateField('hours', key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="vol-signup-actions">
              <button className="vol-signup-cancel" onClick={() => { setSignUpStep(0); setFormData({ name: '', email: '', phone: '', transportation: '', hours: '' }); }}>
                ← {t('volunteerPortal.cancel')}
              </button>
              <button className="vol-signup-submit" onClick={handleSubmit} disabled={!canSubmit}>
                ✅ {t('volunteerPortal.confirmSignUp')}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirmed */}
        {signUpStep === 2 && (
          <div className="vol-signup-thankyou">
            <span className="vol-signup-thankyou-icon">🎉</span>
            <div className="vol-signup-thankyou-title">{t('volunteerPortal.thankYou')}</div>
            <div className="vol-signup-thankyou-msg">{t('volunteerPortal.thankYouMsg')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissionCard;
