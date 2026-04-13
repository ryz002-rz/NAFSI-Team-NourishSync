import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import locations from '../data/locations_final_merged.json';
import { applyFilters } from '../utils/filterUtils';
import FilterEngine from '../components/joe/FilterEngine';
import VoiceSearch from '../components/joe/VoiceSearch';
import LocationCard from '../components/shared/LocationCard';
import MapView from '../components/ryan/MapView';

function FamilyPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [filterMode, setFilterMode] = useState('AND');
  const [radiusMiles, setRadiusMiles] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const customerLocations = locations.filter(
    (loc) => loc.type === 'customer' || !loc.type
  );

  const filtered = applyFilters(customerLocations, {
    search: searchQuery,
    dietaryTags: activeTags,
    filterMode,
    origin: userLocation,
    radiusMiles,
  });

  const handleToggleTag = useCallback((key) => {
    setActiveTags((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  }, []);

  const handleVoiceResult = useCallback(({ filters, searchText }) => {
    if (filters.length > 0) {
      setActiveTags((prev) => {
        const merged = [...new Set([...prev, ...filters])];
        return merged;
      });
    }
    if (searchText) {
      setSearchQuery(searchText);
    }
  }, []);

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setRadiusMiles(10);
        setGeoLoading(false);
      },
      () => {
        setGeoLoading(false);
      }
    );
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-700 mb-1">
          {t('portal.family.title')}
        </h1>
        <p className="text-neutral-500 text-sm">
          {t('portal.family.placeholder')}
        </p>
      </div>

      {/* Filters + Voice + Near Me */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex-1">
          <FilterEngine
            activeTags={activeTags}
            onToggleTag={handleToggleTag}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterMode={filterMode}
            onFilterModeChange={setFilterMode}
            radiusMiles={radiusMiles}
            onRadiusChange={setRadiusMiles}
            hasUserLocation={!!userLocation}
          />
        </div>
        <VoiceSearch onResult={handleVoiceResult} />
        <button
          onClick={handleNearMe}
          disabled={geoLoading}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {geoLoading ? t('common.loading') : t('common.nearMe')}
        </button>
      </div>

      {/* Results count + map toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-500">
          {filtered.length} {filtered.length === 1 ? t('results.countSingular') : t('results.count')}
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
        <div className="mb-6 rounded-2xl overflow-hidden border border-neutral-200" style={{ height: '400px' }}>
          <MapView locations={filtered} />
        </div>
      )}

      {/* Location list */}
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

export default FamilyPortal;
