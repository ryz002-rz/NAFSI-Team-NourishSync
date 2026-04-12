import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceSearch from '../components/joe/VoiceSearch';
import { searchLocations, sortByRelevance } from '../utils/searchUtils';
import locationsData from '../data/locations_sample.json';

/**
 * FamilyPortal Page
 * 
 * Pipeline Role: Main search interface for finding food resources
 * Flow: User enters search (text/voice) → searchUtils processes → display filtered results
 */

// Location Card Component
function LocationCard({ location }) {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900">{location.name}</h3>
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${location.demand_level === 'High' ? 'bg-red-100 text-red-700' : ''}
          ${location.demand_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' : ''}
          ${location.demand_level === 'Low' ? 'bg-green-100 text-green-700' : ''}
        `}>
          {location.demand_level} Demand
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{location.description}</p>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <span>📍</span>
          <span>{location.address}, {location.city}, {location.state}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500">
          <span>🕐</span>
          <span>{location.hours}</span>
        </div>
        
        {location.phone && (
          <div className="flex items-center gap-2 text-gray-500">
            <span>📞</span>
            <a href={`tel:${location.phone}`} className="hover:text-primary-600">
              {location.phone}
            </a>
          </div>
        )}
      </div>

      {/* Dietary Tags */}
      {location.dietary_tags && location.dietary_tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {location.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Requirements */}
      {location.requirements && (
        <p className="mt-3 text-xs text-muted">
          ⚠️ {location.requirements}
        </p>
      )}
    </div>
  );
}

function FamilyPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort locations based on search
  const filteredLocations = useMemo(() => {
    const searched = searchLocations(locationsData, searchQuery);
    return sortByRelevance(searched, searchQuery);
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('portal.family.title')}
        </h1>
        <p className="text-gray-600">
          {t('portal.family.placeholder')}
        </p>
      </div>

      {/* Search Bar with Voice */}
      <div className="mb-8">
        <VoiceSearch 
          onSearch={handleSearch}
          placeholder={t('common.search')}
        />
        
        {searchQuery && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Showing results for: <strong>"{searchQuery}"</strong>
            <button 
              onClick={() => setSearchQuery('')}
              className="ml-2 text-primary-600 hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </div>

      {/* Results */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-gray-600">{t('common.noResults')}</p>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-8 text-center text-sm text-muted">
        {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}

export default FamilyPortal;
