import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import locations from '../data/locations_expanded.json';
import { filterBySearch } from '../utils/filterUtils';
import ImpactCalculator from '../components/joe/ImpactCalculator';
import LocationCard from '../components/shared/LocationCard';

function DonorPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Show all locations as potential donation targets
  const filtered = filterBySearch(locations, searchQuery);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-700 mb-1">
          {t('portal.donor.title')}
        </h1>
        <p className="text-neutral-500 text-sm">
          {t('portal.donor.placeholder')}
        </p>
      </div>

      {/* Impact Calculator */}
      <div className="mb-6">
        <ImpactCalculator />
      </div>

      {/* Search */}
      <div className="mb-6 relative">
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
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-100 bg-white"
          aria-label={t('common.search')}
        />
      </div>

      {/* Results */}
      <p className="text-sm text-neutral-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'organization' : 'organizations'}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DonorPortal;
