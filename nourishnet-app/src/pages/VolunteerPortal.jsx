import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import locations from '../data/locations_final_merged.json';
import { filterBySearch } from '../utils/filterUtils';
import LocationCard from '../components/shared/LocationCard';
import MapView from '../components/ryan/MapView';

function VolunteerPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Collect all unique skills and languages from missions
  const { allSkills, allLanguages } = useMemo(() => {
    const skills = new Set();
    const languages = new Set();
    locations.forEach((loc) => {
      if (loc.missions && loc.missions.length > 0) {
        loc.missions.forEach((m) => {
          (m.skillsRequired || []).forEach((s) => skills.add(s));
          (m.languagesNeeded || []).forEach((l) => languages.add(l));
        });
      }
    });
    return {
      allSkills: [...skills].sort(),
      allLanguages: [...languages].sort(),
    };
  }, []);

  const filtered = useMemo(() => {
    let result = filterBySearch(locations, searchQuery);

    // Filter by skill
    if (selectedSkill) {
      result = result.filter((loc) =>
        loc.missions && loc.missions.some((m) =>
          (m.skillsRequired || []).includes(selectedSkill)
        )
      );
    }

    // Filter by language
    if (selectedLanguage) {
      result = result.filter((loc) =>
        loc.missions && loc.missions.some((m) =>
          (m.languagesNeeded || []).includes(selectedLanguage)
        )
      );
    }

    return result;
  }, [searchQuery, selectedSkill, selectedLanguage]);

  // Locations that have missions
  const locationsWithMissions = filtered.filter(
    (loc) => loc.missions && loc.missions.length > 0
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-800 mb-1">
          {t('portal.volunteer.title')}
        </h1>
        <p className="text-neutral-500 text-sm">
          {t('portal.volunteer.placeholder')}
        </p>
      </div>

      {/* Search + Skill/Language filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white"
            aria-label={t('common.search')}
          />
        </div>

        <div className="flex gap-3">
          {allSkills.length > 0 && (
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-primary-400"
              aria-label={t('volunteer.skills')}
            >
              <option value="">{t('volunteer.skills')}</option>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          )}
          {allLanguages.length > 0 && (
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-primary-400"
              aria-label={t('volunteer.languages')}
            >
              <option value="">{t('volunteer.languages')}</option>
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results count + map toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-500">
          {locationsWithMissions.length} {t('volunteer.missions')}
        </p>
        <button
          onClick={() => setShowMap((v) => !v)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showMap ? t('map.hide') : t('map.show')}
        </button>
      </div>

      {/* Map */}
      {showMap && (
        <div className="mb-6 rounded-2xl overflow-hidden border border-neutral-200" style={{ height: '350px' }}>
          <MapView locations={filtered} />
        </div>
      )}

      {/* Mission cards */}
      {locationsWithMissions.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {locationsWithMissions.map((loc) => (
            <div key={loc.id} className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-4">
              <LocationCard location={loc} />

              {/* Mission cards */}
              <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3">
                {loc.missions.map((mission, i) => (
                  <div key={i} className="bg-primary-50 rounded-xl p-3 border border-primary-100">
                    <h3 className="text-sm font-semibold text-primary-800">{mission.title}</h3>
                    {mission.description && (
                      <p className="text-xs text-neutral-600 mt-1">{mission.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mission.date && (
                        <span className="text-xs text-neutral-500">
                          📅 {t('volunteer.date')}: {mission.date}
                        </span>
                      )}
                    </div>
                    {mission.skillsRequired && mission.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-neutral-500">{t('volunteer.skills')}:</span>
                        {mission.skillsRequired.map((skill, j) => (
                          <span key={j} className="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {mission.languagesNeeded && mission.languagesNeeded.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-neutral-500">{t('volunteer.languages')}:</span>
                        {mission.languagesNeeded.map((lang, j) => (
                          <span key={j} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loc.volunteersNeeded && (
                  <p className="text-xs text-neutral-500">
                    {t('volunteer.volunteersNeeded')}: {loc.volunteersNeeded}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VolunteerPortal;
