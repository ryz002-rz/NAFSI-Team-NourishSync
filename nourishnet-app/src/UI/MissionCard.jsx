import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!mission || !location) return null;

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
              <span key={skill} className="vol-card-badge vol-card-badge--skill">{skill}</span>
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
              <span key={lang} className="vol-card-badge vol-card-badge--lang">{lang}</span>
            ))}
          </div>
        </div>
      )}

      {/* Expandable location details */}
      <div className={`vol-card-expand${expanded ? ' vol-card-expand--open' : ''}`}>
        <div className="vol-card-expand-inner">
          <div className="vol-card-loc-name">📍 {location.name}</div>
          {addr && <div className="vol-card-loc-addr">{addr}</div>}
          {location.hours && <div className="vol-card-loc-hours">🕐 {location.hours}</div>}
        </div>
      </div>

      <div className="vol-card-footer">
        {location.volunteersNeeded != null && (
          <span className="vol-card-volunteers">
            👥 {t('volunteerPortal.volunteersNeeded')}: {location.volunteersNeeded}
          </span>
        )}
        <button className="vol-card-signup" onClick={() => onSignUp && onSignUp(mission, location)}>
          {t('volunteerPortal.signUp')}
        </button>
      </div>
    </div>
  );
}

export default MissionCard;
