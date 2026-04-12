import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Gateway Component (Landing Page)
 * 
 * Pipeline Role: Entry point for users - displays portal options
 * Flow: User lands → sees language toggle (in Layout) → selects portal → navigates
 */

// Portal Card Component
function PortalCard({ to, icon, titleKey, descKey }) {
  const { t } = useTranslation();
  
  return (
    <Link
      to={to}
      className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
    >
      <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {t(titleKey)}
      </h3>
      <p className="text-gray-600 text-sm">
        {t(descKey)}
      </p>
    </Link>
  );
}

function Gateway() {
  const { t } = useTranslation();

  const portals = [
    {
      to: '/family',
      icon: '🍎',
      titleKey: 'gateway.familyPortal',
      descKey: 'gateway.familyPortalDesc',
    },
    {
      to: '/donor',
      icon: '💚',
      titleKey: 'gateway.donorPortal',
      descKey: 'gateway.donorPortalDesc',
    },
    {
      to: '/volunteer',
      icon: '🤝',
      titleKey: 'gateway.volunteerPortal',
      descKey: 'gateway.volunteerPortalDesc',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {t('gateway.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('gateway.subtitle')}
        </p>
      </div>

      {/* Portal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {portals.map((portal) => (
          <PortalCard key={portal.to} {...portal} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-primary-500 font-bold text-2xl">50+</span>
            <span>Food Resources</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary-500 font-bold text-2xl">6</span>
            <span>Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary-500 font-bold text-2xl">DC/MD</span>
            <span>Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gateway;
