import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import VoiceSearch from '../components/joe/VoiceSearch';
import { searchLocations } from '../utils/searchUtils';
import locationsData from '../data/locations_sample.json';

/**
 * VolunteerPortal Page
 * 
 * Pipeline Role: Interface for volunteers to find opportunities
 */

function VolunteerCard({ location }) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-3xl">🤝</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{location.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{location.description}</p>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>📍</span>
            <span>{location.city}, {location.state}</span>
          </div>

          {/* Volunteer Roles */}
          {location.volunteer_needs?.roles?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Roles Needed:</p>
              <div className="flex flex-wrap gap-2">
                {location.volunteer_needs.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-1 bg-secondary-50 text-secondary-700 rounded-full text-xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {location.volunteer_needs?.contact && (
            <a
              href={`mailto:${location.volunteer_needs.contact}`}
              className="btn-primary inline-block mt-2 text-sm"
            >
              Contact to Volunteer →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function VolunteerPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter locations accepting volunteers
  const volunteerLocations = useMemo(() => {
    const acceptingVolunteers = locationsData.filter(
      loc => loc.volunteer_needs?.accepting_volunteers
    );
    return searchQuery 
      ? searchLocations(acceptingVolunteers, searchQuery)
      : acceptingVolunteers;
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('portal.volunteer.title')}
        </h1>
        <p className="text-gray-600">
          {t('portal.volunteer.placeholder')}
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
      {volunteerLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {volunteerLocations.map((location) => (
            <VolunteerCard key={location.id} location={location} />
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

export default VolunteerPortal;
