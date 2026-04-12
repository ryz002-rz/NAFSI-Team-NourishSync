import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DIETARY_FILTERS } from '../../utils/filterUtils';
import { getPreferences, savePreferences } from '../../utils/preferences';

const RADIUS_OPTIONS = [
  { value: 1, label: '1 mi' },
  { value: 5, label: '5 mi' },
  { value: 10, label: '10 mi' },
  { value: 25, label: '25 mi' },
];

/**
 * FilterEngine — renders dietary filter toggles, AND/OR mode toggle,
 * distance radius dropdown, and a search input.
 * Persists filter state to localStorage.
 *
 * Props:
 *   activeTags: string[]           — currently active dietary filter keys
 *   onToggleTag: (key) => void     — called when a dietary tag is toggled
 *   searchQuery: string            — current search text
 *   onSearchChange: (text) => void — called when search input changes
 *   filterMode: 'AND'|'OR'        — current filter logic mode
 *   onFilterModeChange: (mode) => void
 *   radiusMiles: number|null       — current radius filter (null = disabled)
 *   onRadiusChange: (radius) => void
 *   hasUserLocation: boolean       — whether user geolocation is available
 */
function FilterEngine({
  activeTags = [],
  onToggleTag,
  searchQuery = '',
  onSearchChange,
  filterMode = 'AND',
  onFilterModeChange,
  radiusMiles = null,
  onRadiusChange,
  hasUserLocation = false,
}) {
  const { t } = useTranslation();

  // Restore persisted filters on mount
  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.dietary_tags && prefs.dietary_tags.length > 0 && activeTags.length === 0) {
      prefs.dietary_tags.forEach((tag) => onToggleTag(tag));
    }
    if (prefs.search_query && !searchQuery) {
      onSearchChange(prefs.search_query);
    }
    if (prefs.filter_mode && onFilterModeChange) {
      onFilterModeChange(prefs.filter_mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist filters when they change
  useEffect(() => {
    savePreferences({
      dietary_tags: activeTags,
      search_query: searchQuery,
      filter_mode: filterMode,
    });
  }, [activeTags, searchQuery, filterMode]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('common.search')}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white"
          aria-label={t('common.search')}
        />
      </div>

      {/* Filter controls row: AND/OR toggle + distance dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        {/* AND / OR mode toggle */}
        {onFilterModeChange && (
          <div className="inline-flex rounded-lg border border-neutral-200 overflow-hidden text-sm" role="radiogroup" aria-label="Filter mode">
            {['AND', 'OR'].map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={filterMode === mode}
                onClick={() => onFilterModeChange(mode)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  filterMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}

        {/* Distance radius dropdown */}
        {hasUserLocation && onRadiusChange && (
          <select
            value={radiusMiles || ''}
            onChange={(e) => onRadiusChange(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-1.5 text-sm rounded-lg border border-neutral-200 bg-white text-neutral-600 focus:outline-none focus:border-primary-400"
            aria-label="Filter by distance"
          >
            <option value="">Any distance</option>
            {RADIUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Within {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dietary filter toggles */}
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('common.filter')}>
        {DIETARY_FILTERS.map((filter) => {
          const isActive = activeTags.includes(filter.key);
          return (
            <button
              key={filter.key}
              onClick={() => onToggleTag(filter.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                isActive
                  ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300 hover:text-primary-600'
              }`}
              aria-pressed={isActive}
            >
              <span aria-hidden="true">{filter.emoji}</span>
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterEngine;
