import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Globe,
  Bell,
  ShieldCheck,
  Lock,
  Info,
  CheckCircle,
  Smartphone,
  MapPin,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/utils/cn";

export default function Settings() {
  const { isDark, toggle } = useDarkMode();
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState({
    push: true,
    sms: true,
    email: false,
    sound: true,
  });

  const [permissions, setPermissions] = useState({
    gps: true,
    mic: true,
    contacts: true,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight">
          System Preferences & Configuration
        </h1>
        <p className="text-sm text-ink-secondary mt-1">
          Customize dark mode, language, system permissions, and privacy controls.
        </p>
      </div>

      {/* Dark Mode & Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-surface p-6 space-y-4"
      >
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          {isDark ? <Moon className="h-5 w-5 text-indigo-500" /> : <Sun className="h-5 w-5 text-amber-500" />} Appearance & Theme
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-muted border border-line">
          <div>
            <p className="text-sm font-bold text-ink-primary">Dark Theme Mode</p>
            <p className="text-xs text-ink-secondary">Reduces screen eye strain in low-light environments</p>
          </div>
          <button
            onClick={toggle}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors p-1",
              isDark ? "bg-primary-600" : "bg-slate-300"
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded-full bg-white transition-transform shadow-md",
                isDark ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </motion.div>

      {/* Language Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-surface p-6 space-y-4"
      >
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary-500" /> Regional Language
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {["English", "हिन्दी (Hindi)", "বাংলা (Bengali)", "తెలుగు (Telugu)"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                "p-3 rounded-xl border text-center font-bold transition-all",
                language === lang
                  ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
                  : "bg-surface-muted border-line text-ink-secondary hover:text-ink-primary"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-surface p-6 space-y-4"
      >
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary-600" /> Emergency & Alert Notifications
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line text-xs">
            <div>
              <p className="font-bold text-ink-primary">Push SOS Alerts</p>
              <p className="text-ink-secondary">High-priority sound alerts even when silent</p>
            </div>
            <button
              onClick={() => setNotifications((p) => ({ ...p, push: !p.push }))}
              className={cn("h-6 w-10 rounded-full transition-colors p-0.5", notifications.push ? "bg-emerald-600" : "bg-slate-300")}
            >
              <div className={cn("h-5 w-5 rounded-full bg-white transition-transform", notifications.push ? "translate-x-4" : "translate-x-0")} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line text-xs">
            <div>
              <p className="font-bold text-ink-primary">SMS Alerts Fallback</p>
              <p className="text-ink-secondary">Automated SMS dispatch when data is unavailable</p>
            </div>
            <button
              onClick={() => setNotifications((p) => ({ ...p, sms: !p.sms }))}
              className={cn("h-6 w-10 rounded-full transition-colors p-0.5", notifications.sms ? "bg-emerald-600" : "bg-slate-300")}
            >
              <div className={cn("h-5 w-5 rounded-full bg-white transition-transform", notifications.sms ? "translate-x-4" : "translate-x-0")} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Device Permissions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-surface p-6 space-y-4"
      >
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" /> Device Hardware Permissions
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line">
            <span className="font-bold text-ink-primary flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500" /> High-Accuracy GPS Location Access
            </span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Granted</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-muted border border-line">
            <span className="font-bold text-ink-primary flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary-500" /> Emergency Audio Recording Access
            </span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Granted</span>
          </div>
        </div>
      </motion.div>

      {/* About Application */}
      <div className="card-surface p-6 space-y-3">
        <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
          <Info className="h-5 w-5 text-primary-500" /> About RakshaNet 360
        </h3>
        <p className="text-xs text-ink-secondary">
          RakshaNet 360 v1.0.0 — AI Powered Health & Emergency Response Platform.
          Built with React 19, TypeScript, Tailwind CSS, and Leaflet Maps.
        </p>
        <p className="text-[11px] text-ink-secondary">
          © 2026 RakshaNet Health Technologies Inc. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
