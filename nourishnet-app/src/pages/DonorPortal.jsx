import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceSearch from '../components/joe/VoiceSearch';
import { searchLocations } from '../utils/searchUtils';
import locationsData from '../data/locations_sample.json';

/**
 * DonorPortal Page
 * 
 * Pipeline Role: Interface for donors to find organizations accepting donations
 */

function DonorCard({ location }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-3xl">💚</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{location.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{location.description}</p>
          
          {/* Donation Info */}
          <div className="space-y-2">
            {location.donation_info?.accepts_food && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span>✓</span> Accepts food donations
              </div>
            )}
            {location.donation_info?.accepts_money && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span>✓</span> Accepts monetary donations
              </div>
            )}
            {location.donation_info?.accepts_other && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span>✓</span> Also accepts: {location.donation_info.accepts_other}
              </div>
            )}
          </div>

          {/* Dropoff Instructions */}
          {location.donation_info?.dropoff_instructions && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              📦 {location.donation_info.dropoff_instructions}
            </p>
          )}

          {/* Donate Button */}
          {location.donation_info?.donation_url && (
            <a
              href={location.donation_info.donation_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-block mt-4 text-sm"
            >
              Donate Now →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function DonorPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter locations that accept donations
  const donorLocations = useMemo(() => {
    const acceptingDonations = locationsData.filter(
      loc => loc.donation_info?.accepts_food || loc.donation_info?.accepts_money
    );
    return searchQuery 
      ? searchLocations(acceptingDonations, searchQuery)
      : acceptingDonations;
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('portal.donor.title')}
        </h1>
        <p className="text-gray-600">
          {t('portal.donor.placeholder')}
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <VoiceSearch 
          onSearch={setSearchQuery}
          placeholder={t('common.search')}
        />
      </div>

      {/* Results */}
      {donorLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donorLocations.map((location) => (
            <DonorCard key={location.id} location={location} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔍</span>
          <p className="text-gray-600">{t('common.noResults')}</p>
        </div>
      )}
    </div>
  );
}

export default DonorPortal;
