/**
 * main.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Standalone dev entry point.
 *
 * NOTE: if you are integrating this module into the team's existing React
 * app instead of running it standalone, you don't need this file — just
 * import the components (EmergencyMap, Dashboard, etc.) directly into your
 * existing router, and make sure `leaflet/dist/leaflet.css` and this file's
 * `index.css` are imported once at your app's root.
 * ---------------------------------------------------------------------------
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
