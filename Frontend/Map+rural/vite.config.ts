import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// RakshaNet 360 — Member 4 — Vite config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      "@maps": "/maps",
      "@caregiver": "/caregiver",
      "@integration": "/integration",
    },
  },
});
