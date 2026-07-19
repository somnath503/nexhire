import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import JobsPage from './pages/JobsPage'; 
import SettingsPage from './pages/SettingsPage'; 
import CandidatesPage from './pages/CandidatesPage'; // <-- Import the real page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/candidates" element={<CandidatesPage />} /> {/* <-- Wire the real component */}
          <Route path="/settings" element={<SettingsPage />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;