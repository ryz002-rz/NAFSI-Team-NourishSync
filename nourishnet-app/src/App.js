import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/christian/Layout';
import LandingPage from './UI/LandingPage';
import WelcomePage from './UI/WelcomePage';
import PortalPage from './UI/PortalPage';
import FamilyPortal from './pages/FamilyPortal';
import DonorPortal from './pages/DonorPortal';
import VolunteerPortal from './pages/VolunteerPortal';
import './utils/i18n';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* New UI flow — landing is the root */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/portal" element={<PortalPage />} />

        {/* Existing portals with Layout wrapper */}
        <Route path="/family" element={<Layout><FamilyPortal /></Layout>} />
        <Route path="/donor" element={<Layout><DonorPortal /></Layout>} />
        <Route path="/volunteer" element={<Layout><VolunteerPortal /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
