/**
 * App.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Standalone preview shell
 *
 * Wires up two routes so this module can be run and demoed independently of
 * the rest of the platform:
 *   /            -> Emergency Map (Phase 1 & 2)
 *   /caregiver    -> Caregiver Dashboard (Phase 3)
 *
 * When integrating into the main RakshaNet 360 app, drop these routes into
 * the existing <Routes> tree instead of mounting this file.
 * ---------------------------------------------------------------------------
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import EmergencyMap from "../maps/EmergencyMap";
import Dashboard from "../caregiver/Dashboard";

function NavBar() {
  const location = useLocation();
  const linkClass = (path: string) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      location.pathname === path ? "bg-[#1565C0] text-white" : "bg-white text-slate-600"
    }`;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[2000] flex gap-2 bg-white/70 backdrop-blur rounded-full p-1 shadow-lg">
      <Link to="/" className={linkClass("/")}>
        Emergency Map
      </Link>
      <Link to="/caregiver" className={linkClass("/caregiver")}>
        Caregiver Dashboard
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<EmergencyMap />} />
        <Route path="/caregiver" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
