import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './UI/LandingPage';
import WelcomePage from './UI/WelcomePage';
import PortalPage from './UI/PortalPage';
import CustomerPage from './UI/CustomerPage';
import FoodTypesPage from './UI/FoodTypesPage';
import FoodDetailPage from './UI/FoodDetailPage';
import NearbyPage from './UI/NearbyPage';
import MapPage from './UI/MapPage';
import Layout from './components/christian/Layout';
import DonorPortal from './pages/DonorPortal';
import VolunteerPortal from './pages/VolunteerPortal';
import './utils/i18n';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* New UI flow */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/portal" element={<PortalPage />} />

        {/* Customer flow */}
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/customer/food-types" element={<FoodTypesPage />} />
        <Route path="/customer/food/:foodType" element={<FoodDetailPage />} />
        <Route path="/customer/nearby" element={<NearbyPage />} />
        <Route path="/customer/map" element={<MapPage />} />

        {/* Existing portals */}
        <Route path="/family" element={<Navigate to="/customer" replace />} />
        <Route path="/donor" element={<Layout><DonorPortal /></Layout>} />
        <Route path="/volunteer" element={<Layout><VolunteerPortal /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
