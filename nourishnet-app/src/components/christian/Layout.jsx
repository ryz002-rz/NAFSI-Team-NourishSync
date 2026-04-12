import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

/**
 * Layout Component
 * 
 * Pipeline Role: Wrapper that provides consistent structure across all pages
 * - Navbar with app branding, language toggle, and navigation
 * - Content area for page-specific content
 * - Mobile-first responsive design
 */
function Layout({ children }) {
  const location = useLocation();
  const { t } = useTranslation();
  const isHomePage = location.pathname === '/';

  // Function to reset language selection (for testing)
  const handleResetLanguage = () => {
    try {
      const prefs = JSON.parse(localStorage.getItem('nourishnet_prefs') || '{}');
      delete prefs.hasSelectedLanguage;
      localStorage.setItem('nourishnet_prefs', JSON.stringify(prefs));
      window.location.reload();
    } catch (error) {
      console.warn('Could not reset language preference:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / App Name */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <span className="text-2xl">🥗</span>
              <span className="text-xl font-bold">{t('gateway.title')}</span>
            </Link>

            {/* Right side: Back link + Language Toggle */}
            <div className="flex items-center gap-4">
              {/* Back to Home - hidden on home page */}
              {!isHomePage && (
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">{t('common.backToHome')}</span>
                </Link>
              )}
              
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Reset Language Button (for testing) */}
              <button
                onClick={handleResetLanguage}
                className="text-xs text-muted hover:text-gray-600 transition-colors"
                title="Reset language selection"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted">
          © 2026 NourishNet — Connecting communities to food resources
        </div>
      </footer>
    </div>
  );
}

export default Layout;
