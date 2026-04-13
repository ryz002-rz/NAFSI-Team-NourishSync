import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './UI/LandingPage';
import WelcomePage from './UI/WelcomePage';
import PortalPage from './UI/PortalPage';
import CustomerPage from './UI/CustomerPage';
import FoodTypesPage from './UI/FoodTypesPage';
import FoodDetailPage from './UI/FoodDetailPage';
import NearbyPage from './UI/NearbyPage';
import NowAvailablePage from './UI/NowAvailablePage';
import AboutPage from './UI/AboutPage';
import MapPage from './UI/MapPage';
import DonorPage from './UI/DonorPage';
import DonorMapPage from './UI/DonorMapPage';
import Layout from './components/christian/Layout';
import VolunteerPortal from './pages/VolunteerPortal';
import './utils/i18n';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* UI flow */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/portal" element={<PortalPage />} />

        {/* Customer */}
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/customer/food-types" element={<FoodTypesPage />} />
        <Route path="/customer/food/:foodType" element={<FoodDetailPage />} />
        <Route path="/customer/nearby" element={<NearbyPage />} />
        <Route path="/customer/available" element={<NowAvailablePage />} />
        <Route path="/customer/about" element={<AboutPage />} />
        <Route path="/customer/map" element={<MapPage />} />

        {/* Donor */}
        <Route path="/donor" element={<DonorPage />} />
        <Route path="/donor/map" element={<DonorMapPage />} />
        <Route path="/donor/about" element={<AboutPage />} />

        {/* Volunteer (existing) */}
        <Route path="/volunteer" element={<Layout><VolunteerPortal /></Layout>} />

        {/* Redirects */}
        <Route path="/family" element={<Navigate to="/customer" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
