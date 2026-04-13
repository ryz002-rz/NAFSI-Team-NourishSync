import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchHeader from './SearchHeader';
import MissionCard from './MissionCard';
import './FoodDetailPage.css';
import locations from '../data/locations_final_merged.json';

const locsWithMissions = locations.filter(l => l.missions && l.missions.length > 0);

function VolunteerSearchResultsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  /* Group results by location, each with matching missions */
  const grouped = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results = [];

    locsWithMissions.forEach(loc => {
      const locNameMatch = (loc.name || '').toLowerCase().includes(q);
      const matchingMissions = (loc.missions || []).filter(m =>
        locNameMatch ||
        (m.title || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q) ||
        (m.skillsRequired || []).some(s => s.toLowerCase().includes(q)) ||
        (m.languagesNeeded || []).some(l => l.toLowerCase().includes(q))
      );
      if (matchingMissions.length > 0) {
        results.push({ location: loc, missions: matchingMissions });
      }
    });

    results.sort((a, b) => (b.location.insecurityIndex || 0) - (a.location.insecurityIndex || 0));
    return results;
  }, [query]);

  const totalMissions = grouped.reduce((sum, g) => sum + g.missions.length, 0);

  return (
    <div className="fd-root">
      <SearchHeader backTo="/volunteer" activeNav="home" navPrefix="/volunteer" onSearch={setQuery} initialQuery={initialQuery} />
      <h1 className="fd-title">{t('ui.search')}: "{query}"</h1>
      <p className="fd-count">{grouped.length} {grouped.length === 1 ? t('results.organizationSingular') : t('results.organizations')}, {totalMissions} {totalMissions === 1 ? t('results.missionSingular') : t('results.missions')}</p>
      <div className="fd-list">
        {grouped.map(({ location: loc, missions }) => (
          <div key={loc.id} style={{ display: 'contents' }}>
            {missions.map((m, idx) => (
              <MissionCard key={`${loc.id}-${idx}`} mission={m} location={loc} />
            ))}
          </div>
        ))}
        {query.trim() && grouped.length === 0 && <p className="fd-empty">{t('common.noResults')}</p>}
      </div>
    </div>
  );
}

export default VolunteerSearchResultsPage;
