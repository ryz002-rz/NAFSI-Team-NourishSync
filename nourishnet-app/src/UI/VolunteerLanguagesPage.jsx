import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import './FoodTypesPage.css';
import locations from '../data/locations_final_merged.json';

const ALL_LANGUAGES = [...new Set(
  locations.filter(l => l.missions && l.missions.length > 0)
    .flatMap(l => l.missions.flatMap(m => m.languagesNeeded || []))
)].sort();

function VolunteerLanguagesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="ft-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" />
      <h1 className="ft-title">{t('volunteerPortal.browseByLanguage')}</h1>
      <div className="ft-grid">
        {ALL_LANGUAGES.map(lang => (
          <button key={lang} className="ft-card" onClick={() => navigate(`/volunteer/language/${encodeURIComponent(lang)}`)}>
            <span className="ft-card-label">{t(`lang.${lang}`, lang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default VolunteerLanguagesPage;
