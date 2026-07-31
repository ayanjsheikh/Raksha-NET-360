import type { NavItem } from "@/types";

export const PUBLIC_NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

export const ROUTES = {
  landing: "/",
  login: "/login",
  register: "/register",
  profileSetup: "/profile-setup",
  dashboard: "/app/dashboard",
  health: "/app/health",
  sos: "/app/sos",
  emergencyMap: "/app/map",
  womenSafety: "/app/women-safety",
  child: "/app/child",
  elderly: "/app/elderly",
  rural: "/app/rural",
  caregiver: "/app/caregiver",
  reports: "/app/reports",
  profile: "/app/profile",
  settings: "/app/settings",
};

export const APP_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: "LayoutDashboard" },
  { label: "Health Analytics", path: ROUTES.health, icon: "HeartPulse" },
  { label: "Emergency SOS", path: ROUTES.sos, icon: "Siren" },
  { label: "Emergency Map", path: ROUTES.emergencyMap, icon: "MapPinned" },
  { label: "Women Safety", path: ROUTES.womenSafety, icon: "ShieldCheck" },
  { label: "Child Care", path: ROUTES.child, icon: "Baby" },
  { label: "Elderly Care", path: ROUTES.elderly, icon: "Users" },
  { label: "Rural Mode", path: ROUTES.rural, icon: "Signal" },
  { label: "Caregiver Hub", path: ROUTES.caregiver, icon: "UserCheck" },
  { label: "Reports & Trends", path: ROUTES.reports, icon: "FileText" },
  { label: "Profile", path: ROUTES.profile, icon: "UserCircle" },
  { label: "Settings", path: ROUTES.settings, icon: "Settings" },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: "LayoutDashboard" },
  { label: "Health", path: ROUTES.health, icon: "HeartPulse" },
  { label: "SOS", path: ROUTES.sos, icon: "Siren" },
  { label: "Map", path: ROUTES.emergencyMap, icon: "MapPinned" },
  { label: "Profile", path: ROUTES.profile, icon: "UserCircle" },
];
