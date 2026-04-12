import { useTranslation } from 'react-i18next';
import locations from '../data/locations_sample.json';

function formatAddress(address) {
  if (!address) return '';
  if (typeof address === 'string') return address;
  return [address.street, address.city, address.state, address.zip].filter(Boolean).join(', ');
}

function FamilyPortal() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-primary-700 mb-2">
        {t('portal.family.title')}
      </h1>
      <p className="text-neutral-500 mb-6">
        {t('portal.family.placeholder')}
      </p>

      <div className="space-y-4">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-neutral-100 rounded-card shadow-soft p-4"
          >
            <h2 className="text-lg font-semibold text-neutral-800">{loc.name}</h2>
            {loc.address && (
              <p className="text-neutral-500 mt-1">{formatAddress(loc.address)}</p>
            )}
            {loc.hours && (
              <p className="text-neutral-400 text-sm mt-1">{loc.hours}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FamilyPortal;
