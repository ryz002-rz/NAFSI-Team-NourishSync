import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './VolunteerFilterBar.css';

const SORT_OPTIONS = ['urgency', 'name'];

/**
 * Collapsible filter/sort panel with skill pills, language pills,
 * and sort options (urgency, name).
 *
 * @param {Object} props
 * @param {string[]} props.allSkills - All unique skill values
 * @param {string[]} props.allLanguages - All unique language values
 * @param {Function} props.onFilter - Callback with {skills: Set, languages: Set, sort: string}
 * @param {number} props.totalCount - Total mission count before filtering
 * @param {number} props.filteredCount - Mission count after filtering
 */
function VolunteerFilterBar({ allSkills, allLanguages, onFilter, totalCount, filteredCount }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [selectedLanguages, setSelectedLanguages] = useState(new Set());
  const [sort, setSort] = useState('urgency');

  const toggleSkill = (skill) => {
    const next = new Set(selectedSkills);
    next.has(skill) ? next.delete(skill) : next.add(skill);
    setSelectedSkills(next);
    onFilter({ skills: next, languages: selectedLanguages, sort });
  };

  const toggleLanguage = (lang) => {
    const next = new Set(selectedLanguages);
    next.has(lang) ? next.delete(lang) : next.add(lang);
    setSelectedLanguages(next);
    onFilter({ skills: selectedSkills, languages: next, sort });
  };

  const changeSort = (s) => {
    setSort(s);
    onFilter({ skills: selectedSkills, languages: selectedLanguages, sort: s });
  };

  const clearAll = () => {
    setSelectedSkills(new Set());
    setSelectedLanguages(new Set());
    setSort('urgency');
    onFilter({ skills: new Set(), languages: new Set(), sort: 'urgency' });
  };

  const activeCount = selectedSkills.size + selectedLanguages.size;
  const hasFilters = activeCount > 0;

  return (
    <div className="vol-fb-wrap">
      <div className="vol-fb-header">
        <button className="vol-fb-toggle" onClick={() => setOpen(!open)}>
          <span className="vol-fb-toggle-text">
            🔍 {t('volunteerPortal.filterAndSort')}
            {hasFilters && <span className="vol-fb-badge">{activeCount}</span>}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {hasFilters && (
          <span className="vol-fb-active-text">
            {t('volunteerPortal.showingOf', { filtered: filteredCount, total: totalCount })}
          </span>
        )}
      </div>

      <div className={`vol-fb-body${open ? ' vol-fb-body--open' : ''}`}>
        <div className="vol-fb-body-inner">
          {/* Sort */}
          <div className="vol-fb-section">
            <label className="vol-fb-label">{t('volunteerPortal.sortByUrgency').replace(' by Urgency', '')}</label>
            <div className="vol-fb-pills">
              <button className={`vol-fb-pill${sort === 'urgency' ? ' vol-fb-pill--active' : ''}`} onClick={() => changeSort('urgency')}>
                {t('volunteerPortal.sortByUrgency')}
              </button>
              <button className={`vol-fb-pill${sort === 'name' ? ' vol-fb-pill--active' : ''}`} onClick={() => changeSort('name')}>
                {t('volunteerPortal.sortByName')}
              </button>
            </div>
          </div>

          {/* Skills */}
          {allSkills && allSkills.length > 0 && (
            <div className="vol-fb-section">
              <label className="vol-fb-label">{t('volunteerPortal.filterBySkill')}</label>
              <div className="vol-fb-pills">
                {allSkills.map(skill => (
                  <button key={skill} className={`vol-fb-pill${selectedSkills.has(skill) ? ' vol-fb-pill--active' : ''}`} onClick={() => toggleSkill(skill)}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {allLanguages && allLanguages.length > 0 && (
            <div className="vol-fb-section">
              <label className="vol-fb-label">{t('volunteerPortal.filterByLanguage')}</label>
              <div className="vol-fb-pills">
                {allLanguages.map(lang => (
                  <button key={lang} className={`vol-fb-pill${selectedLanguages.has(lang) ? ' vol-fb-pill--active' : ''}`} onClick={() => toggleLanguage(lang)}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasFilters && (
            <button className="vol-fb-clear" onClick={clearAll}>
              {t('volunteerPortal.clearAllFilters')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolunteerFilterBar;
