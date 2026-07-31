import { Route, Routes, Navigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileSetup from "@/pages/ProfileSetup";

import Dashboard from "@/pages/Dashboard";
import Health from "@/pages/Health";
import EmergencySOS from "@/pages/EmergencySOS";
import EmergencyMap from "@/pages/EmergencyMap";
import WomenSafety from "@/pages/WomenSafety";
import ChildCare from "@/pages/ChildCare";
import ElderlyCare from "@/pages/ElderlyCare";
import RuralMode from "@/pages/RuralMode";
import CaregiverDashboard from "@/pages/CaregiverDashboard";
import Reports from "@/pages/Reports";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import ComingSoon from "@/pages/ComingSoon";
import { ROUTES } from "@/constants/navigation";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
      </Route>

      <Route path={ROUTES.profileSetup} element={<ProfileSetup />} />


      {/* Authenticated RakshaNet 360 App Screens */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="health" element={<Health />} />
        <Route path="sos" element={<EmergencySOS />} />
        <Route path="map" element={<EmergencyMap />} />
        <Route path="women-safety" element={<WomenSafety />} />
        <Route path="child" element={<ChildCare />} />
        <Route path="elderly" element={<ElderlyCare />} />
        <Route path="rural" element={<RuralMode />} />
        <Route path="caregiver" element={<CaregiverDashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}


export default App;
