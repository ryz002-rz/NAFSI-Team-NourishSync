import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import VolunteerFilterBar from './VolunteerFilterBar';
import { getUrgencyLevel } from './MissionCard';
import { translateHours } from '../utils/translateHours';
import { translateMissionTitle } from '../utils/missionI18n';
import './NearbyPage.css';
import locations from '../data/locations_final_merged.json';

const locsWithMissions = locations.filter(l => l.missions && l.missions.length > 0);
const ALL_SKILLS = [...new Set(locsWithMissions.flatMap(l => l.missions.flatMap(m => m.skillsRequired || [])))].sort();
const ALL_LANGUAGES = [...new Set(locsWithMissions.flatMap(l => l.missions.flatMap(m => m.languagesNeeded || [])))].sort();

function VolunteerNearbyPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({ skills: new Set(), languages: new Set(), sort: 'urgency' });
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = [...locsWithMissions];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(loc =>
        (loc.name || '').toLowerCase().includes(q) || (loc.address?.city || '').toLowerCase().includes(q) ||
        (loc.missions || []).some(m => (m.title || '').toLowerCase().includes(q) || (m.skillsRequired || []).some(s => s.toLowerCase().includes(q)) || (m.languagesNeeded || []).some(l => l.toLowerCase().includes(q)))
      );
    }
    if (filters.skills.size > 0) result = result.filter(loc => (loc.missions || []).some(m => (m.skillsRequired || []).some(s => filters.skills.has(s))));
    if (filters.languages.size > 0) result = result.filter(loc => (loc.missions || []).some(m => (m.languagesNeeded || []).some(l => filters.languages.has(l))));
    if (filters.sort === 'name') result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else result.sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0));
    return result;
  }, [filters, searchQuery]);

  return (
    <div className="nb-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" onSearch={setSearchQuery} />
      <h1 className="nb-title">{t('volunteerPortal.nearbyOpportunities')}</h1>
      <p className="nb-count">{t('volunteerPortal.ofTotal', { count: filtered.length, total: locsWithMissions.length })} {t('ui.locations')}</p>
      <div style={{ padding: '0 40px 8px' }}>
        <VolunteerFilterBar allSkills={ALL_SKILLS} allLanguages={ALL_LANGUAGES} onFilter={setFilters} totalCount={locsWithMissions.length} filteredCount={filtered.length} />
      </div>
      <div className="nb-list">
        {filtered.map(loc => (<VolNbCard key={loc.id} loc={loc} t={t} navigate={navigate} />))}
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#4a7c59', opacity: 0.5, padding: 40 }}>{t('common.noResults')}</p>}
      </div>
    </div>
  );
}

function VolNbCard({ loc, t, navigate }) {
  const { i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const addr = [loc.address?.street, loc.address?.city, loc.address?.state, loc.address?.zip].filter(Boolean).join(', ');
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
  const missionCount = (loc.missions || []).length;
  const urgency = getUrgencyLevel(loc.insecurityIndex || 0);

  return (
    <div className="nb-card">
      <div className="nb-card-top">
        <div>
          <span className="nb-card-name">{loc.name}</span>
          <span className="nb-card-partner">{missionCount} {missionCount === 1 ? t('volunteerPortal.mission') : t('volunteerPortal.missionPlural')}</span>
          {loc.insecurityIndex >= 4 && (
            <span style={{ fontSize: 11, color: urgency.color, fontWeight: 600, display: 'block' }}>
              {urgency.emoji} {t(`volunteerPortal.${urgency.label}`)}
            </span>
          )}
        </div>
        <button className="nb-card-details" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('ui.hideDetails') : t('ui.showDetails')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', marginLeft: '4px' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
      <div className="nb-card-meta">
        <span>🕐 {translateHours(loc.hours, t, i18n.language) || t('ui.contactForHours')}</span>
        <span>📍 {addr}</span>
      </div>
      <div className={`nb-card-expand${expanded ? ' nb-card-expand--open' : ''}`}>
        <div className="nb-card-expand-inner">
          {loc.website && (<div className="nb-card-detail-row"><span className="nb-card-detail-label">🔗 {t('volunteerPortal.website')}</span><a href={loc.website} target="_blank" rel="noopener noreferrer" className="nb-card-detail-link">{loc.website}</a></div>)}
          {loc.phone && (<div className="nb-card-detail-row"><span className="nb-card-detail-label">📞 {t('volunteerPortal.phone')}</span><span className="nb-card-detail-value">{loc.phone}</span></div>)}
          {loc.volunteersNeeded != null && (<div className="nb-card-detail-row"><span className="nb-card-detail-label">👥 {t('volunteerPortal.volunteersNeeded')}</span><span className="nb-card-detail-value">{loc.volunteersNeeded}</span></div>)}
          <button className="nb-card-map-btn" onClick={() => navigate(`/volunteer/map?loc=${loc.id}`)}>🗺️ {t('ui.showInMap')}</button>
        </div>
      </div>
      <div className="nb-card-bottom">
        <div className="nb-card-tags">
          {(loc.missions || []).slice(0, 3).map((m, i) => (<span key={i} className="nb-card-tag">{translateMissionTitle(m.title, t)}</span>))}
        </div>
        <a className="nb-card-dir" href={dirUrl} target="_blank" rel="noopener noreferrer">{t('ui.getDirections')}</a>
      </div>
    </div>
  );
}

export default VolunteerNearbyPage;
