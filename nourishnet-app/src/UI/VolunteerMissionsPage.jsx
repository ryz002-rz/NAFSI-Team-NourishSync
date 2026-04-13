import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import VolunteerFilterBar from './VolunteerFilterBar';
import MissionCard from './MissionCard';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

const locsWithMissions = locations.filter(l => l.missions && l.missions.length > 0);

const ALL_SKILLS = [...new Set(
  locsWithMissions.flatMap(l => l.missions.flatMap(m => m.skillsRequired || []))
)].sort();

const ALL_LANGUAGES = [...new Set(
  locsWithMissions.flatMap(l => l.missions.flatMap(m => m.languagesNeeded || []))
)].sort();

/* Flatten all missions into FlatMission array */
const allFlatMissions = locsWithMissions.flatMap(loc =>
  loc.missions.map(m => ({ mission: m, location: loc, urgencyLevel: loc.insecurityIndex || 0 }))
);

function VolunteerMissionsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ skills: new Set(), languages: new Set(), sort: 'urgency' });
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = [...allFlatMissions];

    /* Text search */
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(({ mission: m, location: loc }) =>
        (loc.name || '').toLowerCase().includes(q) ||
        (m.title || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        (m.skillsRequired || []).some(s => s.toLowerCase().includes(q)) ||
        (m.languagesNeeded || []).some(l => l.toLowerCase().includes(q))
      );
    }

    /* Skill filter (OR within skills) */
    if (filters.skills.size > 0) {
      result = result.filter(({ mission: m }) =>
        (m.skillsRequired || []).some(s => filters.skills.has(s))
      );
    }

    /* Language filter (OR within languages) */
    if (filters.languages.size > 0) {
      result = result.filter(({ mission: m }) =>
        (m.languagesNeeded || []).some(l => filters.languages.has(l))
      );
    }

    /* Sort */
    if (filters.sort === 'name') {
      result.sort((a, b) => (a.location.name || '').localeCompare(b.location.name || ''));
    } else {
      result.sort((a, b) => b.urgencyLevel - a.urgencyLevel);
    }

    return result;
  }, [filters, searchQuery]);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" onSearch={setSearchQuery} />
      <h1 className="fd-title">{t('volunteerPortal.allMissions')}</h1>
      <p className="fd-count">{filtered.length} of {allFlatMissions.length} {t('results.missions')}</p>
      <div style={{ padding: '0 40px 8px' }}>
        <VolunteerFilterBar
          allSkills={ALL_SKILLS}
          allLanguages={ALL_LANGUAGES}
          onFilter={setFilters}
          totalCount={allFlatMissions.length}
          filteredCount={filtered.length}
        />
      </div>
      <div className="fd-list">
        {filtered.map((item, idx) => (
          <MissionCard key={`${item.location.id}-${idx}`} mission={item.mission} location={item.location} />
        ))}
        {filtered.length === 0 && <p className="fd-empty">{t('common.noResults')}</p>}
      </div>
    </div>
  );
}

export default VolunteerMissionsPage;
