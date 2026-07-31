/**
 * Dashboard.tsx
 * ---------------------------------------------------------------------------
 * RakshaNet 360 — Member 4 — Phase 3: Caregiver Dashboard
 *
 * Top-level caregiver screen. Composes:
 *   PatientCard[]     -> patient list with health score, battery, last seen
 *   HealthOverview    -> today's summary for the selected patient
 *   AlertCard[]       -> recent alerts (severity-coded)
 *   Timeline          -> full emergency/SOS/health timeline
 *
 * Data flow (per the spec's WORKFLOW):
 *   Patient App -> Backend -> Caregiver Dashboard -> Real-time Updates -> Emergency Alerts
 *
 * Real-time updates arrive over integration/socket.ts; initial page data is
 * loaded via integration/api.ts (REST). Shared domain types used across the
 * caregiver/* components are defined and exported from this file.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, RefreshCcw } from "lucide-react";

import { Api, PatientDTO } from "../integration/api";
import { socketClient } from "../integration/socket";
import { notificationService } from "../integration/notification";

import { PatientCard } from "./PatientCard";
import { HealthOverview } from "./HealthOverview";
import { AlertCard } from "./AlertCard";
import { Timeline } from "./Timeline";

// ---------------------------------------------------------------------------
// Shared domain types (imported by every caregiver/* component)
// ---------------------------------------------------------------------------

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  healthScore: number;
  batteryLevel: number;
  lastSeen: string;
  sosActive: boolean;
  latitude: number;
  longitude: number;
}

export interface PatientHealthSummary {
  heartRate: number;
  heartRateTrend: number[];
  bloodPressure: string;
  medicationAdherence: number;
  fallDetected: boolean;
  healthScore: number;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  hasLocation: boolean;
  latitude?: number;
  longitude?: number;
}

export interface TimelineEvent {
  id: string;
  type: "sos" | "health" | "location" | "system";
  title: string;
  description?: string;
  timestamp: string;
}

function fromDTO(dto: PatientDTO): Patient {
  return { ...dto };
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [health, setHealth] = useState<PatientHealthSummary | null>(null);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // ---- Initial load ---------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Api.getPatients()
      .then((data) => {
        if (cancelled) return;
        const mapped = data.map(fromDTO);
        setPatients(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Selected patient detail (health + history) ----------------------
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;

    Api.getPatientHealth(selectedId).then((h) => !cancelled && setHealth(h));
    Api.getPatientHistory(selectedId).then((events) => {
      if (cancelled) return;
      setTimeline(events);
      setAlerts(
        events
          .filter((e) => e.type === "sos" || e.type === "health")
          .slice(0, 5)
          .map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description ?? "",
            severity: e.type === "sos" ? "critical" : "warning",
            timestamp: e.timestamp,
            hasLocation: e.type === "sos",
          }))
      );
    });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  // ---- Real-time updates (WebSocket) ------------------------------------
  useEffect(() => {
    notificationService.requestPermission();
    socketClient.connect("/caregiver");

    const unsubSos = socketClient.onType<{ patientId: string; patientName: string; message: string }>(
      "sos",
      (payload) => {
        notificationService.notifySos(payload.patientName, payload.message);
        setToast(`SOS from ${payload.patientName}: ${payload.message}`);
        setPatients((prev) =>
          prev.map((p) => (p.id === payload.patientId ? { ...p, sosActive: true } : p))
        );
      }
    );

    const unsubLocation = socketClient.onType<{ patientId: string; latitude: number; longitude: number }>(
      "location",
      (payload) => {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === payload.patientId
              ? { ...p, latitude: payload.latitude, longitude: payload.longitude }
              : p
          )
        );
      }
    );

    return () => {
      unsubSos();
      unsubLocation();
      socketClient.close();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredPatients = useMemo(
    () =>
      patients.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [patients, search]
  );

  const selectedPatient = patients.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* --------------------------- HEADER --------------------------- */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Caregiver Dashboard</h1>
          <p className="text-xs text-slate-400">RakshaNet 360 · Live patient monitoring</p>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
          <Bell size={18} className="text-slate-500" />
          {alerts.some((a) => a.severity === "critical") && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E53935]" />
          )}
        </button>
      </header>

      {/* -------------------------- SOS TOAST -------------------------- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 mt-4 bg-[#E53935] text-white text-sm rounded-xl px-4 py-3 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------------- PATIENT LIST (left) ------------------- */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-3 py-2.5 mb-4">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients..."
              className="flex-1 text-sm outline-none bg-transparent"
            />
            {loading && <RefreshCcw size={14} className="animate-spin text-slate-300" />}
          </div>

          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {filteredPatients.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                onSelect={(patient) => setSelectedId(patient.id)}
                onCall={(patient) => window.open(`tel:${patient.id}`)}
                onLiveLocation={(patient) => setSelectedId(patient.id)}
              />
            ))}
            {!loading && filteredPatients.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-10">No patients found.</p>
            )}
          </div>
        </div>

        {/* -------------------- DETAIL PANEL (right) -------------------- */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient && health && <HealthOverview summary={health} />}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No recent alerts.</p>
              ) : (
                alerts.map((a) => (
                  <AlertCard key={a.id} alert={a} onViewOnMap={() => {}} />
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Emergency Timeline</h3>
            <Timeline events={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
