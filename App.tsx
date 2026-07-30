import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileSetup from "@/pages/ProfileSetup";
import ComingSoon from "@/pages/ComingSoon";
import { ROUTES } from "@/constants/navigation";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.landing} element={<Landing />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
      </Route>

      <Route path={ROUTES.profileSetup} element={<ProfileSetup />} />

      {/* Built in upcoming steps */}
      <Route path="/app/*" element={<ComingSoon title="RakshaNet App" />} />
      <Route path="*" element={<ComingSoon title="Page not found" />} />
    </Routes>
  );
}

export default App;
