import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import VolunteerFilterBar from './VolunteerFilterBar';
import MissionCard from './MissionCard';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

const locsWithMissions = locations.filter(l => l.missions && l.missions.length > 0);
const ALL_SKILLS = [...new Set(locsWithMissions.flatMap(l => l.missions.flatMap(m => m.skillsRequired || [])))].sort();
const ALL_LANGUAGES = [...new Set(locsWithMissions.flatMap(l => l.missions.flatMap(m => m.languagesNeeded || [])))].sort();

function VolunteerSkillDetailPage() {
  const { t } = useTranslation();
  const { skillName } = useParams();
  const decoded = decodeURIComponent(skillName);
  const [filters, setFilters] = useState({ skills: new Set(), languages: new Set(), sort: 'urgency' });
  const [searchQuery, setSearchQuery] = useState('');

  const baseMissions = useMemo(() => {
    const result = [];
    locsWithMissions.forEach(loc => {
      if (!loc.missions) return;
      loc.missions.forEach(m => {
        if ((m.skillsRequired || []).some(s => s.toLowerCase() === decoded.toLowerCase())) {
          result.push({ mission: m, location: loc, urgencyLevel: loc.insecurityIndex || 0 });
        }
      });
    });
    return result;
  }, [decoded]);

  const filtered = useMemo(() => {
    let result = [...baseMissions];
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
  }, [baseMissions, filters, searchQuery]);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/volunteer/skills" activeNav="home" navPrefix="/volunteer" onSearch={setSearchQuery} />
      <h1 className="fd-title">{decoded}</h1>
      <p className="fd-count">{filtered.length} of {baseMissions.length} {t('results.missions')}</p>
      <VolunteerFilterBar allSkills={ALL_SKILLS} allLanguages={ALL_LANGUAGES} onFilter={setFilters} totalCount={baseMissions.length} filteredCount={filtered.length} />
      <div className="fd-list">
        {filtered.map((item, idx) => (
          <MissionCard key={`${item.location.id}-${idx}`} mission={item.mission} location={item.location} />
        ))}
        {filtered.length === 0 && <p className="fd-empty">{t('common.noResults')}</p>}
      </div>
    </div>
  );
}

export default VolunteerSkillDetailPage;
