import React, { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import MissionCard from './MissionCard';
import './VolunteerPage.css';
import locations from '../data/locations_final_merged.json';

/* ── Derived data ── */
const locsWithMissions = locations.filter(l => l.missions && l.missions.length > 0);

const urgentMissions = locsWithMissions
  .filter(l => (l.insecurityIndex || 0) >= 4)
  .sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0))
  .flatMap(loc => loc.missions.map(m => ({ mission: m, location: loc })));

const ALL_SKILLS = [...new Set(
  locsWithMissions.flatMap(l => l.missions.flatMap(m => m.skillsRequired || []))
)].sort();

const ALL_LANGUAGES = [...new Set(
  locsWithMissions.flatMap(l => l.missions.flatMap(m => m.languagesNeeded || []))
)].sort();

const Arrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

function VolunteerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const r4 = useRef(null);
  const drag = useDrag();

  return (
    <div className="vol-root">
      <SearchHeader backTo="/portal" activeNav="home" navPrefix="/volunteer" />

      {/* Hero */}
      <section className="vol-hero anim-fade-up">
        <h1 className="vol-title">{t('volunteerPortal.title')}</h1>
        <p className="vol-subtitle">{t('volunteerPortal.subtitle')}</p>
      </section>

      {/* Urgent Missions */}
      <section className="vol-section anim-fade-up anim-d1">
        <div className="vol-section-row">
          <h2 className="vol-section-title">{t('volunteerPortal.urgentMissions')}</h2>
          <button className="vol-section-arrow" onClick={() => navigate('/volunteer/missions?sort=urgency')} aria-label={t('volunteerPortal.urgentMissions')}>
            <Arrow />
          </button>
        </div>
        <div className="vol-hscroll" ref={r1} {...drag(r1)}>
          {urgentMissions.slice(0, 20).map((item, idx) => (
            <MissionCard key={`${item.location.id}-${idx}`} mission={item.mission} location={item.location} />
          ))}
        </div>
      </section>

      {/* Nearby Opportunities */}
      <section className="vol-section anim-fade-up anim-d2">
        <div className="vol-section-row">
          <h2 className="vol-section-title">{t('volunteerPortal.nearbyOpportunities')}</h2>
          <button className="vol-section-arrow" onClick={() => navigate('/volunteer/missions')} aria-label={t('volunteerPortal.nearbyOpportunities')}>
            <Arrow />
          </button>
        </div>
        <div className="vol-hscroll" ref={r2} {...drag(r2)}>
          {locsWithMissions.slice(0, 20).map(loc => (
            <VolLocCard key={loc.id} loc={loc} t={t} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* Browse by Skill */}
      <section className="vol-section anim-fade-up anim-d3">
        <div className="vol-section-row">
          <h2 className="vol-section-title">{t('volunteerPortal.browseBySkill')}</h2>
          <button className="vol-section-arrow" onClick={() => navigate('/volunteer/missions')} aria-label={t('volunteerPortal.browseBySkill')}>
            <Arrow />
          </button>
        </div>
        <div className="vol-hscroll" ref={r3} {...drag(r3)}>
          {ALL_SKILLS.map(skill => (
            <button key={skill} className="vol-green-card" onClick={() => navigate(`/volunteer/skill/${encodeURIComponent(skill)}`)}>
              <span className="vol-green-label">{skill}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Browse by Language */}
      <section className="vol-section anim-fade-up anim-d4">
        <div className="vol-section-row">
          <h2 className="vol-section-title">{t('volunteerPortal.browseByLanguage')}</h2>
          <button className="vol-section-arrow" onClick={() => navigate('/volunteer/missions')} aria-label={t('volunteerPortal.browseByLanguage')}>
            <Arrow />
          </button>
        </div>
        <div className="vol-hscroll" ref={r4} {...drag(r4)}>
          {ALL_LANGUAGES.map(lang => (
            <button key={lang} className="vol-green-card" onClick={() => navigate(`/volunteer/language/${encodeURIComponent(lang)}`)}>
              <span className="vol-green-label">{lang}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Nearby Location Card ── */
function VolLocCard({ loc, t, navigate }) {
  const [expanded, setExpanded] = useState(false);
  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
  const missionCount = (loc.missions || []).length;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;

  return (
    <div className="vol-loc-card">
      <div className="vol-loc-top">
        <div>
          <span className="vol-loc-name">{loc.name}</span>
          <span className="vol-loc-missions">{missionCount} {missionCount === 1 ? 'mission' : 'missions'}</span>
        </div>
        <button className="vol-loc-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
      <div className="vol-loc-meta">
        <span>🕐 {loc.hours || t('ui.contactForHours')}</span>
        <span>📍 {addr}</span>
      </div>

      <div className={`vol-loc-expand${expanded ? ' vol-loc-expand--open' : ''}`}>
        <div className="vol-loc-expand-inner">
          {loc.phone && <div className="vol-loc-detail-row"><span className="vol-loc-detail-label">📞 Phone</span><span className="vol-loc-detail-value">{loc.phone}</span></div>}
          {loc.website && <div className="vol-loc-detail-row"><span className="vol-loc-detail-label">🔗 Website</span><a href={loc.website} target="_blank" rel="noopener noreferrer" className="vol-loc-detail-link">{loc.website}</a></div>}
          {loc.volunteersNeeded != null && <div className="vol-loc-detail-row"><span className="vol-loc-detail-label">👥 {t('volunteerPortal.volunteersNeeded')}</span><span className="vol-loc-detail-value">{loc.volunteersNeeded}</span></div>}
        </div>
      </div>

      <div className="vol-loc-footer">
        <div className="vol-loc-bottom">
          <div className="vol-loc-tags">
            {(loc.missions || []).slice(0, 3).map((m, i) => (
              <span key={i} className="vol-loc-tag">{m.title}</span>
            ))}
          </div>
          <a className="vol-loc-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
        </div>
      </div>
    </div>
  );
}

/* ── useDrag hook for horizontal scroll (matching DonorPage pattern) ── */
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

export default VolunteerPage;
