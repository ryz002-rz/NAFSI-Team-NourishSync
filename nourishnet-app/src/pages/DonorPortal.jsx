import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import locations from '../data/locations_final_merged.json';
import { filterBySearch } from '../utils/filterUtils';
import ImpactCalculator from '../components/joe/ImpactCalculator';
import LocationCard from '../components/shared/LocationCard';

function DonorPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByNeed, setSortByNeed] = useState(false);

  const filtered = useMemo(() => {
    let result = filterBySearch(locations, searchQuery);
    if (sortByNeed) {
      result = [...result].sort(
        (a, b) => (b.insecurityIndex || 0) - (a.insecurityIndex || 0)
      );
    }
    return result;
  }, [searchQuery, sortByNeed]);

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

      {/* Search + Sort */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1 relative">
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
        <button
          onClick={() => setSortByNeed((v) => !v)}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
            sortByNeed
              ? 'bg-warm-600 text-white'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          {t('donor.sortByNeed')}
        </button>
      </div>

      {/* Results */}
      <p className="text-sm text-neutral-500 mb-4">
        {filtered.length} {filtered.length === 1 ? t('results.countSingular') : t('results.count')}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((loc) => (
            <div key={loc.id} className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-4">
              <LocationCard location={loc} />

              {/* Donor-specific info */}
              <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                {/* Wishlist tags */}
                {loc.wishlist && loc.wishlist.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {t('donor.wishlist')}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {loc.wishlist.map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-warm-50 text-warm-700 border border-warm-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accepts Perishable badge */}
                {loc.acceptsPerishable === true && (
                  <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                    ✅ {t('donor.acceptsPerishable')}
                  </span>
                )}

                {/* Drop-off hours */}
                {loc.dropOffHours && loc.dropOffHours.trim() !== '' && (
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium">{t('donor.dropOffHours')}:</span>{' '}
                    {loc.dropOffHours}
                  </p>
                )}

                {/* High need indicator */}
                {loc.insecurityIndex && loc.insecurityIndex >= 7 && (
                  <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
                    🔴 {t('donor.highNeed')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonorPortal;
