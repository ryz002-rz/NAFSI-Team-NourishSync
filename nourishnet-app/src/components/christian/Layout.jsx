import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

function Layout({ children }) {
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <nav className="bg-white border-b border-neutral-200 px-4 py-3 shadow-soft">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold text-primary-700 hover:text-primary-600 transition-colors"
          >
            🥗 NourishNet
          </Link>
          <div className="flex items-center gap-3">
            {!isHome && (
              <Link
                to="/"
                className="text-sm text-neutral-500 hover:text-primary-600 transition-colors"
              >
                {t('common.backToHome')}
              </Link>
            )}
            <LanguageToggle />
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;
