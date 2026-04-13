import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import MissionCard from './MissionCard';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

function VolunteerSkillDetailPage() {
  const { t } = useTranslation();
  const { skillName } = useParams();
  const decoded = decodeURIComponent(skillName);

  const missions = useMemo(() => {
    const result = [];
    locations.forEach(loc => {
      if (!loc.missions) return;
      loc.missions.forEach(m => {
        if ((m.skillsRequired || []).some(s => s.toLowerCase() === decoded.toLowerCase())) {
          result.push({ mission: m, location: loc, urgencyLevel: loc.insecurityIndex || 0 });
        }
      });
    });
    result.sort((a, b) => b.urgencyLevel - a.urgencyLevel);
    return result;
  }, [decoded]);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" />
      <h1 className="fd-title">{decoded}</h1>
      <p className="fd-count">{missions.length} {missions.length === 1 ? t('results.missionSingular') : t('results.missions')}</p>
      <div className="fd-list">
        {missions.map((item, idx) => (
          <MissionCard key={`${item.location.id}-${idx}`} mission={item.mission} location={item.location} />
        ))}
        {missions.length === 0 && <p className="fd-empty">{t('common.noResults')}</p>}
      </div>
    </div>
  );
}

export default VolunteerSkillDetailPage;
