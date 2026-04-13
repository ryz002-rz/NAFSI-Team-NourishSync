import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import VolunteerFilterBar from './VolunteerFilterBar';
import MissionCard from './MissionCard';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

const urgentLocs = locations.filter(l => l.missions && l.missions.length > 0 && (l.insecurityIndex || 0) >= 4);

const allFlat = urgentLocs
  .sort((a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0))
  .flatMap(loc => loc.missions.map(m => ({ mission: m, location: loc, urgencyLevel: loc.insecurityIndex || 0 })));

const ALL_SKILLS = [...new Set(allFlat.flatMap(f => f.mission.skillsRequired || []))].sort();
const ALL_LANGUAGES = [...new Set(allFlat.flatMap(f => f.mission.languagesNeeded || []))].sort();

function VolunteerUrgentPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ skills: new Set(), languages: new Set(), sort: 'urgency' });
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = [...allFlat];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(({ mission: m, location: loc }) =>
        (loc.name || '').toLowerCase().includes(q) || (m.title || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) || (m.skillsRequired || []).some(s => s.toLowerCase().includes(q)) ||
        (m.languagesNeeded || []).some(l => l.toLowerCase().includes(q))
      );
    }
    if (filters.skills.size > 0) result = result.filter(({ mission: m }) => (m.skillsRequired || []).some(s => filters.skills.has(s)));
    if (filters.languages.size > 0) result = result.filter(({ mission: m }) => (m.languagesNeeded || []).some(l => filters.languages.has(l)));
    if (filters.sort === 'name') result.sort((a, b) => (a.location.name || '').localeCompare(b.location.name || ''));
    else result.sort((a, b) => b.urgencyLevel - a.urgencyLevel);
    return result;
  }, [filters, searchQuery]);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" onSearch={setSearchQuery} />
      <h1 className="fd-title">{t('volunteerPortal.urgentMissions')}</h1>
      <p className="fd-count">{filtered.length} of {allFlat.length} {t('results.missions')}</p>
      <VolunteerFilterBar allSkills={ALL_SKILLS} allLanguages={ALL_LANGUAGES} onFilter={setFilters} totalCount={allFlat.length} filteredCount={filtered.length} />
      <div className="fd-list">
        {filtered.map((item, idx) => (
          <MissionCard key={`${item.location.id}-${idx}`} mission={item.mission} location={item.location} />
        ))}
        {filtered.length === 0 && <p className="fd-empty">{t('common.noResults')}</p>}
      </div>
    </div>
  );
}

export default VolunteerUrgentPage;
