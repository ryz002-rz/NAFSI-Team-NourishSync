import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Initialize i18n (side-effect import)
import './utils/i18n';

// Components
import LanguageSelector from './components/christian/LanguageSelector';
import Layout from './components/christian/Layout';

// Pages
import Gateway from './components/christian/Gateway';
import FamilyPortal from './pages/FamilyPortal';
import DonorPortal from './pages/DonorPortal';
import VolunteerPortal from './pages/VolunteerPortal';

/**
 * App Component
 * 
 * Pipeline Flow:
 * 1. First visit → LanguageSelector screen
 * 2. User selects language → Stored in localStorage
 * 3. Proceed to Gateway → Portal selection
 * 4. Navigate to portals → Search with voice/text
 * 
 * Returning users skip language selection (preference remembered)
 */
function App() {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(null);

  // Check if user has previously selected a language
  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('nourishnet_prefs') || '{}');
      setHasSelectedLanguage(!!prefs.hasSelectedLanguage);
    } catch (error) {
      setHasSelectedLanguage(false);
    }
  }, []);

  // Handle language selection from LanguageSelector
  const handleLanguageSelected = (langCode) => {
    setHasSelectedLanguage(true);
  };

  // Show loading while checking localStorage
  if (hasSelectedLanguage === null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-pulse">🥗</span>
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Show language selector for first-time visitors
  if (!hasSelectedLanguage) {
    return <LanguageSelector onLanguageSelected={handleLanguageSelected} />;
  }

  // Main app with routing
  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Gateway - Landing page with portal selection */}
          <Route path="/" element={<Gateway />} />
          
          {/* Family Portal - Find food resources */}
          <Route path="/family" element={<FamilyPortal />} />
          
          {/* Donor Portal - Find donation opportunities */}
          <Route path="/donor" element={<DonorPortal />} />
          
          {/* Volunteer Portal - Find volunteer missions */}
          <Route path="/volunteer" element={<VolunteerPortal />} />
          
          {/* Catch-all redirect to Gateway */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
