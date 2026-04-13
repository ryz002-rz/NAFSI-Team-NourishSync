import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './UI/LandingPage';
import WelcomePage from './UI/WelcomePage';
import PortalPage from './UI/PortalPage';
import CustomerPage from './UI/CustomerPage';
import FoodTypesPage from './UI/FoodTypesPage';
import FoodDetailPage from './UI/FoodDetailPage';
import HealthDetailPage from './UI/HealthDetailPage';
import HealthTypesPage from './UI/HealthTypesPage';
import NearbyPage from './UI/NearbyPage';
import NowAvailablePage from './UI/NowAvailablePage';
import SearchResultsPage from './UI/SearchResultsPage';
import MapPage from './UI/MapPage';
import DonorPage from './UI/DonorPage';
import DonorMapPage from './UI/DonorMapPage';
import DonorFoodDetailPage from './UI/DonorFoodDetailPage';
import DonorHealthDetailPage from './UI/DonorHealthDetailPage';
import DonorFoodTypesPage from './UI/DonorFoodTypesPage';
import DonorHealthTypesPage from './UI/DonorHealthTypesPage';
import DonateToPage from './UI/DonateToPage';
import DonorSearchResultsPage from './UI/DonorSearchResultsPage';
import DonorNeedsPage from './UI/DonorNeedsPage';
import VolunteerPage from './UI/VolunteerPage';
import VolunteerMissionsPage from './UI/VolunteerMissionsPage';
import VolunteerSkillDetailPage from './UI/VolunteerSkillDetailPage';
import VolunteerLanguageDetailPage from './UI/VolunteerLanguageDetailPage';
import VolunteerMapPage from './UI/VolunteerMapPage';
import VolunteerSearchResultsPage from './UI/VolunteerSearchResultsPage';
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
        <Route path="/customer/health/:attr" element={<HealthDetailPage />} />
        <Route path="/customer/health-types" element={<HealthTypesPage />} />
        <Route path="/customer/nearby" element={<NearbyPage />} />
        <Route path="/customer/available" element={<NowAvailablePage />} />
        <Route path="/customer/search" element={<SearchResultsPage />} />
        <Route path="/customer/map" element={<MapPage />} />

        {/* Donor */}
        <Route path="/donor" element={<DonorPage />} />
        <Route path="/donor/map" element={<DonorMapPage />} />
        <Route path="/donor/food/:foodType" element={<DonorFoodDetailPage />} />
        <Route path="/donor/health/:attr" element={<DonorHealthDetailPage />} />
        <Route path="/donor/food-types" element={<DonorFoodTypesPage />} />
        <Route path="/donor/health-types" element={<DonorHealthTypesPage />} />
        <Route path="/donor/donate/:locId" element={<DonateToPage />} />
        <Route path="/donor/search" element={<DonorSearchResultsPage />} />
        <Route path="/donor/needs" element={<DonorNeedsPage />} />

        {/* Volunteer */}
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/volunteer/missions" element={<VolunteerMissionsPage />} />
        <Route path="/volunteer/skill/:skillName" element={<VolunteerSkillDetailPage />} />
        <Route path="/volunteer/language/:languageName" element={<VolunteerLanguageDetailPage />} />
        <Route path="/volunteer/map" element={<VolunteerMapPage />} />
        <Route path="/volunteer/search" element={<VolunteerSearchResultsPage />} />

        {/* Redirects */}
        <Route path="/family" element={<Navigate to="/customer" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
