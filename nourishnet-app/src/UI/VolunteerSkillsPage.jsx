import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './FoodTypesPage.css';
import locations from '../data/locations_final_merged.json';

const ALL_SKILLS = [...new Set(
  locations.filter(l => l.missions && l.missions.length > 0)
    .flatMap(l => l.missions.flatMap(m => m.skillsRequired || []))
)].sort();

function VolunteerSkillsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="ft-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" />
      <h1 className="ft-title">{t('volunteerPortal.browseBySkill')}</h1>
      <div className="ft-grid">
        {ALL_SKILLS.map(skill => (
          <button key={skill} className="ft-card" onClick={() => navigate(`/volunteer/skill/${encodeURIComponent(skill)}`)}>
            <span className="ft-card-label">{t(`skill.${skill}`, skill)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default VolunteerSkillsPage;
